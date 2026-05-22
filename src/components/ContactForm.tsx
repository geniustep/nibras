"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    parentName: "",
    phone: "",
    email: "",
    studentName: "",
    level: "",
    preferredLanguage: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-10 text-center flex flex-col items-center gap-4">
        <div className="text-5xl">✅</div>
        <h3 className="text-2xl font-bold text-green-700">{t("successTitle")}</h3>
        <p className="text-green-600 text-base">{t("successMessage")}</p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#0E2250] focus:outline-none focus:ring-2 focus:ring-[#1D4395] focus:border-transparent transition-colors text-sm";
  const labelClass = "block text-sm font-semibold text-[#0E2250] mb-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-6 md:p-8 flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Parent name */}
        <div>
          <label htmlFor="parentName" className={labelClass}>
            {t("parentName")} *
          </label>
          <input
            id="parentName"
            name="parentName"
            type="text"
            required
            value={form.parentName}
            onChange={handleChange}
            placeholder={t("parentNamePlaceholder")}
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className={labelClass}>
            {t("phone")} *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder={t("phonePlaceholder")}
            className={`${inputClass} ltr-number`}
            dir="ltr"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />
        </div>

        {/* Student name */}
        <div>
          <label htmlFor="studentName" className={labelClass}>
            {t("studentName")} *
          </label>
          <input
            id="studentName"
            name="studentName"
            type="text"
            required
            value={form.studentName}
            onChange={handleChange}
            placeholder={t("studentNamePlaceholder")}
            className={inputClass}
          />
        </div>

        {/* Level */}
        <div>
          <label htmlFor="level" className={labelClass}>
            {t("level")} *
          </label>
          <select
            id="level"
            name="level"
            required
            value={form.level}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">{t("levelPlaceholder")}</option>
            <option value="preschool">{t("levels.preschool")}</option>
            <option value="primary">{t("levels.primary")}</option>
            <option value="middle">{t("levels.middle")}</option>
            <option value="high">{t("levels.high")}</option>
          </select>
        </div>

        {/* Preferred language */}
        <div>
          <label htmlFor="preferredLanguage" className={labelClass}>
            {t("preferredLanguage")}
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={form.preferredLanguage}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="ar">{t("languages.ar")}</option>
            <option value="fr">{t("languages.fr")}</option>
            <option value="en">{t("languages.en")}</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder={t("messagePlaceholder")}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-lg font-bold text-white bg-[#1D4395] hover:bg-[#2857B8] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
