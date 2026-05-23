import { z } from "zod";
import { adminApplicationSchema } from "@/lib/admission/validations";

export type ApplicationInput = z.infer<typeof adminApplicationSchema>;

export function formDataToObject(formData: FormData) {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      obj[key] = value;
    }
  });
  return obj;
}

export function parseApplicationFormData(formData: FormData) {
  const raw = formDataToObject(formData);
  return adminApplicationSchema.safeParse({
    ...raw,
    needsTransport: raw.needsTransport === "true",
    needsCanteen: raw.needsCanteen === "true",
    parentEmail: raw.parentEmail || undefined,
    commonCoreTrack: raw.commonCoreTrack || undefined,
  });
}

export function toAdmissionRequestFields(data: ApplicationInput) {
  return {
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
  };
}
