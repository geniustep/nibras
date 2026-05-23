import { prisma } from "@/lib/admission/prisma";
import { ADMISSION_STAFF_CAN_VIEW_ALL } from "@/lib/admission/config";
import type { AuthAdmin } from "@/lib/admission/admission-permissions";
import { canStaffViewRequest } from "@/lib/admission/admission-permissions";
import {
  admissionOrderBy,
  buildAdmissionWhere,
  type AdmissionListFilters,
} from "@/lib/admission/admissions/service";

const listInclude = {
  assignedTo: { select: { id: true, name: true } },
  appointments: {
    where: { status: "SCHEDULED" as const },
    orderBy: { scheduledAt: "asc" as const },
    take: 1,
    select: { scheduledAt: true, type: true },
  },
} as const;

export async function listAdmissionRequests(
  user: AuthAdmin,
  filters: AdmissionListFilters,
  sort: string
) {
  const where = buildAdmissionWhere(user, filters);

  let items = await prisma.admissionRequest.findMany({
    where,
    orderBy: admissionOrderBy(sort),
    take: 200,
    include: listInclude,
  });

  if (user.role === "ADMISSION_STAFF" && ADMISSION_STAFF_CAN_VIEW_ALL) {
    items = items.filter((r) => canStaffViewRequest(user, r.assignedToId));
  }

  return items;
}

export async function getAdmissionDetail(id: string) {
  return prisma.admissionRequest.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true, phone: true } },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        include: { changedBy: { select: { name: true } } },
      },
      notes: {
        where: { visibility: "INTERNAL" },
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
      appointments: {
        orderBy: { scheduledAt: "desc" },
        include: { createdBy: { select: { name: true } } },
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: { select: { name: true } } },
      },
    },
  });
}
