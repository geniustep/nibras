import type { Gender } from "@prisma/client";

export {
  ADMISSION_STATUS_LABELS as STATUS_LABELS,
  ADMISSION_STATUS_COLORS as STATUS_COLORS,
  ALL_ADMISSION_STATUSES as ALL_STATUSES,
} from "@/lib/admission/admission-labels";

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "ذكر",
  FEMALE: "أنثى",
};
