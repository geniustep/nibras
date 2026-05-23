import { NextResponse } from "next/server";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import { assignRequest } from "@/lib/admission/admissions/service";
import { admissionAssignSchema } from "@/lib/admission/validations-admissions";
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
    const parsed = admissionAssignSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("بيانات الإسناد غير صالحة");
    }

    const updated = await assignRequest(
      auth.user,
      id,
      parsed.data.assignedToId
    );
    return NextResponse.json({ item: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "FORBIDDEN") return forbidden();
    if (msg === "NOT_FOUND") return notFound();
    if (msg === "INVALID_ASSIGNEE") {
      return badRequest("لا يمكن إسناد الطلب لهذا المستخدم");
    }
    console.error("Assign error:", e);
    return serverError();
  }
}
