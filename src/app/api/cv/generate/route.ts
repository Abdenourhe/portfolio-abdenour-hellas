import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { CvGenerationMethod } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { method = "HEADLESS", locale = "fr" } = await request.json().catch(() => ({}));
    const normalizedLocale = locale === "en" ? "en" : "fr";
    const generationMethod = method === "HTML2PDF" ? CvGenerationMethod.HTML2PDF : CvGenerationMethod.HEADLESS;

    const suffix = normalizedLocale.toUpperCase();
    const pdfPath = path.resolve(process.cwd(), `public/cv/Abdenour_Hellas_CV_${suffix}.pdf`);
    const relativeUrl = `/cv/Abdenour_Hellas_CV_${suffix}.pdf`;

    const templatePath = path.resolve(process.cwd(), "src/components/public/CVPrintTemplate.tsx");
    const templateHash = fs.existsSync(templatePath)
      ? crypto.createHash("md5").update(fs.readFileSync(templatePath, "utf-8")).digest("hex")
      : null;

    let success = false;
    let fileSizeKb = 0;
    let errorMessage: string | null = null;

    if (generationMethod === "HEADLESS") {
      try {
        const scriptPath = path.resolve(process.cwd(), "scripts/generate-cv-pdf.js");
        if (!fs.existsSync(scriptPath)) {
          throw new Error("Script de génération headless introuvable.");
        }
        execSync(`node "${scriptPath}" --locale=${normalizedLocale}`, { stdio: "pipe", timeout: 60000 });
        success = true;
      } catch (err: any) {
        success = false;
        errorMessage = err?.message || "Échec de la génération headless.";
      }
    }

    // HTML2PDF ne génère pas de fichier serveur ; le client le fera lui-même.
    if (generationMethod === "HTML2PDF") {
      success = true;
      fileSizeKb = fs.existsSync(pdfPath) ? Math.round(fs.statSync(pdfPath).size / 1024) : 0;
    } else if (success && fs.existsSync(pdfPath)) {
      fileSizeKb = Math.round(fs.statSync(pdfPath).size / 1024);
    }

    // Met à jour le profil
    const profile = await prisma.profile.findFirst();
    if (profile && success) {
      const updateData: any = {
        cvLastSyncedAt: new Date(),
      };
      if (normalizedLocale === "en") {
        updateData.cvUrlEn = relativeUrl;
        updateData.cvFileNameEn = `Abdenour_Hellas_CV_${suffix}.pdf`;
        updateData.lastCvGeneratedAtEn = new Date();
        updateData.cvTemplateHashEn = templateHash;
      } else {
        updateData.cvUrl = relativeUrl;
        updateData.cvFileName = `Abdenour_Hellas_CV_${suffix}.pdf`;
        updateData.lastCvGeneratedAt = new Date();
        updateData.cvTemplateHash = templateHash;
      }
      await prisma.profile.update({
        where: { id: profile.id },
        data: updateData,
      });
    }

    // Crée un log
    const log = await prisma.cvGenerationLog.create({
      data: {
        method: generationMethod,
        fileSizeKb,
        success,
        error: errorMessage,
        locale: normalizedLocale,
      },
    });

    if (!success) {
      return NextResponse.json(
        { error: errorMessage || "Échec de la génération du PDF.", log },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      fileSizeKb,
      log,
    });
  } catch (error: any) {
    console.error("Failed to generate CV PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate CV PDF", message: error?.message },
      { status: 500 }
    );
  }
}
