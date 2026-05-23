import type {
  ActivityAction,
  ActivityEntityType,
  Prisma,
} from "@prisma/client";
import { prisma } from "@/lib/admission/prisma";

type LogParams = {
  userId: string;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: string;
  description: string;
  admissionRequestId?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function logActivity(params: LogParams, tx?: Prisma.TransactionClient) {
  const client = tx ?? prisma;
  return client.activityLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      description: params.description,
      admissionRequestId: params.admissionRequestId,
      metadata: params.metadata,
    },
  });
}

export const ACTIVITY_LABELS: Record<ActivityAction, string> = {
  STATUS_CHANGED: "تغيير حالة الطلب",
  ASSIGNED: "إسناد الطلب",
  NOTE_ADDED: "إضافة ملاحظة",
  APPOINTMENT_CREATED: "تحديد موعد",
  APPOINTMENT_UPDATED: "تعديل موعد",
  APPOINTMENT_CANCELLED: "إلغاء موعد",
  REQUEST_UPDATED: "تعديل معلومات الطلب",
  REQUEST_VIEWED: "فتح الملف",
  EXPORT_REQUESTS: "تصدير الطلبات",
};
