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

export function createApplicationSchema() {
  return z
    .object({
      studentFirstName: z.string().min(2, "studentFirstName"),
      studentLastName: z.string().min(2, "studentLastName"),
      studentDateOfBirth: z.string().min(1, "studentDateOfBirth"),
      studentGender: z.enum(["MALE", "FEMALE"]),
      studentNationalId: z.string().optional(),
      currentSchool: z.string().optional(),

      parentFullName: z.string().min(3, "parentFullName"),
      parentPhone: z
        .string()
        .min(10, "parentPhone")
        .regex(/^[\d\s+()-]+$/, "parentPhone"),
      parentEmail: z.string().email("parentEmail").optional().or(z.literal("")),
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
          message: "levelCycleMismatch",
          path: ["schoolLevel"],
        });
      }

      const track = data.commonCoreTrack ?? null;

      if (isCommonCoreLevel(data.schoolLevel)) {
        if (!track) {
          ctx.addIssue({
            code: "custom",
            message: "trackRequired",
            path: ["commonCoreTrack"],
          });
        }
      } else if (track) {
        ctx.addIssue({
          code: "custom",
          message: "trackNotRequired",
          path: ["commonCoreTrack"],
        });
      }
    });
}

export const applicationSchema = createApplicationSchema();


/** تحقق لوحة الإدارة (رسائل عربية مباشرة) */
export const adminApplicationSchema = z
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

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور مطلوبة"),
});

export const noteSchema = z.object({
  content: z.string().min(2, "الملاحظة قصيرة جدًا").max(2000),
});

export const userRoleSchema = z.enum([
  "SUPER_ADMIN",
  "ADMIN",
  "ADMISSION_STAFF",
  "VIEWER",
]);

export const userAccountStatusSchema = z.enum([
  "ACTIVE",
  "PENDING",
  "SUSPENDED",
  "REJECTED",
]);

export const userCreateSchema = z.object({
  name: z.string().min(2, "الاسم الكامل مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[\d\s+()-]+$/.test(v), "رقم الهاتف غير صالح"),
  role: userRoleSchema,
  status: userAccountStatusSchema,
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, "الاسم الكامل مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[\d\s+()-]+$/.test(v), "رقم الهاتف غير صالح"),
  role: userRoleSchema,
  status: userAccountStatusSchema,
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .optional()
    .or(z.literal("")),
});
