import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CvGenerationMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      "src/components/public/CVPrintTemplate.tsx"
    );
    const htmlPath = path.resolve(process.cwd(), "public/cv/cv-print.html");
    const pdfPath = path.resolve(process.cwd(), "public/cv/Abdenour_Hellas_CV.pdf");

    const templateMtime = fs.existsSync(templatePath)
      ? fs.statSync(templatePath).mtime
      : null;
    const htmlMtime = fs.existsSync(htmlPath) ? fs.statSync(htmlPath).mtime : null;
    const pdfMtime = fs.existsSync(pdfPath) ? fs.statSync(pdfPath).mtime : null;

    const profile = await prisma.profile.findFirst();
    const lastSyncedAt = profile?.cvLastSyncedAt;
    const lastGeneratedAt = profile?.lastCvGeneratedAt;

    // Désynchronisé si le template React est plus récent que cv-print.html
    // ou que la dernière synchronisation enregistrée.
    let desynchronized = false;
    if (templateMtime) {
      if (htmlMtime && templateMtime > htmlMtime) {
        desynchronized = true;
      }
      if (lastSyncedAt && templateMtime > new Date(lastSyncedAt)) {
        desynchronized = true;
      }
    }

    const htmlOutdated = !!(
      templateMtime &&
      htmlMtime &&
      templateMtime.getTime() > htmlMtime.getTime()
    );

    const pdfOutdated = !!(
      htmlMtime &&
      pdfMtime &&
      htmlMtime.getTime() > pdfMtime.getTime()
    );

    return NextResponse.json({
      status: desynchronized ? "desynchronized" : "synchronized",
      htmlOutdated,
      pdfOutdated,
      templateMtime: templateMtime?.toISOString() || null,
      htmlMtime: htmlMtime?.toISOString() || null,
      pdfMtime: pdfMtime?.toISOString() || null,
      cvLastSyncedAt: lastSyncedAt?.toISOString() || null,
      lastCvGeneratedAt: lastGeneratedAt?.toISOString() || null,
      cvUrl: profile?.cvUrl || null,
      cvFileName: profile?.cvFileName || null,
      cvGenerationMode: profile?.cvGenerationMode || CvGenerationMethod.HEADLESS,
    });
  } catch (error: any) {
    console.error("Failed to fetch CV status:", error);
    return NextResponse.json(
      { error: "Failed to fetch CV status", message: error?.message },
      { status: 500 }
    );
  }
}
