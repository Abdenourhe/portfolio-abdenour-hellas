import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function fileHash(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    return crypto.createHash("md5").update(content).digest("hex");
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const templatePath = path.resolve(process.cwd(), "src/components/public/CVPrintTemplate.tsx");
    const htmlPath = path.resolve(process.cwd(), "public/cv/cv-print.html");
    const pdfPath = path.resolve(process.cwd(), "public/cv/Abdenour_Hellas_CV.pdf");

    const templateHash = fileHash(templatePath);
    const htmlHash = fileHash(htmlPath);
    const pdfMtime = fs.existsSync(pdfPath) ? fs.statSync(pdfPath).mtime : null;

    const profile = await prisma.profile.findFirst();
    const lastSyncedAt = profile?.cvLastSyncedAt;
    const lastGeneratedAt = profile?.lastCvGeneratedAt;
    const storedTemplateHash = profile?.cvTemplateHash;

    // Désynchronisé si le hash du template React diffère de celui du HTML statique,
    // ou si le hash stocké en base ne correspond plus au template actuel.
    let desynchronized = false;
    let reason: string | null = null;

    if (templateHash && htmlHash && templateHash !== htmlHash) {
      desynchronized = true;
      reason = "Le template React et le HTML statique ont des contenus différents.";
    } else if (storedTemplateHash && templateHash && storedTemplateHash !== templateHash) {
      desynchronized = true;
      reason = "Le template React a été modifié depuis la dernière synchronisation.";
    }

    const pdfOutdated = !!(pdfMtime && lastGeneratedAt && new Date(lastGeneratedAt) > pdfMtime);

    return NextResponse.json({
      status: desynchronized ? "desynchronized" : "synchronized",
      reason,
      templateHash,
      htmlHash,
      hashesMatch: templateHash === htmlHash,
      pdfOutdated,
      templateMtime: fs.existsSync(templatePath) ? fs.statSync(templatePath).mtime.toISOString() : null,
      htmlMtime: fs.existsSync(htmlPath) ? fs.statSync(htmlPath).mtime.toISOString() : null,
      pdfMtime: pdfMtime?.toISOString() || null,
      cvLastSyncedAt: lastSyncedAt?.toISOString() || null,
      lastCvGeneratedAt: lastGeneratedAt?.toISOString() || null,
      cvUrl: profile?.cvUrl || null,
      cvFileName: profile?.cvFileName || null,
      cvGenerationMode: profile?.cvGenerationMode || "HEADLESS",
    });
  } catch (error: any) {
    console.error("Failed to fetch CV status:", error);
    return NextResponse.json(
      { error: "Failed to fetch CV status", message: error?.message },
      { status: 500 }
    );
  }
}
