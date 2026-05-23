import { NextResponse } from "next/server";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import { getAdmissionDetail } from "@/lib/admission/admissions/queries";
import {
  canDeleteAdmission,
  canEditAdmissionRecord,
  canStaffViewRequest,
} from "@/lib/admission/admission-permissions";
import {
  parseApplicationFormData,
  toAdmissionRequestFields,
} from "@/lib/admission/admissions/application-payload";
import { logActivity } from "@/lib/admission/activity-log";
import { prisma } from "@/lib/admission/prisma";
import { forbidden, notFound, serverError, unauthorized } from "@/lib/admission/api-response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthAdmin();
  if (isAuthError(auth)) {
    if (auth.error === "UNAUTHORIZED") return unauthorized();
    return forbidden();
  }

  const { id } = await params;

  try {
    const item = await getAdmissionDetail(id);
    if (!item) return notFound();

    if (!canStaffViewRequest(auth.user, item.assignedToId)) {
      return forbidden();
    }

    await logActivity({
      userId: auth.user.id,
      action: "REQUEST_VIEWED",
      entityType: "ADMISSION_REQUEST",
      entityId: id,
      admissionRequestId: id,
      description: `فتح ملف الطلب ${item.trackingNumber}`,
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("Get admission error:", e);
    return serverError();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthAdmin();
  if (isAuthError(auth)) {
    if (auth.error === "UNAUTHORIZED") return unauthorized();
    return forbidden();
  }
  if (!canEditAdmissionRecord(auth.user)) return forbidden();

  const { id } = await params;

  try {
    const existing = await prisma.admissionRequest.findUnique({
      where: { id },
      select: { id: true, trackingNumber: true, assignedToId: true },
    });
    if (!existing) return notFound();
    if (!canStaffViewRequest(auth.user, existing.assignedToId)) return forbidden();

    const formData = await request.formData();
    const parsed = parseApplicationFormData(formData);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        errors[key] = issue.message;
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updated = await prisma.admissionRequest.update({
      where: { id },
      data: toAdmissionRequestFields(parsed.data),
    });

    await logActivity({
      userId: auth.user.id,
      action: "REQUEST_UPDATED",
      entityType: "ADMISSION_REQUEST",
      entityId: id,
      admissionRequestId: id,
      description: `تعديل بيانات الطلب ${existing.trackingNumber}`,
    });

    return NextResponse.json({
      success: true,
      id: updated.id,
      trackingNumber: updated.trackingNumber,
    });
  } catch (e) {
    console.error("Update admission error:", e);
    return serverError();
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthAdmin();
  if (isAuthError(auth)) {
    if (auth.error === "UNAUTHORIZED") return unauthorized();
    return forbidden();
  }
  if (!canDeleteAdmission(auth.user)) return forbidden();

  const { id } = await params;

  try {
    const existing = await prisma.admissionRequest.findUnique({
      where: { id },
      select: { id: true, trackingNumber: true },
    });
    if (!existing) return notFound();

    await prisma.admissionRequest.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete admission error:", e);
    return serverError();
  }
}
