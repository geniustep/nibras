import { NextResponse } from "next/server";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import { changeRequestStatus } from "@/lib/admission/admissions/service";
import { admissionStatusChangeSchema } from "@/lib/admission/validations-admissions";
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
    const parsed = admissionStatusChangeSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("بيانات غير صالحة");
    }

    const updated = await changeRequestStatus(
      auth.user,
      id,
      parsed.data.status,
      parsed.data.note
    );
    return NextResponse.json({ item: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "FORBIDDEN") return forbidden();
    if (msg === "NOT_FOUND") return notFound();
    console.error("Status change error:", e);
    return serverError();
  }
}
