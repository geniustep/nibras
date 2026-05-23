import { NextResponse } from "next/server";
import { prisma } from "@/lib/admission/prisma";
import { applicationSchema } from "@/lib/admission/validations";
import { generateTrackingNumber } from "@/lib/admission/tracking";
import {
  getApplicationDbDebugHint,
  logApplicationDbError,
} from "@/lib/admission/db-error";

function formDataToObject(formData: FormData) {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      obj[key] = value;
    }
  });
  return obj;
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[applications] DATABASE_URL is missing on this deployment");
    return NextResponse.json(
      { message: "تعذر حفظ الطلب. يرجى المحاولة لاحقًا." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const raw = formDataToObject(formData);

    const parsed = applicationSchema.safeParse({
      ...raw,
      needsTransport: raw.needsTransport === "true",
      needsCanteen: raw.needsCanteen === "true",
      parentEmail: raw.parentEmail || undefined,
      commonCoreTrack: raw.commonCoreTrack || undefined,
    });

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

    const application = await prisma.admissionRequest.create({
      data: {
        trackingNumber,
        status: "NEW",
        studentFirstName: data.studentFirstName,
        studentLastName: data.studentLastName,
        studentDateOfBirth: new Date(data.studentDateOfBirth),
        studentGender: data.studentGender,
        studentNationalId: data.studentNationalId || null,
        currentSchool: data.currentSchool || null,
        parentFullName: data.parentFullName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail || null,
        parentRelationship: data.parentRelationship || "ولي الأمر",
        parentAddress: data.parentAddress || null,
        schoolCycle: data.schoolCycle,
        schoolLevel: data.schoolLevel,
        commonCoreTrack:
          data.schoolLevel === "COMMON_CORE" && data.commonCoreTrack
            ? data.commonCoreTrack
            : null,
        needsTransport: data.needsTransport,
        transportNotes: data.transportNotes || null,
        needsCanteen: data.needsCanteen,
        referralSource: data.referralSource,
        referralDetails: data.referralDetails || null,
        statusHistory: {
          create: {
            oldStatus: null,
            newStatus: "NEW",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      trackingNumber: application.trackingNumber,
      id: application.id,
    });
  } catch (error) {
    logApplicationDbError(error);
    const debug =
      process.env.ADMISSION_API_DEBUG === "true"
        ? getApplicationDbDebugHint(error)
        : undefined;
    return NextResponse.json(
      {
        message: "تعذر حفظ الطلب. يرجى المحاولة لاحقًا.",
        ...(debug ? { debug } : {}),
      },
      { status: 500 }
    );
  }
}
