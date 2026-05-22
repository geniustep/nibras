import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SectionTitle from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "schoolLifePage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function SchoolLifePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "schoolLifePage" });
  const isRtl = locale === "ar";

  const activities = t.raw("activities.items") as Array<{
    icon: string;
    title: string;
    description: string;
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

      {/* Activities */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle title={t("activities.title")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act, i) => (
              <div
                key={i}
                className="card-hover bg-[#FAFBFF] rounded-2xl p-6 border border-[#E5E7EB] flex flex-col gap-3"
              >
                <div className="text-4xl">{act.icon}</div>
                <h3 className="text-lg font-bold text-[#1D4395]">{act.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-16 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🏫</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("community.title")}
          </h2>
          <div className="h-1 w-16 bg-[#EEA748] mx-auto mb-6 rounded-full" />
          <p className="text-[#EAF1FF] text-base leading-relaxed max-w-2xl mx-auto">
            {t("community.body")}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#FAFBFF] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Link
            href={`/${locale}/registration`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-lg bg-[#1D4395] hover:bg-[#2857B8] transition-colors"
          >
            {locale === "ar" ? "احجز زيارة للمؤسسة" : locale === "fr" ? "Réserver une visite" : "Book a Visit"}
          </Link>
        </div>
      </section>
    </div>
  );
}
