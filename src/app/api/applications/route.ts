import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/admission/prisma";
import { createApplicationSchema } from "@/lib/admission/validations";
import { generateTrackingNumber } from "@/lib/admission/tracking";
import {
  getApplicationDbDebugHint,
  logApplicationDbError,
} from "@/lib/admission/db-error";
import { routing } from "@/i18n/routing";

type AppLocale = (typeof routing.locales)[number];

function resolveLocale(raw?: string): AppLocale {
  if (raw && routing.locales.includes(raw as AppLocale)) {
    return raw as AppLocale;
  }
  return routing.defaultLocale;
}

function formDataToObject(formData: FormData) {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && key !== "locale") {
      obj[key] = value;
    }
  });
  return obj;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = resolveLocale(formData.get("locale")?.toString());
  const t = await getTranslations({ locale, namespace: "admissionPortal.validation" });

  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[applications] DATABASE_URL is missing on this deployment");
    return NextResponse.json({ message: t("saveFailed") }, { status: 503 });
  }

  try {
    const raw = formDataToObject(formData);
    const schema = createApplicationSchema();

    const parsed = schema.safeParse({
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
        const messageKey = issue.message;
        errors[key] = t(messageKey as Parameters<typeof t>[0]);
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
        message: t("saveFailed"),
        ...(debug ? { debug } : {}),
      },
      { status: 500 }
    );
  }
}
