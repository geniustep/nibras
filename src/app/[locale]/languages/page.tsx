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
      <section className="py-20 text-center" style={{ backgroundColor: "#1a4a7a" }}>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("heroTitle")}</h1>
          <p className="text-blue-100 text-lg md:text-xl">{t("heroSubtitle")}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 bg-[#f7f8fc]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#4a5568] text-base leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      {/* Language Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col gap-10">

          {/* Arabic */}
          <div className="card-hover bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4" style={{ backgroundColor: "#1a4a7a" }}>
              <div className="text-4xl">🇲🇦</div>
              <h2 className="text-xl font-bold text-white">{t("arabic.title")}</h2>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[#4a5568] text-base leading-relaxed">{t("arabic.body")}</p>
            </div>
          </div>

          {/* French */}
          <div className="card-hover bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4 bg-blue-700">
              <div className="text-4xl">🇫🇷</div>
              <h2 className="text-xl font-bold text-white">{t("french.title")}</h2>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[#4a5568] text-base leading-relaxed">{t("french.body")}</p>
            </div>
          </div>

          {/* English + Cambridge */}
          <div className="card-hover bg-white rounded-2xl border-2 border-[#c9a227] shadow-sm overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4 bg-red-700">
              <div className="text-4xl">🇬🇧</div>
              <h2 className="text-xl font-bold text-white">{t("english.title")}</h2>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[#4a5568] text-base leading-relaxed mb-6">{t("english.body")}</p>
              <div className="bg-[#f7f8fc] border border-[#c9a227] rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">🏆</span>
                  <div>
                    <h4 className="font-bold text-[#1a4a7a] text-sm mb-1">Cambridge English</h4>
                    <p className="text-[#4a5568] text-sm italic">{t("english.cambridge")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16" style={{ backgroundColor: "#1a4a7a" }}>
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title={t("benefits.title")} light />
          <ul className="flex flex-col gap-3">
            {benefits.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#c9a227] text-xl mt-0.5 flex-shrink-0">🌟</span>
                <span className="text-white text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#f7f8fc] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href={`/${locale}/registration`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-lg transition-colors"
            style={{ backgroundColor: "#c9a227" }}
          >
            {locale === "ar" ? "سجّل ابنك" : locale === "fr" ? "Inscrire votre enfant" : "Register Your Child"}
          </Link>
        </div>
      </section>
    </div>
  );
}
