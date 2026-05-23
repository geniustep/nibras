import { NextResponse } from "next/server";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import { createAppointment } from "@/lib/admission/admissions/service";
import { admissionAppointmentSchema } from "@/lib/admission/validations-admissions";
import { badRequest, forbidden, notFound, serverError, unauthorized } from "@/lib/admission/api-response";

export async function POST(
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
    const parsed = admissionAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("بيانات الموعد غير صالحة");
    }

    const result = await createAppointment(auth.user, id, {
      scheduledAt: new Date(parsed.data.scheduledAt),
      type: parsed.data.type,
      note: parsed.data.note,
      autoSetStatus: parsed.data.autoSetStatus,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "FORBIDDEN") return forbidden();
    if (msg === "NOT_FOUND") return notFound();
    console.error("Appointment create error:", e);
    return serverError();
  }
}
