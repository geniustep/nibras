import { applicationSchema } from "../src/lib/admission/validations";
import {
  isCommonCoreLevel,
  levelBelongsToCycle,
} from "../src/lib/admission/school-levels";

let failed = 0;

function assert(name: string, condition: boolean) {
  if (!condition) {
    console.error(`[FAIL] ${name}`);
    failed++;
  } else {
    console.log(`[PASS] ${name}`);
  }
}

const valid = applicationSchema.safeParse({
  studentFirstName: "يوسف",
  studentLastName: "العلوي",
  studentDateOfBirth: "2015-06-15",
  studentGender: "MALE",
  parentFullName: "أحمد العلوي",
  parentPhone: "0612345678",
  schoolCycle: "PRIMARY",
  schoolLevel: "PRIMARY_1",
  needsTransport: false,
  needsCanteen: false,
  referralSource: "WEBSITE",
});

assert("بيانات صالحة كاملة", valid.success);

const empty = applicationSchema.safeParse({});
assert("طلب فارغ يفشل", !empty.success);

const mismatch = applicationSchema.safeParse({
  studentFirstName: "يوسف",
  studentLastName: "العلوي",
  studentDateOfBirth: "2015-06-15",
  studentGender: "MALE",
  parentFullName: "أحمد العلوي",
  parentPhone: "0612345678",
  schoolCycle: "PRIMARY",
  schoolLevel: "MIDDLE_1",
  needsTransport: false,
  needsCanteen: false,
  referralSource: "WEBSITE",
});
assert("عدم توافق السلك والمستوى", !mismatch.success);

const commonCore = applicationSchema.safeParse({
  studentFirstName: "يوسف",
  studentLastName: "العلوي",
  studentDateOfBirth: "2010-01-01",
  studentGender: "MALE",
  parentFullName: "أحمد العلوي",
  parentPhone: "0612345678",
  schoolCycle: "HIGH_SCHOOL",
  schoolLevel: "COMMON_CORE",
  commonCoreTrack: "SCIENTIFIC",
  needsTransport: false,
  needsCanteen: false,
  referralSource: "WEBSITE",
});
assert("الجذع المشترك مع شعبة", commonCore.success);

assert(
  "isCommonCoreLevel",
  isCommonCoreLevel("COMMON_CORE") && !isCommonCoreLevel("PRIMARY_1")
);
assert(
  "levelBelongsToCycle",
  levelBelongsToCycle("PRIMARY", "PRIMARY_1") &&
    !levelBelongsToCycle("PRIMARY", "MIDDLE_1")
);

console.log(failed === 0 ? "\nكل اختبارات الوحدة نجحت." : `\nفشل ${failed} اختبار.`);
process.exit(failed > 0 ? 1 : 0);
