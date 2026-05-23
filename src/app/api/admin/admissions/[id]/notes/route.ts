import { NextResponse } from "next/server";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import { addInternalNote } from "@/lib/admission/admissions/service";
import { getAdmissionDetail } from "@/lib/admission/admissions/queries";
import { canStaffViewRequest } from "@/lib/admission/admission-permissions";
import { admissionNoteSchema } from "@/lib/admission/validations-admissions";
import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized,
} from "@/lib/admission/api-response";

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
  const item = await getAdmissionDetail(id);
  if (!item) return notFound();
  if (!canStaffViewRequest(auth.user, item.assignedToId)) return forbidden();

  return NextResponse.json({
    notes: item.notes.filter((n) => n.visibility === "INTERNAL"),
  });
}

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
    const parsed = admissionNoteSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("ملاحظة غير صالحة");
    }

    const note = await addInternalNote(auth.user, id, parsed.data.content);
    return NextResponse.json({ note }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "FORBIDDEN") return forbidden();
    if (msg === "NOT_FOUND") return notFound();
    console.error("Note error:", e);
    return serverError();
  }
}
