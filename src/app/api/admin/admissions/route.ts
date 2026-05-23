import { NextResponse } from "next/server";
import { isAuthError, requireAuthAdmin } from "@/lib/admission/admin-session";
import {
  canEditAdmissionRecord,
} from "@/lib/admission/admission-permissions";
import { listAdmissionRequests } from "@/lib/admission/admissions/queries";
import {
  parseApplicationFormData,
  toAdmissionRequestFields,
} from "@/lib/admission/admissions/application-payload";
import type { AdmissionListFilters } from "@/lib/admission/admissions/service";
import { logActivity } from "@/lib/admission/activity-log";
import { prisma } from "@/lib/admission/prisma";
import { generateTrackingNumber } from "@/lib/admission/tracking";
import type { AdmissionRequestStatus, SchoolCycle, SchoolLevel, CommonCoreTrack } from "@prisma/client";
import { forbidden, serverError, unauthorized } from "@/lib/admission/api-response";

export async function GET(request: Request) {
  const auth = await requireAuthAdmin();
  if (isAuthError(auth)) {
    if (auth.error === "UNAUTHORIZED") return unauthorized();
    return forbidden();
  }

  try {
    const { searchParams } = new URL(request.url);
    const filters: AdmissionListFilters = {
      q: searchParams.get("q") ?? undefined,
      status: (searchParams.get("status") as AdmissionRequestStatus) || undefined,
      schoolCycle: (searchParams.get("schoolCycle") as SchoolCycle) || undefined,
      schoolLevel: (searchParams.get("schoolLevel") as SchoolLevel) || undefined,
      commonCoreTrack:
        (searchParams.get("commonCoreTrack") as CommonCoreTrack) || undefined,
      assignedToId: searchParams.get("assignedToId") ?? undefined,
      needsTransport: searchParams.get("needsTransport") ?? undefined,
      needsCanteen: searchParams.get("needsCanteen") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
    };
    const sort = searchParams.get("sort") ?? "newest";

    const items = await listAdmissionRequests(auth.user, filters, sort);
    return NextResponse.json({ items });
  } catch (e) {
    console.error("List admissions error:", e);
    return serverError();
  }
}

export async function POST(request: Request) {
  const auth = await requireAuthAdmin();
  if (isAuthError(auth)) {
    if (auth.error === "UNAUTHORIZED") return unauthorized();
    return forbidden();
  }
  if (!canEditAdmissionRecord(auth.user)) return forbidden();

  try {
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

    const data = parsed.data;
    const trackingNumber = await generateTrackingNumber();
    const fields = toAdmissionRequestFields(data);

    const application = await prisma.admissionRequest.create({
      data: {
        ...fields,
        trackingNumber,
        status: "NEW",
        statusHistory: {
          create: {
            oldStatus: null,
            newStatus: "NEW",
          },
        },
      },
    });

    await logActivity({
      userId: auth.user.id,
      action: "REQUEST_UPDATED",
      entityType: "ADMISSION_REQUEST",
      entityId: application.id,
      admissionRequestId: application.id,
      description: `إنشاء طلب جديد ${trackingNumber} من لوحة الإدارة`,
      metadata: { source: "admin_create" },
    });

    return NextResponse.json({
      success: true,
      id: application.id,
      trackingNumber: application.trackingNumber,
    });
  } catch (e) {
    console.error("Admin create admission error:", e);
    return serverError();
  }
}
