-- CreateEnum
CREATE TYPE "AdmissionRequestStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACT_REQUIRED', 'APPOINTMENT_SCHEDULED', 'MISSING_DOCUMENTS', 'PRE_ACCEPTED', 'FINAL_REGISTERED', 'INCOMPLETE', 'WAITING_LIST', 'CANCELLED');

CREATE TYPE "NoteVisibility" AS ENUM ('INTERNAL', 'PARENT_VISIBLE');
CREATE TYPE "AppointmentType" AS ENUM ('VISIT', 'INTERVIEW', 'PHONE_CALL', 'DOCUMENTS');
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'DONE', 'CANCELLED', 'MISSED');
CREATE TYPE "ActivityEntityType" AS ENUM ('ADMISSION_REQUEST', 'INTERNAL_NOTE', 'APPOINTMENT', 'USER');
CREATE TYPE "ActivityAction" AS ENUM ('STATUS_CHANGED', 'ASSIGNED', 'NOTE_ADDED', 'APPOINTMENT_CREATED', 'APPOINTMENT_UPDATED', 'APPOINTMENT_CANCELLED', 'REQUEST_UPDATED', 'REQUEST_VIEWED', 'EXPORT_REQUESTS');

-- Application: new columns
ALTER TABLE "Application" ADD COLUMN "assignedToId" TEXT;
ALTER TABLE "Application" ADD COLUMN "parentWhatsapp" TEXT;
ALTER TABLE "Application" ADD COLUMN "studentNotes" TEXT;
ALTER TABLE "Application" ADD COLUMN "parentMessage" TEXT;
ALTER TABLE "Application" ADD COLUMN "status_new" "AdmissionRequestStatus";

-- Migrate status values
UPDATE "Application" SET "status_new" = CASE "status"::text
  WHEN 'NEW' THEN 'NEW'::"AdmissionRequestStatus"
  WHEN 'UNDER_REVIEW' THEN 'IN_REVIEW'::"AdmissionRequestStatus"
  WHEN 'AWAITING_CONTACT' THEN 'CONTACT_REQUIRED'::"AdmissionRequestStatus"
  WHEN 'SCHEDULED' THEN 'APPOINTMENT_SCHEDULED'::"AdmissionRequestStatus"
  WHEN 'DOCUMENTS_MISSING' THEN 'MISSING_DOCUMENTS'::"AdmissionRequestStatus"
  WHEN 'PRELIMINARY_ACCEPTED' THEN 'PRE_ACCEPTED'::"AdmissionRequestStatus"
  WHEN 'ENROLLED' THEN 'FINAL_REGISTERED'::"AdmissionRequestStatus"
  WHEN 'INCOMPLETE' THEN 'INCOMPLETE'::"AdmissionRequestStatus"
  ELSE 'NEW'::"AdmissionRequestStatus"
END;

ALTER TABLE "Application" DROP COLUMN "status";
ALTER TABLE "Application" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'NEW';
ALTER TABLE "Application" ALTER COLUMN "status" SET NOT NULL;

-- StatusHistory: migrate enum columns before dropping ApplicationStatus
ALTER TABLE "StatusHistory" ADD COLUMN IF NOT EXISTS "note" TEXT;
ALTER TABLE "StatusHistory" ADD COLUMN "fromStatus_new" "AdmissionRequestStatus";
ALTER TABLE "StatusHistory" ADD COLUMN "toStatus_new" "AdmissionRequestStatus";

