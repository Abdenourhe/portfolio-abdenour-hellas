-- AlterTable
ALTER TABLE "Education" ADD COLUMN "url" TEXT;

-- AlterTable
ALTER TABLE "Experience" ADD COLUMN "url" TEXT;

-- DropTable
DROP TABLE IF EXISTS "Certification";
