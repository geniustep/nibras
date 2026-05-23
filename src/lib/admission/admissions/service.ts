import type {
  AdmissionRequestStatus,
  AppointmentStatus,
  AppointmentType,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/admission/prisma";
import { logActivity } from "@/lib/admission/activity-log";
import { ADMISSION_STATUS_LABELS } from "@/lib/admission/admission-labels";
import { TERMINAL_STATUSES } from "@/lib/admission/admission-labels";
import { ADMISSION_STAFF_CAN_VIEW_ALL } from "@/lib/admission/config";
import type { AuthAdmin } from "@/lib/admission/admission-permissions";
import {
  canAssignRequest,
  canChangeStatus,
  canManageAppointments,
  canModifyRequest,
} from "@/lib/admission/admission-permissions";

export async function getRequestOrThrow(id: string) {
  const request = await prisma.admissionRequest.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });
  if (!request) throw new Error("NOT_FOUND");
  return request;
}

export function assertCanModify(user: AuthAdmin, assignedToId: string | null) {
  if (!canModifyRequest(user, assignedToId)) throw new Error("FORBIDDEN");
}

export async function changeRequestStatus(
  user: AuthAdmin,
  requestId: string,
  newStatus: AdmissionRequestStatus,
  note?: string
) {
  const request = await getRequestOrThrow(requestId);
  if (!canChangeStatus(user, request.assignedToId)) throw new Error("FORBIDDEN");
  if (request.status === newStatus) return request;

  return prisma.$transaction(async (tx) => {
    await tx.requestStatusHistory.create({
      data: {
        admissionRequestId: requestId,
        oldStatus: request.status,
        newStatus,
        changedById: user.id,
        note: note || null,
      },
    });

    const updated = await tx.admissionRequest.update({
      where: { id: requestId },
      data: { status: newStatus },
    });

    await logActivity(
      {
        userId: user.id,
        action: "STATUS_CHANGED",
        entityType: "ADMISSION_REQUEST",
        entityId: requestId,
        admissionRequestId: requestId,
        description: `تغيير الحالة من «${ADMISSION_STATUS_LABELS[request.status]}» إلى «${ADMISSION_STATUS_LABELS[newStatus]}»`,
        metadata: { oldStatus: request.status, newStatus, note },
      },
      tx
    );

    return updated;
  });
}

export async function assignRequest(
  user: AuthAdmin,
  requestId: string,
  assignedToId: string | null
) {
  if (!canAssignRequest(user)) throw new Error("FORBIDDEN");

  const request = await getRequestOrThrow(requestId);

  if (assignedToId) {
    const assignee = await prisma.adminUser.findUnique({
      where: { id: assignedToId },
    });
    if (
      !assignee ||
      assignee.status !== "ACTIVE" ||
      !["ADMIN", "ADMISSION_STAFF"].includes(assignee.role)
    ) {
      throw new Error("INVALID_ASSIGNEE");
    }
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.admissionRequest.update({
      where: { id: requestId },
      data: { assignedToId },
      include: {
        assignedTo: { select: { id: true, name: true } },
      },
    });

    await logActivity(
      {
        userId: user.id,
        action: "ASSIGNED",
        entityType: "ADMISSION_REQUEST",
        entityId: requestId,
        admissionRequestId: requestId,
        description: assignedToId
          ? `إسناد الطلب إلى ${updated.assignedTo?.name}`
          : "إلغاء إسناد الطلب",
        metadata: { assignedToId },
      },
      tx
    );

    return updated;
  });
}

export async function addInternalNote(
  user: AuthAdmin,
  requestId: string,
  content: string
) {
  const request = await getRequestOrThrow(requestId);
  if (!canModifyRequest(user, request.assignedToId)) throw new Error("FORBIDDEN");

  return prisma.$transaction(async (tx) => {
    const note = await tx.internalNote.create({
      data: {
        admissionRequestId: requestId,
        authorId: user.id,
        content,
        visibility: "INTERNAL",
      },
      include: { author: { select: { name: true } } },
    });

    await logActivity(
      {
        userId: user.id,
        action: "NOTE_ADDED",
        entityType: "INTERNAL_NOTE",
        entityId: note.id,
        admissionRequestId: requestId,
        description: "إضافة ملاحظة داخلية",
      },
      tx
    );

    return note;
  });
}

