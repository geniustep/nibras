import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "../../../site.config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SectionTitle from "@/components/ui/SectionTitle";
import PillarCard from "@/components/ui/PillarCard";
import LevelCard from "@/components/ui/LevelCard";
import ActivityCard from "@/components/ui/ActivityCard";

type Locale = "ar" | "fr" | "en";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const whatsappUrl = getWhatsAppUrl(locale);
  const isRtl = locale === "ar";

  const pillars = t.raw("pillars.items") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  const levels = t.raw("levels.items") as Array<{
    title: string;
    ages: string;
    description: string;
    color: string;
  }>;
  const activities = t.raw("activities.items") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* ======= HERO ======= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src={siteConfig.assets.mainImage}
          alt={t("hero.title")}
          fill
          className="object-cover"
          priority
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-[#e4b93a] font-medium mb-6">
              {t("hero.subtitle")}
            </p>
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("hero.body")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={`/${locale}/registration`}
                className="px-6 py-3 rounded-lg font-bold text-white transition-colors"
                style={{ backgroundColor: "#c9a227" }}
              >
                {t("hero.requestInfo")}
              </Link>
              <Link
                href={`/${locale}/registration`}
                className="px-6 py-3 rounded-lg font-bold border-2 border-white text-white hover:bg-white hover:text-[#1a4a7a] transition-colors"
              >
                {t("hero.bookVisit")}
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg font-bold text-white flex items-center gap-2 transition-colors"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="18" height="18" fill="white">
                  <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.344.635 4.64 1.84 6.65L2.667 29.333l6.896-1.807A13.28 13.28 0 0016.003 29.333C23.363 29.333 29.333 23.36 29.333 16S23.363 2.667 16.003 2.667z" />
                </svg>
                {t("hero.whatsapp")}
              </a>
            </div>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-slow">
          <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* ======= INTRO ======= */}
      <section className="py-16 bg-[#f7f8fc]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a4a7a] mb-4">
            {t("intro.title")}
          </h2>
          <div className="h-1 w-16 bg-[#c9a227] mx-auto mb-6 rounded-full" />
          <p className="text-[#4a5568] text-base md:text-lg leading-relaxed">
            {t("intro.body")}
          </p>
        </div>
      </section>

      {/* ======= PILLARS ======= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={t("pillars.sectionTitle")}
            subtitle={t("pillars.sectionSubtitle")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((pillar, i) => (
              <PillarCard
                key={i}
                icon={pillar.icon}
                title={pillar.title}
                description={pillar.description}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ======= EDUCATIONAL LEVELS ======= */}
      <section className="py-16 bg-[#f7f8fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={t("levels.sectionTitle")}
            subtitle={t("levels.sectionSubtitle")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level, i) => (
              <LevelCard
                key={i}
                title={level.title}
                ages={level.ages}
                description={level.description}
                color={level.color}
                index={i}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/levels`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ backgroundColor: "#1a4a7a" }}
            >
              {locale === "ar" ? "اكتشف المزيد" : locale === "fr" ? "En savoir plus" : "Learn More"}
            </Link>
          </div>
        </div>
      </section>

      {/* ======= LANGUAGES ======= */}
      <section className="py-16" style={{ backgroundColor: "#1a4a7a" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            title={t("languages.sectionTitle")}
            subtitle={t("languages.sectionSubtitle")}
            light
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { flag: "🇲🇦", lang: locale === "ar" ? "العربية" : locale === "fr" ? "Arabe" : "Arabic", desc: locale === "ar" ? "لغة الهوية والتراث" : locale === "fr" ? "Langue de l'identité" : "Language of identity" },
              { flag: "🇫🇷", lang: locale === "ar" ? "الفرنسية" : locale === "fr" ? "Français" : "French", desc: locale === "ar" ? "لغة العلوم والمجال" : locale === "fr" ? "Langue des sciences" : "Language of sciences" },
              { flag: "🇬🇧", lang: locale === "ar" ? "الإنجليزية" : locale === "fr" ? "Anglais" : "English", desc: locale === "ar" ? "مسار Cambridge English" : locale === "fr" ? "Parcours Cambridge English" : "Cambridge English track" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">{item.flag}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.lang}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-blue-100 text-sm italic max-w-2xl mx-auto mb-6">
            {t("languages.cambridge")}
          </p>
          <Link
            href={`/${locale}/languages`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold border-2 border-white text-white hover:bg-white hover:text-[#1a4a7a] transition-colors"
          >
            {t("languages.learnMore")}
          </Link>
        </div>
      </section>

      {/* ======= ACTIVITIES ======= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={t("activities.sectionTitle")}
            subtitle={t("activities.sectionSubtitle")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {activities.map((act, i) => (
              <ActivityCard
                key={i}
                icon={act.icon}
                title={act.title}
                description={act.description}
                index={i}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/school-life`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ backgroundColor: "#1a4a7a" }}
            >
              {locale === "ar" ? "اكتشف الحياة المدرسية" : locale === "fr" ? "Découvrir la vie scolaire" : "Discover School Life"}
            </Link>
          </div>
        </div>
      </section>

      {/* ======= LOCATION ======= */}
      <section className="py-16 bg-[#f7f8fc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title={t("location.sectionTitle")} />
          <p className="text-[#4a5568] text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {t("location.body")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ backgroundColor: "#4285F4" }}
            >
              🗺️ {t("location.openMap")}
            </a>
            <Link
              href={`/${locale}/registration`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ backgroundColor: "#1a4a7a" }}
            >
              📅 {t("location.bookVisit")}
            </Link>
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="py-16 bg-[#1a1a2e]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("cta.sectionTitle")}
          </h2>
          <p className="text-gray-400 text-base mb-8">{t("cta.body")}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ backgroundColor: "#25D366" }}
            >
              📱 {t("cta.whatsapp")}
            </a>
            <Link
              href={`/${locale}/registration`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ backgroundColor: "#c9a227" }}
            >
              📝 {t("cta.form")}
            </Link>
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              🗺️ {t("cta.map")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
