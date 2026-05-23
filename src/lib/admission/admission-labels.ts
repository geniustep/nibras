import type { AdmissionRequestStatus } from "@prisma/client";

export const ADMISSION_STATUS_LABELS: Record<AdmissionRequestStatus, string> = {
  NEW: "جديد",
  IN_REVIEW: "قيد المراجعة",
  CONTACT_REQUIRED: "يحتاج تواصلًا",
  APPOINTMENT_SCHEDULED: "موعد محدد",
  MISSING_DOCUMENTS: "وثائق ناقصة",
  PRE_ACCEPTED: "مقبول مبدئيًا",
  FINAL_REGISTERED: "مسجل نهائيًا",
  INCOMPLETE: "غير مكتمل",
  WAITING_LIST: "لائحة الانتظار",
  CANCELLED: "ملغى",
};

/** حالة مبسطة لولي الأمر — بدون تفاصيل داخلية */
export const PARENT_STATUS_LABELS: Record<AdmissionRequestStatus, string> = {
  NEW: "طلبكم قيد الاستلام",
  IN_REVIEW: "طلبكم قيد المراجعة",
  CONTACT_REQUIRED: "سيتواصل معكم الطاقم الإداري قريبًا",
  APPOINTMENT_SCHEDULED: "تم تحديد موعد",
  MISSING_DOCUMENTS: "يرجى استكمال الوثائق",
  PRE_ACCEPTED: "قبول مبدئي — استكمال الإجراءات",
  FINAL_REGISTERED: "مسجل نهائيًا",
  INCOMPLETE: "طلب غير مكتمل",
  WAITING_LIST: "طلبكم في لائحة الانتظار",
  CANCELLED: "الطلب غير متاح",
};

export const ADMISSION_STATUS_COLORS: Record<AdmissionRequestStatus, string> = {
  NEW: "bg-blue-100 text-[#1D4395]",
  IN_REVIEW: "bg-indigo-100 text-indigo-900",
  CONTACT_REQUIRED: "bg-purple-100 text-purple-900",
  APPOINTMENT_SCHEDULED: "bg-cyan-100 text-cyan-900",
  MISSING_DOCUMENTS: "bg-orange-100 text-orange-900",
  PRE_ACCEPTED: "bg-emerald-100 text-emerald-900",
  FINAL_REGISTERED: "bg-[#1D4395] text-white",
  INCOMPLETE: "bg-slate-200 text-slate-700",
  WAITING_LIST: "bg-amber-100 text-amber-900",
  CANCELLED: "bg-slate-300 text-slate-800",
};

export const ALL_ADMISSION_STATUSES = Object.keys(
  ADMISSION_STATUS_LABELS
) as AdmissionRequestStatus[];

export const TERMINAL_STATUSES: AdmissionRequestStatus[] = [
  "FINAL_REGISTERED",
  "CANCELLED",
];
