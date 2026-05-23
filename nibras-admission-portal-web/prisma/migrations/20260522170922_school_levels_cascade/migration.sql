-- CreateEnum
CREATE TYPE "SchoolCycle" AS ENUM ('EARLY_CHILDHOOD', 'PRIMARY', 'MIDDLE_SCHOOL', 'HIGH_SCHOOL');

-- CreateEnum
CREATE TYPE "SchoolLevel" AS ENUM ('AGE_3', 'AGE_4', 'AGE_5', 'PRIMARY_1', 'PRIMARY_2', 'PRIMARY_3', 'PRIMARY_4', 'PRIMARY_5', 'PRIMARY_6', 'MIDDLE_1', 'MIDDLE_2', 'MIDDLE_3', 'COMMON_CORE');

-- CreateEnum
CREATE TYPE "CommonCoreTrack" AS ENUM ('SCIENTIFIC', 'LITERARY', 'TECHNOLOGICAL');

-- Add new columns (nullable during migration)
ALTER TABLE "Application"
ADD COLUMN "schoolCycle" "SchoolCycle",
ADD COLUMN "schoolLevel" "SchoolLevel",
ADD COLUMN "commonCoreTrack" "CommonCoreTrack";

-- Migrate legacy desiredLevel values
UPDATE "Application"
SET
  "schoolCycle" = CASE "desiredLevel"::text
    WHEN 'PREPARATORY' THEN 'EARLY_CHILDHOOD'::"SchoolCycle"
    WHEN 'PRIMARY' THEN 'PRIMARY'::"SchoolCycle"
    WHEN 'MIDDLE' THEN 'MIDDLE_SCHOOL'::"SchoolCycle"
    WHEN 'HIGH_SCHOOL' THEN 'HIGH_SCHOOL'::"SchoolCycle"
  END,
  "schoolLevel" = CASE "desiredLevel"::text
    WHEN 'PREPARATORY' THEN 'AGE_3'::"SchoolLevel"
    WHEN 'PRIMARY' THEN 'PRIMARY_1'::"SchoolLevel"
    WHEN 'MIDDLE' THEN 'MIDDLE_1'::"SchoolLevel"
    WHEN 'HIGH_SCHOOL' THEN 'COMMON_CORE'::"SchoolLevel"
  END
WHERE "desiredLevel" IS NOT NULL;

-- Drop legacy column and enum
ALTER TABLE "Application" DROP COLUMN "desiredLevel";
DROP TYPE "DesiredLevel";

-- Enforce NOT NULL on required fields
ALTER TABLE "Application"
ALTER COLUMN "schoolCycle" SET NOT NULL,
ALTER COLUMN "schoolLevel" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Application_schoolCycle_idx" ON "Application"("schoolCycle");

-- CreateIndex
CREATE INDEX "Application_schoolLevel_idx" ON "Application"("schoolLevel");