UPDATE "StatusHistory" SET
  "fromStatus_new" = CASE
    WHEN "fromStatus" IS NULL THEN NULL
    WHEN "fromStatus"::text = 'NEW' THEN 'NEW'::"AdmissionRequestStatus"
    WHEN "fromStatus"::text = 'UNDER_REVIEW' THEN 'IN_REVIEW'::"AdmissionRequestStatus"
    WHEN "fromStatus"::text = 'AWAITING_CONTACT' THEN 'CONTACT_REQUIRED'::"AdmissionRequestStatus"
    WHEN "fromStatus"::text = 'SCHEDULED' THEN 'APPOINTMENT_SCHEDULED'::"AdmissionRequestStatus"
    WHEN "fromStatus"::text = 'DOCUMENTS_MISSING' THEN 'MISSING_DOCUMENTS'::"AdmissionRequestStatus"
    WHEN "fromStatus"::text = 'PRELIMINARY_ACCEPTED' THEN 'PRE_ACCEPTED'::"AdmissionRequestStatus"
    WHEN "fromStatus"::text = 'ENROLLED' THEN 'FINAL_REGISTERED'::"AdmissionRequestStatus"
    WHEN "fromStatus"::text = 'INCOMPLETE' THEN 'INCOMPLETE'::"AdmissionRequestStatus"
    ELSE 'NEW'::"AdmissionRequestStatus"
  END,
  "toStatus_new" = CASE "toStatus"::text
    WHEN 'NEW' THEN 'NEW'::"AdmissionRequestStatus"
    WHEN 'UNDER_REVIEW' THEN 'IN_REVIEW'::"AdmissionRequestStatus"
    WHEN 'AWAITING_CONTACT' THEN 'CONTACT_REQUIRED'::"AdmissionRequestStatus"
    WHEN 'SCHEDULED' THEN 'APPOINTMENT_SCHEDULED'::"AdmissionRequestStatus"
    WHEN 'DOCUMENTS_MISSING' THEN 'MISSING_DOCUMENTS'::"AdmissionRequestStatus"
    WHEN 'PRELIMINARY_ACCEPTED' THEN 'PRE_ACCEPTED'::"AdmissionRequestStatus"
    WHEN 'ENROLLED' THEN 'FINAL_REGISTERED'::"AdmissionRequestStatus"
    WHEN 'INCOMPLETE' THEN 'INCOMPLETE'::"AdmissionRequestStatus"
    ELSE 'NEW'::"AdmissionRequestStatus"
  END;

ALTER TABLE "StatusHistory" DROP COLUMN "fromStatus";
ALTER TABLE "StatusHistory" DROP COLUMN "toStatus";
ALTER TABLE "StatusHistory" RENAME COLUMN "fromStatus_new" TO "fromStatus";
ALTER TABLE "StatusHistory" RENAME COLUMN "toStatus_new" TO "toStatus";
ALTER TABLE "StatusHistory" ALTER COLUMN "toStatus" SET NOT NULL;

DROP TYPE "ApplicationStatus";

-- InternalNote
ALTER TABLE "InternalNote" ADD COLUMN "visibility" "NoteVisibility" NOT NULL DEFAULT 'INTERNAL';
ALTER TABLE "InternalNote" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- FK assignedTo
CREATE INDEX "Application_assignedToId_idx" ON "Application"("assignedToId");
CREATE INDEX "Application_status_idx" ON "Application"("status");
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

ALTER TABLE "Application" ADD CONSTRAINT "Application_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AdmissionAppointment
CREATE TABLE "AdmissionAppointment" (
    "id" TEXT NOT NULL,
    "admissionRequestId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "note" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdmissionAppointment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdmissionAppointment_admissionRequestId_idx" ON "AdmissionAppointment"("admissionRequestId");
CREATE INDEX "AdmissionAppointment_scheduledAt_idx" ON "AdmissionAppointment"("scheduledAt");

ALTER TABLE "AdmissionAppointment" ADD CONSTRAINT "AdmissionAppointment_admissionRequestId_fkey" FOREIGN KEY ("admissionRequestId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdmissionAppointment" ADD CONSTRAINT "AdmissionAppointment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ActivityLog
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "entityType" "ActivityEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "admissionRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");
CREATE INDEX "ActivityLog_admissionRequestId_idx" ON "ActivityLog"("admissionRequestId");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_admissionRequestId_fkey" FOREIGN KEY ("admissionRequestId") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;
