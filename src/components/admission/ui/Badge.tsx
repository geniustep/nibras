import type { AdmissionRequestStatus } from "@prisma/client";
import { AdmissionStatusBadge } from "@/components/admission/ui/AdmissionStatusBadge";

/** شارة حالة طلب التسجيل */
export function StatusBadge({ status }: { status: AdmissionRequestStatus }) {
  return <AdmissionStatusBadge status={status} />;
}
