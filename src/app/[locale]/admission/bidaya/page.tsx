import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/admission/ui/Button";
import { getAdmissionPaths, type AppLocale } from "@/lib/admission/paths";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admissionPortal.intro" });
  return { title: t("meta.title") };
}

export default async function AdmissionIntroPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admissionPortal.intro" });
  const paths = getAdmissionPaths(locale as AppLocale);
  const steps = t.raw("steps") as Array<{ title: string; text: string }>;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F8FF] to-[#FAFBFF]">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-l from-[#EEA748] via-[#1D4395] to-[#0E2250]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-[#EEA748]/40 bg-white px-4 py-1 text-xs font-semibold text-[#1D4395]">
              {t("badge")}
            </span>

            <h1 className="mt-6 text-3xl font-bold leading-tight text-[#0E2250] sm:text-4xl lg:text-5xl">
              {t("heroTitle")}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">{t("heroBody")}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={paths.form}>
                <Button variant="primary">{t("ctaStart")}</Button>
              </Link>
              <a href="#ma3lomat">
                <Button variant="outline">{t("ctaHow")}</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="ma3lomat" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-[#0E2250]">{t("stepsTitle")}</h2>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((item, index) => (
            <article
              key={index}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D4395] text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-bold text-[#0E2250]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0E2250] py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-lg font-medium">{t("closingQuote")}</p>
          <Link href={paths.form} className="mt-6 inline-block">
            <Button variant="gold">{t("ctaSubmit")}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
