"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CommonCoreTrack, SchoolCycle, SchoolLevel } from "@prisma/client";
import { Button } from "@/components/admission/ui/Button";
import { Input } from "@/components/admission/ui/Input";
import { Select } from "@/components/admission/ui/Select";
import { Textarea } from "@/components/admission/ui/Textarea";
import { Card } from "@/components/admission/ui/Card";
import { GENDER_LABELS } from "@/lib/admission/labels";
import {
  CYCLE_LABELS,
  isCommonCoreLevel,
  LEVEL_LABELS,
  LEVELS_BY_CYCLE,
  TRACK_LABELS,
} from "@/lib/admission/school-levels";

type FormErrors = Record<string, string>;

export type AdminAdmissionFormValues = {
  studentFirstName: string;
  studentLastName: string;
  studentDateOfBirth: string;
  studentGender: string;
  studentNationalId: string;
  currentSchool: string;
  parentFullName: string;
  parentPhone: string;
  parentEmail: string;
  parentAddress: string;
  schoolCycle: SchoolCycle | "";
  schoolLevel: SchoolLevel | "";
  commonCoreTrack: CommonCoreTrack | "";
  needsTransport: boolean;
  transportNotes: string;
  needsCanteen: boolean;
};

type Props = {
  mode: "create" | "edit";
  requestId?: string;
  initialValues?: Partial<AdminAdmissionFormValues>;
  cancelHref?: string;
};

const emptyValues: AdminAdmissionFormValues = {
  studentFirstName: "",
  studentLastName: "",
  studentDateOfBirth: "",
  studentGender: "",
  studentNationalId: "",
  currentSchool: "",
  parentFullName: "",
  parentPhone: "",
  parentEmail: "",
  parentAddress: "",
  schoolCycle: "",
  schoolLevel: "",
  commonCoreTrack: "",
  needsTransport: false,
  transportNotes: "",
  needsCanteen: false,
};

export function AdminAdmissionForm({
  mode,
  requestId,
  initialValues,
  cancelHref = "/admin/admissions",
}: Props) {
  const router = useRouter();
  const defaults = { ...emptyValues, ...initialValues };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [needsTransport, setNeedsTransport] = useState(defaults.needsTransport);
  const [needsCanteen, setNeedsCanteen] = useState(defaults.needsCanteen);
  const [schoolCycle, setSchoolCycle] = useState<SchoolCycle | "">(defaults.schoolCycle);
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel | "">(defaults.schoolLevel);
  const [commonCoreTrack, setCommonCoreTrack] = useState<CommonCoreTrack | "">(
    defaults.commonCoreTrack
  );

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

    const url =
      mode === "create"
        ? "/api/admin/admissions"
        : `/api/admin/admissions/${requestId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.message ?? "تعذر حفظ البيانات." });
        }
        return;
      }

      router.push(`/admin/admissions/${data.id}`);
      router.refresh();
    } catch {
      setErrors({ form: "تعذر الاتصال بالخادم." });
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

      <Card title="معلومات التلميذ">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="studentFirstName"
            label="الاسم الشخصي"
            required
            defaultValue={defaults.studentFirstName}
            error={errors.studentFirstName}
          />
          <Input
            name="studentLastName"
            label="الاسم العائلي"
            required
            defaultValue={defaults.studentLastName}
            error={errors.studentLastName}
          />
          <Input
            name="studentDateOfBirth"
            label="تاريخ الازدياد"
            type="date"
            required
            defaultValue={defaults.studentDateOfBirth}
            error={errors.studentDateOfBirth}
          />
          <Select
            name="studentGender"
            label="الجنس"
            required
            defaultValue={defaults.studentGender}
            error={errors.studentGender}
            placeholder="اختر..."
            options={Object.entries(GENDER_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Input
            name="studentNationalId"
            label="رقم التعريف الوطني"
            defaultValue={defaults.studentNationalId}
            error={errors.studentNationalId}
          />
          <Input
            name="currentSchool"
            label="المؤسسة الحالية"
            defaultValue={defaults.currentSchool}
            error={errors.currentSchool}
          />
        </div>
      </Card>

      <Card title="معلومات ولي الأمر">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="parentFullName"
            label="الاسم الكامل"
            required
            className="sm:col-span-2"
            defaultValue={defaults.parentFullName}
            error={errors.parentFullName}
          />
          <Input
            name="parentPhone"
            label="رقم الهاتف"
            type="tel"
            required
            hint="مثال: 06XXXXXXXX"
            defaultValue={defaults.parentPhone}
            error={errors.parentPhone}
          />
          <Input
            name="parentEmail"
            label="البريد الإلكتروني"
            type="email"
            defaultValue={defaults.parentEmail}
            error={errors.parentEmail}
          />
          <Input
            name="parentAddress"
            label="العنوان"
            className="sm:col-span-2"
            defaultValue={defaults.parentAddress}
            error={errors.parentAddress}
          />
        </div>
      </Card>

      <Card title="المستوى والخدمات">
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            name="schoolCycle"
            label="السلك الدراسي"
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
              label="المستوى"
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
            <Select
              name="commonCoreTrack"
              label="نوع الشعبة"
              required
              className="sm:col-span-2"
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
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 sm:col-span-2">
            <input
              type="checkbox"
              checked={needsTransport}
              onChange={(e) => setNeedsTransport(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1D4395]"
            />
            <span className="block font-medium text-[#0E2250]">النقل المدرسي</span>
          </label>

          {needsTransport && (
            <Textarea
              name="transportNotes"
              label="عنوان النقل"
              className="sm:col-span-2"
              defaultValue={defaults.transportNotes}
              error={errors.transportNotes}
            />
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 sm:col-span-2">
            <input
              type="checkbox"
              checked={needsCanteen}
              onChange={(e) => setNeedsCanteen(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1D4395]"
            />
            <span className="block font-medium text-[#0E2250]">المطعم المدرسي</span>
          </label>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={loading} variant="primary">
          {mode === "create" ? "تسجيل التلميذ" : "حفظ التعديلات"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(cancelHref)}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}

export function toFormDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
