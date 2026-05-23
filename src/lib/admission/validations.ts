import { z } from "zod";
import {
  ALL_CYCLES,
  ALL_LEVELS,
  ALL_TRACKS,
  isCommonCoreLevel,
  levelBelongsToCycle,
} from "@/lib/admission/school-levels";

const schoolCycleSchema = z.enum(ALL_CYCLES);
const schoolLevelSchema = z.enum(ALL_LEVELS);
const commonCoreTrackSchema = z.enum(ALL_TRACKS);

export const applicationSchema = z
  .object({
    studentFirstName: z.string().min(2, "الاسم الشخصي مطلوب"),
    studentLastName: z.string().min(2, "الاسم العائلي مطلوب"),
    studentDateOfBirth: z.string().min(1, "تاريخ الازدياد مطلوب"),
    studentGender: z.enum(["MALE", "FEMALE"]),
    studentNationalId: z.string().optional(),
    currentSchool: z.string().optional(),

    parentFullName: z.string().min(3, "اسم ولي الأمر مطلوب"),
    parentPhone: z
      .string()
      .min(10, "رقم الهاتف غير صالح")
      .regex(/^[\d\s+()-]+$/, "رقم الهاتف غير صالح"),
    parentEmail: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
    parentAddress: z.string().optional(),

    schoolCycle: schoolCycleSchema,
    schoolLevel: schoolLevelSchema,
    commonCoreTrack: z
      .union([commonCoreTrackSchema, z.literal(""), z.undefined()])
      .optional(),

    needsTransport: z.coerce.boolean(),
    transportNotes: z.string().optional(),
    needsCanteen: z.coerce.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!levelBelongsToCycle(data.schoolCycle, data.schoolLevel)) {
      ctx.addIssue({
        code: "custom",
        message: "المستوى المختار لا يتوافق مع السلك الدراسي",
        path: ["schoolLevel"],
      });
    }

    const track = data.commonCoreTrack ?? null;

    if (isCommonCoreLevel(data.schoolLevel)) {
      if (!track) {
        ctx.addIssue({
          code: "custom",
          message: "نوع الشعبة مطلوب للجذع المشترك",
          path: ["commonCoreTrack"],
        });
      }
    } else if (track) {
      ctx.addIssue({
        code: "custom",
        message: "الشعبة غير مطلوبة لهذا المستوى",
        path: ["commonCoreTrack"],
      });
    }
  });
