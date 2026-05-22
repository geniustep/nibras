import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SectionTitle from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "languagesPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function LanguagesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "languagesPage" });
  const isRtl = locale === "ar";
  const benefits = t.raw("benefits.items") as string[];

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="py-20 text-center hero-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("heroTitle")}</h1>
          <p className="text-[#EAF1FF] text-lg md:text-xl">{t("heroSubtitle")}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 bg-[#FAFBFF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#64748B] text-base leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      {/* Language Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col gap-10">

          {/* Arabic */}
          <div className="card-hover bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4 bg-[#1D4395]">
              <div className="text-4xl">🇲🇦</div>
              <h2 className="text-xl font-bold text-white">{t("arabic.title")}</h2>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[#64748B] text-base leading-relaxed">{t("arabic.body")}</p>
            </div>
          </div>

          {/* French */}
          <div className="card-hover bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4 bg-[#153373]">
              <div className="text-4xl">🇫🇷</div>
              <h2 className="text-xl font-bold text-white">{t("french.title")}</h2>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[#64748B] text-base leading-relaxed">{t("french.body")}</p>
            </div>
          </div>

          {/* English + Cambridge */}
          <div className="card-hover bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4 bg-[#2857B8]">
              <div className="text-4xl">🇬🇧</div>
              <h2 className="text-xl font-bold text-white">{t("english.title")}</h2>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[#64748B] text-base leading-relaxed mb-6">{t("english.body")}</p>
              <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
                <div className="h-0.5 bg-[#EEA748]" aria-hidden />
                <div className="px-5 py-3 bg-[#0E2250] flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">🏆</span>
                  <h4 className="font-bold text-white text-sm">{t("cambridge.title")}</h4>
                </div>
                <div className="p-5 bg-[#FAFBFF]">
                  <p className="text-[#64748B] text-sm italic">{t("cambridge.body")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title={t("benefits.title")} light />
          <ul className="flex flex-col gap-3">
            {benefits.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#EEA748] text-xl mt-0.5 flex-shrink-0">🌟</span>
                <span className="text-white text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#FAFBFF] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href={`/${locale}/registration`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-lg bg-[#1D4395] hover:bg-[#2857B8] transition-colors"
          >
            {locale === "ar" ? "سجّل ابنك" : locale === "fr" ? "Inscrire votre enfant" : "Register Your Child"}
          </Link>
        </div>
      </section>
    </div>
  );
}
