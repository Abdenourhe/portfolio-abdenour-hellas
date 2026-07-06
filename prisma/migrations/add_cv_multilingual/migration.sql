-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "cvUrlEn" TEXT,
ADD COLUMN     "cvFileNameEn" TEXT,
ADD COLUMN     "lastCvGeneratedAtEn" TIMESTAMP(3),
ADD COLUMN     "cvTemplateHashEn" TEXT,
ADD COLUMN     "cvLastSyncedAtEn" TIMESTAMP(3),
ADD COLUMN     "cvPrintTitleEn" TEXT,
ADD COLUMN     "cvPrintBioEn" TEXT;

-- AlterTable
ALTER TABLE "CvGenerationLog" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fr';

-- CreateIndex
CREATE INDEX "CvGenerationLog_locale_generatedAt_idx" ON "CvGenerationLog"("locale", "generatedAt" DESC);