export async function createAppointment(
  user: AuthAdmin,
  requestId: string,
  data: {
    scheduledAt: Date;
    type: AppointmentType;
    note?: string;
    autoSetStatus?: boolean;
  }
) {
  const request = await getRequestOrThrow(requestId);
  if (!canManageAppointments(user, request.assignedToId)) throw new Error("FORBIDDEN");

  return prisma.$transaction(async (tx) => {
    const appointment = await tx.admissionAppointment.create({
      data: {
        admissionRequestId: requestId,
        scheduledAt: data.scheduledAt,
        type: data.type,
        note: data.note || null,
        createdById: user.id,
      },
    });

    let updatedRequest = request;
    const shouldAutoStatus =
      data.autoSetStatus !== false &&
      !TERMINAL_STATUSES.includes(request.status);

    if (shouldAutoStatus && request.status !== "APPOINTMENT_SCHEDULED") {
      await tx.requestStatusHistory.create({
        data: {
          admissionRequestId: requestId,
          oldStatus: request.status,
          newStatus: "APPOINTMENT_SCHEDULED",
          changedById: user.id,
          note: "تحديث تلقائي عند تحديد موعد",
        },
      });
      updatedRequest = await tx.admissionRequest.update({
        where: { id: requestId },
        data: { status: "APPOINTMENT_SCHEDULED" },
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      });
      await logActivity(
        {
          userId: user.id,
          action: "STATUS_CHANGED",
          entityType: "ADMISSION_REQUEST",
          entityId: requestId,
          admissionRequestId: requestId,
          description: "تحديث الحالة تلقائيًا إلى «موعد محدد»",
          metadata: { auto: true },
        },
        tx
      );
    }

    await logActivity(
      {
        userId: user.id,
        action: "APPOINTMENT_CREATED",
        entityType: "APPOINTMENT",
        entityId: appointment.id,
        admissionRequestId: requestId,
        description: `تحديد موعد: ${data.scheduledAt.toISOString()}`,
        metadata: { type: data.type },
      },
      tx
    );

    return { appointment, request: updatedRequest };
  });
}

export async function updateAppointment(
  user: AuthAdmin,
  appointmentId: string,
  data: {
    status?: AppointmentStatus;
    scheduledAt?: Date;
    note?: string;
  }
) {
  const appointment = await prisma.admissionAppointment.findUnique({
    where: { id: appointmentId },
    include: { admissionRequest: true },
  });
  if (!appointment) throw new Error("NOT_FOUND");

  assertCanModify(user, appointment.admissionRequest.assignedToId);

  return prisma.$transaction(async (tx) => {
    const updated = await tx.admissionAppointment.update({
      where: { id: appointmentId },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.scheduledAt ? { scheduledAt: data.scheduledAt } : {}),
        ...(data.note !== undefined ? { note: data.note } : {}),
      },
    });

    const action =
      data.status === "CANCELLED" ? "APPOINTMENT_CANCELLED" : "APPOINTMENT_UPDATED";

    await logActivity(
      {
        userId: user.id,
        action,
        entityType: "APPOINTMENT",
        entityId: appointmentId,
        admissionRequestId: appointment.admissionRequestId,
        description:
          data.status === "CANCELLED" ? "إلغاء موعد" : "تعديل موعد",
      },
      tx
    );

    return updated;
  });
}

export function buildAdmissionWhere(
  user: AuthAdmin,
  filters: AdmissionListFilters
): Prisma.AdmissionRequestWhereInput {
  const where: Prisma.AdmissionRequestWhereInput = {};

  if (user.role === "ADMISSION_STAFF" && !ADMISSION_STAFF_CAN_VIEW_ALL) {
    where.assignedToId = user.id;
  }

  if (filters.q) {
    where.OR = [
      { trackingNumber: { contains: filters.q, mode: "insensitive" } },
      { studentFirstName: { contains: filters.q, mode: "insensitive" } },
      { studentLastName: { contains: filters.q, mode: "insensitive" } },
      { parentFullName: { contains: filters.q, mode: "insensitive" } },
      { parentPhone: { contains: filters.q } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.schoolCycle) where.schoolCycle = filters.schoolCycle;
  if (filters.schoolLevel) where.schoolLevel = filters.schoolLevel;
  if (filters.commonCoreTrack) where.commonCoreTrack = filters.commonCoreTrack;
  if (filters.assignedToId === "unassigned") where.assignedToId = null;
  else if (filters.assignedToId) where.assignedToId = filters.assignedToId;
  if (filters.needsTransport === "true") where.needsTransport = true;
  if (filters.needsTransport === "false") where.needsTransport = false;
  if (filters.needsCanteen === "true") where.needsCanteen = true;
  if (filters.needsCanteen === "false") where.needsCanteen = false;

  if (filters.dateFrom || filters.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
    if (filters.dateTo) {
      const end = new Date(filters.dateTo);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  return where;
}

export type AdmissionListFilters = {
  q?: string;
  status?: AdmissionRequestStatus;
  schoolCycle?: Prisma.AdmissionRequestWhereInput["schoolCycle"];
  schoolLevel?: Prisma.AdmissionRequestWhereInput["schoolLevel"];
  commonCoreTrack?: Prisma.AdmissionRequestWhereInput["commonCoreTrack"];
  assignedToId?: string;
  needsTransport?: string;
  needsCanteen?: string;
  dateFrom?: string;
  dateTo?: string;
};

export function admissionOrderBy(
  sort: string
): Prisma.AdmissionRequestOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "updated":
      return { updatedAt: "desc" };
    case "status":
      return { status: "asc" };
    case "level":
      return { schoolLevel: "asc" };
    default:
      return { createdAt: "desc" };
  }
}
