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
