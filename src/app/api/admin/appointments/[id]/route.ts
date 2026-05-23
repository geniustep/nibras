import { NextResponse } from "next/server";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import { updateAppointment } from "@/lib/admission/admissions/service";
import { appointmentUpdateSchema } from "@/lib/admission/validations-admissions";
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
    const parsed = appointmentUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("بيانات غير صالحة");
    }

    const updated = await updateAppointment(auth.user, id, {
      status: parsed.data.status,
      scheduledAt: parsed.data.scheduledAt
        ? new Date(parsed.data.scheduledAt)
        : undefined,
      note: parsed.data.note,
    });

    return NextResponse.json({ appointment: updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "FORBIDDEN") return forbidden();
    if (msg === "NOT_FOUND") return notFound();
    console.error("Appointment update error:", e);
    return serverError();
  }
}
