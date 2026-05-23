import type { UserRole, UserStatus } from "@prisma/client";
import {
  ROLE_COLORS,
  ROLE_LABELS,
  USER_STATUS_COLORS,
  USER_STATUS_LABELS,
} from "@/lib/admission/user-labels";

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ROLE_COLORS[role]}`}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}

export function UserAccountStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${USER_STATUS_COLORS[status]}`}
    >
      {USER_STATUS_LABELS[status]}
    </span>
  );
}
