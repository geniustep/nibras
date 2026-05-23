-- DropColumns
ALTER TABLE "Application" DROP COLUMN "parentRelationship",
DROP COLUMN "referralSource",
DROP COLUMN "referralDetails";

-- DropEnum
DROP TYPE "ReferralSource";
