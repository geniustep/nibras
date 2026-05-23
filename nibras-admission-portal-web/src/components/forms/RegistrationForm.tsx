"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CommonCoreTrack, SchoolCycle, SchoolLevel } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { GENDER_LABELS, REFERRAL_LABELS } from "@/lib/labels";
import {
  CYCLE_LABELS,
  isCommonCoreLevel,
  LEVEL_LABELS,
  LEVELS_BY_CYCLE,
  TRACK_LABELS,
} from "@/lib/school-levels";

type FormErrors = Record<string, string>;

export function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [needsTransport, setNeedsTransport] = useState(false);
  const [needsCanteen, setNeedsCanteen] = useState(false);

  const [schoolCycle, setSchoolCycle] = useState<SchoolCycle | "">("");
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel | "">("");
  const [commonCoreTrack, setCommonCoreTrack] = useState<CommonCoreTrack | "">("");

  const levelOptions = useMemo(() => {
    if (!schoolCycle) return [];
    return LEVELS_BY_CYCLE[schoolCycle].map((level) => ({
      value: level,
      label: LEVEL_LABELS[level],
    }));
  }, [schoolCycle]);

  const showLevelField = Boolean(schoolCycle);
  const showTrackField =
    schoolLevel !== "" && isCommonCoreLevel(schoolLevel as SchoolLevel);

  function handleCycleChange(value: string) {
    setSchoolCycle(value as SchoolCycle);
    setSchoolLevel("");
    setCommonCoreTrack("");
  }

  function handleLevelChange(value: string) {
    const level = value as SchoolLevel;
    setSchoolLevel(level);
    if (!isCommonCoreLevel(level)) {
      setCommonCoreTrack("");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set("needsTransport", needsTransport ? "true" : "false");
    formData.set("needsCanteen", needsCanteen ? "true" : "false");
    formData.set("schoolCycle", schoolCycle);
    formData.set("schoolLevel", schoolLevel);
    if (showTrackField && commonCoreTrack) {
      formData.set("commonCoreTrack", commonCoreTrack);
    } else {
      formData.delete("commonCoreTrack");
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.message ?? "تعذر إرسال الطلب. يرجى المحاولة لاحقًا." });
        }
        return;
      }

      router.push(`/tassjil/najah?ref=${encodeURIComponent(data.trackingNumber)}`);
    } catch {
      setErrors({ form: "تعذر الاتصال بالخادم. يرجى التحقق من الاتصال والمحاولة مجددًا." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.form && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <Card
        title="معلومات التلميذ"
        subtitle="البيانات الأساسية للتلميذ المراد تسجيله."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="studentFirstName"
            label="الاسم الأول"
            required
            error={errors.studentFirstName}
          />
          <Input
            name="studentLastName"
            label="اسم العائلة"
            required
            error={errors.studentLastName}
          />
          <Input
            name="studentDateOfBirth"
            label="تاريخ الازدياد"
            type="date"
            required
            error={errors.studentDateOfBirth}
          />
          <Select
            name="studentGender"
            label="الجنس"
            required
            error={errors.studentGender}
            placeholder="اختر..."
            options={Object.entries(GENDER_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Input
            name="studentNationalId"
            label="رقم التعريف الوطني (اختياري)"
            error={errors.studentNationalId}
          />
          <Input
            name="currentSchool"
            label="المؤسسة الحالية (اختياري)"
            error={errors.currentSchool}
          />
        </div>
      </Card>

      <Card
        title="معلومات ولي الأمر"
        subtitle="للتواصل معكم بخصوص طلب التسجيل."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="parentFullName"
            label="الاسم الكامل"
            required
            className="sm:col-span-2"
            error={errors.parentFullName}
          />
          <Input
            name="parentPhone"
            label="رقم الهاتف"
            type="tel"
            required
            hint="مثال: 06XXXXXXXX"
            error={errors.parentPhone}
          />
          <Input
            name="parentEmail"
            label="البريد الإلكتروني (اختياري)"
            type="email"
            error={errors.parentEmail}
          />
          <Input
            name="parentRelationship"
            label="صلة القرابة"
            defaultValue="ولي الأمر"
            error={errors.parentRelationship}
          />
          <Input
            name="parentAddress"
            label="العنوان (اختياري)"
            className="sm:col-span-2"
            error={errors.parentAddress}
          />
        </div>
      </Card>

      <Card title="المستوى والخدمات" subtitle="حددوا السلك الدراسي ثم المستوى المناسب.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            name="schoolCycle"
            label="السلك الدراسي المطلوب"
            required
            className="sm:col-span-2"
            value={schoolCycle}
            onChange={(e) => handleCycleChange(e.target.value)}
            error={errors.schoolCycle}
            placeholder="اختر السلك الدراسي..."
            options={Object.entries(CYCLE_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />

          {showLevelField && (
            <Select
              name="schoolLevel"
              label="المستوى المطلوب"
              required
              className="sm:col-span-2"
              value={schoolLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              error={errors.schoolLevel}
              placeholder="اختر المستوى..."
              options={levelOptions}
            />
          )}

          {showTrackField && (
            <div className="sm:col-span-2">
              <Select
                name="commonCoreTrack"
                label="نوع الشعبة المطلوبة"
                required
                value={commonCoreTrack}
                onChange={(e) =>
                  setCommonCoreTrack(e.target.value as CommonCoreTrack)
                }
                error={errors.commonCoreTrack}
                placeholder="اختر نوع الشعبة..."
                options={Object.entries(TRACK_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                اختيار الشعبة في هذه المرحلة أولي، وسيتم تأكيده بعد مراجعة الملف
                والتواصل مع ولي الأمر.
              </p>
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#1D4395]/40 sm:col-span-2">
            <input
              type="checkbox"
              checked={needsTransport}
              onChange={(e) => setNeedsTransport(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1D4395]"
            />
            <span>
              <span className="block font-medium text-[#0E2250]">النقل المدرسي</span>
              <span className="mt-1 block text-sm text-slate-600">
                نرغب في معلومات حول خدمة النقل المدرسي.
              </span>
            </span>
          </label>

          {needsTransport && (
            <Textarea
              name="transportNotes"
              label="ملاحظات حول النقل (اختياري)"
              className="sm:col-span-2"
              error={errors.transportNotes}
            />
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-[#1D4395]/40 sm:col-span-2">
            <input
              type="checkbox"
              checked={needsCanteen}
              onChange={(e) => setNeedsCanteen(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1D4395]"
            />
            <span>
              <span className="block font-medium text-[#0E2250]">المطعم المدرسي</span>
              <span className="mt-1 block text-sm text-slate-600">
                نرغب في الاستفادة من خدمة المطعم المدرسي.
              </span>
            </span>
          </label>
        </div>
      </Card>

      <Card
        title="كيف تعرفتم على المؤسسة؟"
        subtitle="يساعدنا هذا الحقل على تحسين تواصلنا مع الأسر."
      >
        <div className="grid gap-5">
          <Select
            name="referralSource"
            label="مصدر المعرفة"
            required
            error={errors.referralSource}
            placeholder="اختر..."
            options={Object.entries(REFERRAL_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Input
            name="referralDetails"
            label="تفاصيل إضافية (اختياري)"
            error={errors.referralDetails}
          />
        </div>
      </Card>

      <div className="rounded-2xl border border-[#EEA748]/30 bg-[#FAFBFF] p-5 text-sm text-slate-600">
        <p>
          بإرسال هذا الطلب، تؤكدون صحة المعلومات المقدّمة. سيتواصل معكم فريق
          القبول والتسجيل لاستكمال الإجراءات. هذا الطلب لا يعني قبولًا نهائيًا.
        </p>
      </div>

      <Button type="submit" loading={loading} fullWidth variant="primary">
        إرسال طلب التسجيل الأولي
      </Button>
    </form>
  );
}
