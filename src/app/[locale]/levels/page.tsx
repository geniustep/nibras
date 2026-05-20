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
  blue: { header: "bg-blue-600", badge: "bg-blue-100 text-blue-800", bullet: "text-blue-600" },
  green: { header: "bg-green-600", badge: "bg-green-100 text-green-800", bullet: "text-green-600" },
  amber: { header: "bg-amber-500", badge: "bg-amber-100 text-amber-800", bullet: "text-amber-600" },
  red: { header: "bg-red-600", badge: "bg-red-100 text-red-800", bullet: "text-red-600" },
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

      {/* Levels detail */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col gap-10">
          {items.map((item, i) => {
            const colors = colorMap[item.color] ?? colorMap.blue;
            return (
              <div
                key={i}
                className="card-hover bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden"
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
                    <p className="text-[#4a5568] text-sm leading-relaxed">{item.fullDescription}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a2e] text-sm mb-3">
                      {locale === "ar" ? "أبرز المميزات:" : locale === "fr" ? "Points clés :" : "Key highlights:"}
                    </h4>
                    <ul className="flex flex-col gap-2">
                      {item.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className={`${colors.bullet} font-bold mt-0.5 flex-shrink-0`}>✓</span>
                          <span className="text-[#4a5568] text-sm">{h}</span>
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
      <section className="py-12 bg-[#f7f8fc] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <SectionTitle
            title={locale === "ar" ? "مستعد للانطلاق؟" : locale === "fr" ? "Prêt à commencer ?" : "Ready to begin?"}
          />
          <Link
            href={`/${locale}/registration`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-lg transition-colors"
            style={{ backgroundColor: "#c9a227" }}
          >
            {locale === "ar" ? "سجّل ابنك اليوم" : locale === "fr" ? "Inscrire votre enfant" : "Register Your Child"}
          </Link>
        </div>
      </section>
    </div>
  );
}
