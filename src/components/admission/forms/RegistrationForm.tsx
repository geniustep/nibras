"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { CommonCoreTrack, SchoolCycle, SchoolLevel } from "@prisma/client";
import { Button } from "@/components/admission/ui/Button";
import { Input } from "@/components/admission/ui/Input";
import { Select } from "@/components/admission/ui/Select";
import { Textarea } from "@/components/admission/ui/Textarea";
import { Card } from "@/components/admission/ui/Card";
import { getAdmissionPaths, type AppLocale } from "@/lib/admission/paths";
import {
  ALL_CYCLES,
  ALL_TRACKS,
  isCommonCoreLevel,
  LEVELS_BY_CYCLE,
} from "@/lib/admission/school-levels";

type FormErrors = Record<string, string>;

export function RegistrationForm() {
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("admissionPortal.form");
  const tSchool = useTranslations("admissionPortal.school");
  const paths = getAdmissionPaths(locale);

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
      label: tSchool(`levels.${level}`),
    }));
  }, [schoolCycle, tSchool]);

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
    formData.set("locale", locale);
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
          setErrors({ form: data.message ?? t("errors.submitFailed") });
        }
        return;
      }

      router.push(
        `${paths.success}?ref=${encodeURIComponent(data.trackingNumber)}`
      );
    } catch {
      setErrors({ form: t("errors.networkError") });
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

      <Card title={t("sections.student.title")} subtitle={t("sections.student.subtitle")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="studentFirstName"
            label={t("fields.studentFirstName")}
            required
            error={errors.studentFirstName}
          />
          <Input
            name="studentLastName"
            label={t("fields.studentLastName")}
            required
            error={errors.studentLastName}
          />
          <Input
            name="studentDateOfBirth"
            label={t("fields.studentDateOfBirth")}
            type="date"
            required
            error={errors.studentDateOfBirth}
          />
          <Select
            name="studentGender"
            label={t("fields.studentGender")}
            required
            error={errors.studentGender}
            placeholder={t("placeholders.select")}
            options={(["MALE", "FEMALE"] as const).map((value) => ({
              value,
              label: tSchool(`genders.${value}`),
            }))}
          />
          <Input
            name="studentNationalId"
            label={t("fields.studentNationalId")}
            error={errors.studentNationalId}
          />
          <Input
            name="currentSchool"
            label={t("fields.currentSchool")}
            error={errors.currentSchool}
          />
        </div>
      </Card>

      <Card title={t("sections.parent.title")} subtitle={t("sections.parent.subtitle")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            name="parentFullName"
            label={t("fields.parentFullName")}
            required
            className="sm:col-span-2"
            error={errors.parentFullName}
          />
          <Input
            name="parentPhone"
            label={t("fields.parentPhone")}
            type="tel"
            required
            hint={t("fields.parentPhoneHint")}
            error={errors.parentPhone}
          />
          <Input
            name="parentEmail"
            label={t("fields.parentEmail")}
            type="email"
            error={errors.parentEmail}
          />
          <Input
            name="parentAddress"
            label={t("fields.parentAddress")}
            className="sm:col-span-2"
            error={errors.parentAddress}
          />
        </div>
      </Card>

      <Card title={t("sections.level.title")} subtitle={t("sections.level.subtitle")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            name="schoolCycle"
            label={t("fields.schoolCycle")}
            required
            className="sm:col-span-2"
            value={schoolCycle}
            onChange={(e) => handleCycleChange(e.target.value)}
            error={errors.schoolCycle}
            placeholder={t("placeholders.selectCycle")}
            options={ALL_CYCLES.map((value) => ({
              value,
              label: tSchool(`cycles.${value}`),
            }))}
          />

          {showLevelField && (
            <Select
              name="schoolLevel"
              label={t("fields.schoolLevel")}
              required
              className="sm:col-span-2"
              value={schoolLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              error={errors.schoolLevel}
              placeholder={t("placeholders.selectLevel")}
              options={levelOptions}
            />
          )}

          {showTrackField && (
            <div className="sm:col-span-2">
              <Select
                name="commonCoreTrack"
                label={t("fields.commonCoreTrack")}
                required
                value={commonCoreTrack}
                onChange={(e) =>
                  setCommonCoreTrack(e.target.value as CommonCoreTrack)
                }
                error={errors.commonCoreTrack}
                placeholder={t("placeholders.selectTrack")}
                options={ALL_TRACKS.map((value) => ({
                  value,
                  label: tSchool(`tracks.${value}`),
                }))}
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {t("fields.trackNote")}
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
              <span className="block font-medium text-[#0E2250]">
                {t("fields.transportTitle")}
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                {t("fields.transportBody")}
              </span>
            </span>
          </label>

          {needsTransport && (
            <Textarea
              name="transportNotes"
              label={t("fields.transportNotes")}
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
              <span className="block font-medium text-[#0E2250]">
                {t("fields.canteenTitle")}
              </span>
              <span className="mt-1 block text-sm text-slate-600">
                {t("fields.canteenBody")}
              </span>
            </span>
          </label>
        </div>
      </Card>

      <div className="rounded-2xl border border-[#EEA748]/30 bg-[#FAFBFF] p-5 text-sm text-slate-600">
        <p>{t("disclaimer")}</p>
      </div>

      <Button type="submit" loading={loading} fullWidth variant="primary">
        {t("submit")}
      </Button>
    </form>
  );
}
