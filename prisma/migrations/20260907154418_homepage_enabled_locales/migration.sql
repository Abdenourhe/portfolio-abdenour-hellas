-- AlterTable
ALTER TABLE "HomepageSettings" ADD COLUMN "enabledLocales" TEXT[] DEFAULT ARRAY['fr', 'en', 'ar']::TEXT[];
