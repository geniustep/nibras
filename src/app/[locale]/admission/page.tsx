import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RegistrationForm } from "@/components/admission/forms/RegistrationForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admissionPortal.form" });
  return { title: t("meta.title") };
}

export default async function AdmissionFormPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admissionPortal.form" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#0E2250] sm:text-3xl">{t("title")}</h1>
        <p className="mt-3 text-slate-600">{t("subtitle")}</p>
      </header>
      <RegistrationForm />
    </div>
  );
}
