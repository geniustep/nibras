-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'ADMISSION_STAFF', 'VIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMISSION_STAFF',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "AdminUser_role_idx" ON "AdminUser"("role");

-- CreateIndex
CREATE INDEX "AdminUser_status_idx" ON "AdminUser"("status");

-- ترقية الحسابات الحالية (المسؤول الأول)
UPDATE "AdminUser"
SET "role" = 'SUPER_ADMIN', "status" = 'ACTIVE'
WHERE "role" = 'ADMISSION_STAFF' AND "status" = 'PENDING';
