import { NextResponse } from "next/server";
import { prisma } from "@/lib/admission/prisma";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import { canModifyRequest } from "@/lib/admission/admission-permissions";
import { logActivity } from "@/lib/admission/activity-log";
import { admissionParentMessageSchema } from "@/lib/admission/validations-admissions";
import { badRequest, forbidden, notFound, serverError, unauthorized } from "@/lib/admission/api-response";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthAdmin();
  if (isAuthError(auth)) {
    if (auth.error === "UNAUTHORIZED") return unauthorized();
    return forbidden();
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = admissionParentMessageSchema.safeParse(body);
    if (!parsed.success) return badRequest("نص غير صالح");

    const existing = await prisma.admissionRequest.findUnique({ where: { id } });
    if (!existing) return notFound();
    if (!canModifyRequest(auth.user, existing.assignedToId)) return forbidden();

    const updated = await prisma.admissionRequest.update({
      where: { id },
      data: { parentMessage: parsed.data.parentMessage || null },
    });

    await logActivity({
      userId: auth.user.id,
      action: "REQUEST_UPDATED",
      entityType: "ADMISSION_REQUEST",
      entityId: id,
      admissionRequestId: id,
      description: "تحديث رسالة موجهة لولي الأمر",
    });

    return NextResponse.json({ item: updated });
  } catch (e) {
    console.error("Parent message error:", e);
    return serverError();
  }
}
