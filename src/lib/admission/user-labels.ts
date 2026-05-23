import type { UserRole, UserStatus } from "@prisma/client";

/** تسميات الدور / الصلاحية داخل النظام */
export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "المدير العام",
  ADMIN: "الإدارة",
  ADMISSION_STAFF: "موظف التسجيل",
  VIEWER: "مشاهدة فقط",
};

/** تسميات حالة الحساب */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "نشط",
  PENDING: "في انتظار الموافقة",
  SUSPENDED: "موقوف",
  REJECTED: "مرفوض",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-[#0E2250] text-white",
  ADMIN: "bg-[#1D4395] text-white",
  ADMISSION_STAFF: "bg-blue-100 text-[#1D4395]",
  VIEWER: "bg-slate-200 text-slate-700",
};

export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800",
  PENDING: "bg-amber-100 text-amber-900",
  SUSPENDED: "bg-orange-100 text-orange-900",
  REJECTED: "bg-red-100 text-red-800",
};

export const ALL_USER_ROLES = Object.keys(ROLE_LABELS) as UserRole[];
export const ALL_USER_STATUSES = Object.keys(USER_STATUS_LABELS) as UserStatus[];

export const USER_STATUS_LOGIN_MESSAGES: Record<
  Exclude<UserStatus, "ACTIVE">,
  string
> = {
  PENDING: "حسابكم في انتظار الموافقة. يرجى التواصل مع الإدارة.",
  SUSPENDED: "حسابكم موقوف مؤقتًا. يرجى التواصل مع الإدارة.",
  REJECTED: "تم رفض حسابكم. يرجى التواصل مع الإدارة.",
};
