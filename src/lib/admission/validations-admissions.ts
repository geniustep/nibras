import { z } from "zod";
import { ALL_ADMISSION_STATUSES } from "@/lib/admission/admission-labels";
import { ALL_CYCLES, ALL_LEVELS, ALL_TRACKS } from "@/lib/admission/school-levels";

const admissionStatuses = [
  "NEW",
  "IN_REVIEW",
  "CONTACT_REQUIRED",
  "APPOINTMENT_SCHEDULED",
  "MISSING_DOCUMENTS",
  "PRE_ACCEPTED",
  "FINAL_REGISTERED",
  "INCOMPLETE",
  "WAITING_LIST",
  "CANCELLED",
] as const;

export const admissionStatusChangeSchema = z.object({
  status: z.enum(admissionStatuses),
  note: z.string().max(1000).optional(),
});

export const admissionAssignSchema = z.object({
  assignedToId: z.union([z.string().cuid(), z.null()]),
});

export const admissionNoteSchema = z.object({
  content: z.string().min(2, "الملاحظة قصيرة جدًا").max(2000),
});

export const admissionAppointmentSchema = z.object({
  scheduledAt: z.string().min(1, "التاريخ مطلوب"),
  type: z.enum(["VISIT", "INTERVIEW", "PHONE_CALL", "DOCUMENTS"]),
  note: z.string().max(1000).optional(),
  autoSetStatus: z.boolean().optional(),
});

export const appointmentUpdateSchema = z.object({
  status: z.enum(["SCHEDULED", "DONE", "CANCELLED", "MISSED"]).optional(),
  scheduledAt: z.string().optional(),
  note: z.string().max(1000).optional(),
});

export const admissionParentMessageSchema = z.object({
  parentMessage: z.string().max(2000).optional(),
});
