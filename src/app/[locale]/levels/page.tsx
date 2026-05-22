import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SectionTitle from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "levelsPage.meta" });
  return { title: t("title"), description: t("description") };
}

const colorMap: Record<string, { header: string; badge: string; bullet: string }> = {
  blue: {
    header: "bg-[#1D4395]",
    badge: "bg-[#EAF1FF] text-[#153373]",
    bullet: "text-[#1D4395]",
  },
  green: {
    header: "bg-[#153373]",
    badge: "bg-[#EAF1FF] text-[#0E2250]",
    bullet: "text-[#2857B8]",
  },
  amber: {
    header: "bg-[#EEA748]",
    badge: "bg-[#FFF2DC] text-[#7A4A08]",
    bullet: "text-[#B87518]",
  },
  red: {
    header: "bg-[#0E2250]",
    badge: "bg-[#EAF1FF] text-[#153373]",
    bullet: "text-[#3B6FD3]",
  },
};

export default async function LevelsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "levelsPage" });
  const isRtl = locale === "ar";

  const items = t.raw("items") as Array<{
    title: string;
    ages: string;
    icon: string;
    color: string;
    fullDescription: string;
    highlights: string[];
  }>;

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

      {/* Levels detail */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-10">
          {items.map((item, i) => {
            const colors = colorMap[item.color] ?? colorMap.blue;
            return (
              <div
                key={i}
                className="card-hover bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden"
              >
                <div className={`${colors.header} px-8 py-5 flex items-center gap-4`}>
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{item.title}</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white`}>
                      {item.ages}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-[#64748B] text-sm leading-relaxed">{item.fullDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0E2250] text-sm mb-3">
                      {locale === "ar" ? "أبرز المميزات:" : locale === "fr" ? "Points clés :" : "Key highlights:"}
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {item.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className={`${colors.bullet} font-bold mt-0.5 flex-shrink-0`}>✓</span>
                          <span className="text-[#64748B] text-sm">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#FAFBFF] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <SectionTitle
            title={locale === "ar" ? "مستعد للانطلاق؟" : locale === "fr" ? "Prêt à commencer ?" : "Ready to begin?"}
          />
          <Link
            href={`/${locale}/registration`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-lg bg-[#1D4395] hover:bg-[#2857B8] transition-colors"
          >
            {locale === "ar" ? "سجّل ابنك اليوم" : locale === "fr" ? "Inscrire votre enfant" : "Register Your Child"}
          </Link>
        </div>
      </section>
    </div>
  );
}
