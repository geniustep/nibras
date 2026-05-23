import type { AdmissionRequestStatus } from "@prisma/client";
import {
  ADMISSION_STATUS_COLORS,
  ADMISSION_STATUS_LABELS,
} from "@/lib/admission/admission-labels";

export function AdmissionStatusBadge({
  status,
}: {
  status: AdmissionRequestStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ADMISSION_STATUS_COLORS[status]}`}
    >
      {ADMISSION_STATUS_LABELS[status]}
    </span>
  );
}
