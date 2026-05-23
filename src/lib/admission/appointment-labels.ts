import type { AppointmentStatus, AppointmentType } from "@prisma/client";

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  VISIT: "زيارة المؤسسة",
  INTERVIEW: "مقابلة",
  PHONE_CALL: "اتصال هاتفي",
  DOCUMENTS: "إكمال الوثائق",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: "محدد",
  DONE: "تم",
  CANCELLED: "ملغى",
  MISSED: "لم يحضر",
};
