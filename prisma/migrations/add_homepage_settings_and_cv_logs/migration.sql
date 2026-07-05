-- CreateEnum
CREATE TYPE "CvGenerationMethod" AS ENUM ('HEADLESS', 'HTML2PDF');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "cvGenerationMode" "CvGenerationMethod" NOT NULL DEFAULT 'HEADLESS',
ADD COLUMN     "cvLastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "cvTemplateHash" TEXT,
ADD COLUMN     "lastCvGeneratedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "HomepageSettings" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT,
    "heroTitleEn" TEXT,
    "heroTitleAr" TEXT,
    "heroSubtitle" TEXT,
    "heroSubtitleEn" TEXT,
    "heroSubtitleAr" TEXT,
    "typewriterPhrasesFr" TEXT[],
    "typewriterPhrasesEn" TEXT[],
    "typewriterPhrasesAr" TEXT[],
    "sectionsOrder" TEXT[],
    "sectionsVisibility" JSONB,
    "featuredProjectIds" TEXT[],
    "visibleStatsTypes" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CvGenerationLog" (
    "id" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" "CvGenerationMethod" NOT NULL,
    "fileSizeKb" INTEGER,
    "success" BOOLEAN NOT NULL,
    "error" TEXT,

    CONSTRAINT "CvGenerationLog_pkey" PRIMARY KEY ("id")
);
