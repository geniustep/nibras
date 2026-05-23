import type { AdminUser, UserRole } from "@prisma/client";
import { ADMISSION_STAFF_CAN_VIEW_ALL } from "@/lib/admission/config";

export type AuthAdmin = Pick<
  AdminUser,
  "id" | "email" | "name" | "role" | "status"
>;

export function isActiveUser(user: AuthAdmin): boolean {
  return user.status === "ACTIVE";
}

export function canViewAllRequests(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canStaffViewRequest(
  user: AuthAdmin,
  assignedToId: string | null
): boolean {
  if (!canViewAllRequests(user.role)) {
    if (user.role === "VIEWER") return true;
    if (user.role === "ADMISSION_STAFF") {
      if (ADMISSION_STAFF_CAN_VIEW_ALL) return true;
      return assignedToId === user.id;
    }
    return false;
  }
  return true;
}

export function canModifyRequest(user: AuthAdmin, assignedToId: string | null): boolean {
  if (user.role === "VIEWER") return false;
  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") return true;
  if (user.role === "ADMISSION_STAFF") {
    return assignedToId === user.id;
  }
  return false;
}

export function canChangeStatus(user: AuthAdmin, assignedToId: string | null): boolean {
  return canModifyRequest(user, assignedToId);
}

export function canAssignRequest(user: AuthAdmin): boolean {
  return user.role === "SUPER_ADMIN" || user.role === "ADMIN";
}

/** تعديل بيانات التلميذ/ولي الأمر (كل الموظفين ما عدا VIEWER) */
export function canEditAdmissionRecord(user: AuthAdmin): boolean {
  return (
    user.role === "SUPER_ADMIN" ||
    user.role === "ADMIN" ||
    user.role === "ADMISSION_STAFF"
  );
}

/** حذف الطلب — المدير والمدير العام فقط */
export function canDeleteAdmission(user: AuthAdmin): boolean {
  return user.role === "SUPER_ADMIN" || user.role === "ADMIN";
}

export function canAddNote(user: AuthAdmin, assignedToId: string | null): boolean {
  if (user.role === "VIEWER") return false;
  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") return true;
  if (user.role === "ADMISSION_STAFF") return assignedToId === user.id;
  return false;
}

export function canViewNotes(user: AuthAdmin): boolean {
  return user.role !== "VIEWER" || true; // VIEWER: read-only
}

export function canManageAppointments(
  user: AuthAdmin,
  assignedToId: string | null
): boolean {
  return canModifyRequest(user, assignedToId);
}

export function assignableRoles(): UserRole[] {
  return ["ADMIN", "ADMISSION_STAFF"];
}
