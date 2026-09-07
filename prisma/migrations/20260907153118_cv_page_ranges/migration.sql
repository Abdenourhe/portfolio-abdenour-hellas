-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "cvUrlEn",
DROP COLUMN "cvFileNameEn",
DROP COLUMN "cvUrlAr",
DROP COLUMN "cvFileNameAr",
ADD COLUMN "cvPageRanges" JSONB;
