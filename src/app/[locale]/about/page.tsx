import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SectionTitle from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const isRtl = locale === "ar";

  const values = t.raw("values.items") as Array<{ title: string; description: string }>;
  const why = t.raw("why.items") as string[];

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="py-20 text-center hero-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("heroTitle")}</h1>
          <p className="text-[#EAF1FF] text-lg md:text-xl">{t("heroSubtitle")}</p>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title={t("history.title")} centered={false} />
          <p className="text-[#64748B] text-base leading-relaxed">{t("history.body")}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-[#FAFBFF]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
            <div className="text-3xl mb-4">🎯</div>
            <h2 className="text-xl font-bold text-[#1D4395] mb-3">{t("mission.title")}</h2>
            <p className="text-[#64748B] text-sm leading-relaxed">{t("mission.body")}</p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] shadow-sm">
            <div className="text-3xl mb-4">🌟</div>
            <h2 className="text-xl font-bold text-[#1D4395] mb-3">{t("vision.title")}</h2>
            <p className="text-[#64748B] text-sm leading-relaxed">{t("vision.body")}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title={t("values.title")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, i) => (
              <div
                key={i}
                className="card-hover bg-[#FAFBFF] rounded-xl p-6 border border-[#E5E7EB] text-center"
              >
                <h3 className="font-bold text-[#1D4395] text-base mb-2">{val.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <SectionTitle title={t("why.title")} light />
          <ul className="flex flex-col gap-3">
            {why.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#EEA748] text-xl mt-0.5 flex-shrink-0">✓</span>
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
            {locale === "ar" ? "تواصل معنا" : locale === "fr" ? "Contactez-nous" : "Contact Us"}
          </Link>
        </div>
      </section>
    </div>
  );
}
