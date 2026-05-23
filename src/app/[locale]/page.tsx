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

const levelTimelineColors: Record<string, string> = {
  blue: "#2857B8",
  green: "#2E7D5B",
  amber: "#EEA748",
  red: "#153373",
};

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
  const highlights = t.raw("highlights.items") as Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  const learnMoreLabel =
    locale === "ar" ? "اكتشف المزيد" : locale === "fr" ? "En savoir plus" : "Learn More";
  const discoverSchoolLifeLabel =
    locale === "ar"
      ? "الحياة المدرسية"
      : locale === "fr"
      ? "Vie scolaire"
      : "School Life";

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden">
        <Image
          src={siteConfig.assets.mainImage}
          alt={t("hero.title")}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-20">
          <div className="animate-fade-in-up">
            {/* School name — big and clear */}
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-3">
              {t("hero.title")}
            </h1>
            {/* Gold accent divider */}
            <div className="h-1 w-20 bg-[#EEA748] mx-auto rounded-full mb-5" />
            {/* Tagline */}
            <p className="text-lg md:text-2xl text-white/90 font-medium mb-8 max-w-xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
            {/* Two CTAs only */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/${locale}/contact`}
                className="px-7 py-3.5 rounded-xl font-bold text-white text-base bg-[#1D4395] hover:bg-[#2857B8] transition-colors shadow-lg"
              >
                {t("hero.requestInfo")}
              </Link>
              <Link
                href={siteConfig.paths.admissionIntro}
                className="px-7 py-3.5 rounded-xl font-bold border-2 border-white text-white hover:bg-white hover:text-[#1D4395] transition-colors text-base shadow-lg"
              >
                {t("hero.startAdmission")}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-slow">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          IDENTITY — 3 key points
      ══════════════════════════════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brief welcome */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D4395] mb-3">
              {t("intro.title")}
            </h2>
            <div className="h-1 w-14 bg-[#EEA748] mx-auto rounded-full mb-5" />
            <p className="text-[#64748B] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              {t("intro.body")}
            </p>
          </div>

          {/* 3 identity cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="bg-[#FAFBFF] rounded-2xl p-6 border border-[#E5E7EB] flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: "rgba(29,67,149,0.08)" }}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#1D4395]">{item.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PILLARS — 5 educational pillars
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#FAFBFF]">
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
          <div className="text-center mt-8">
            <Link
              href={`/${locale}/pedagogical-project`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#1D4395] border-2 border-[#1D4395] hover:bg-[#1D4395] hover:text-white transition-colors text-sm"
            >
              {learnMoreLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LEVELS — journey timeline
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={t("levels.sectionTitle")}
            subtitle={t("levels.sectionSubtitle")}
          />

          {/* Timeline layout */}
          <div className="relative">
            {/* Horizontal connector line (desktop) */}
            <div
              className="hidden lg:block absolute h-0.5 bg-[#E5E7EB]"
              style={{ top: "28px", left: "12.5%", right: "12.5%", zIndex: 0 }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {levels.map((level, i) => {
                const dotColor =
                  levelTimelineColors[level.color] ?? levelTimelineColors.blue;
                return (
                  <div key={i} className="flex flex-col items-center gap-4 text-center">
                    {/* Numbered step circle */}
                    <div
                      className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-md border-4 border-white flex-shrink-0"
                      style={{ backgroundColor: dotColor }}
                    >
                      {i + 1}
                    </div>
                    {/* Card (full width) */}
                    <div className="w-full">
                      <LevelCard
                        title={level.title}
                        ages={level.ages}
                        description={level.description}
                        color={level.color}
                        index={i}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${locale}/levels`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#1D4395] border-2 border-[#1D4395] hover:bg-[#1D4395] hover:text-white transition-colors text-sm"
            >
              {learnMoreLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LANGUAGES — trilingual section
      ══════════════════════════════════════════ */}
      <section className="py-16 hero-gradient">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={t("languages.sectionTitle")}
            subtitle={t("languages.sectionSubtitle")}
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              {
                abbr: locale === "ar" ? "ع" : "AR",
                lang:
                  locale === "ar" ? "العربية" : locale === "fr" ? "Arabe" : "Arabic",
                role: t("languages.roles.arabic"),
                accent: "#EEA748",
              },
              {
                abbr: "FR",
                lang:
                  locale === "ar" ? "الفرنسية" : locale === "fr" ? "Français" : "French",
                role: t("languages.roles.french"),
                accent: "#3B6FD3",
              },
              {
                abbr: "EN",
                lang:
                  locale === "ar"
                    ? "الإنجليزية"
                    : locale === "fr"
                    ? "Anglais"
                    : "English",
                role: t("languages.roles.english"),
                accent: "#2857B8",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-2xl p-6 border border-white/15 hover:bg-white/15 transition-colors"
              >
                {/* Language abbreviation badge */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white mb-4"
                  style={{ backgroundColor: item.accent + "33", border: `2px solid ${item.accent}` }}
                >
                  <span style={{ color: item.accent }}>{item.abbr}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.lang}</h3>
                <p className="text-[#EAF1FF] text-sm leading-relaxed">{item.role}</p>
              </div>
            ))}
          </div>

          {/* Cambridge note — exact approved phrasing */}
          <div className="bg-white/8 rounded-2xl p-5 border border-white/15 mb-7 max-w-3xl mx-auto">
            <p className="text-[#EAF1FF] text-sm leading-relaxed text-center">
              {t("languages.cambridge")}
            </p>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/languages`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold border-2 border-white text-white hover:bg-white hover:text-[#1D4395] transition-colors"
            >
              {t("languages.learnMore")}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ACTIVITIES — school life
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#FAFBFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={t("activities.sectionTitle")}
            subtitle={t("activities.sectionSubtitle")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#1D4395] border-2 border-[#1D4395] hover:bg-[#1D4395] hover:text-white transition-colors text-sm"
            >
              {discoverSchoolLifeLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════ */}
      <section
        className="py-20 relative overflow-hidden hero-gradient"
      >
        {/* Subtle background accent */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #EEA748 0%, transparent 50%), radial-gradient(circle at 80% 50%, #ffffff 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {t("cta.sectionTitle")}
          </h2>
          <div className="h-1 w-16 bg-[#EEA748] mx-auto rounded-full mb-6" />
          <p className="text-[#EAF1FF] text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {t("cta.body")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Primary: request info */}
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-[#1D4395] hover:bg-[#2857B8] transition-colors text-sm shadow-lg"
            >
              {t("hero.requestInfo")}
            </Link>
            {/* Secondary: book visit */}
            <Link
              href={siteConfig.paths.admissionIntro}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold border-2 border-white text-white hover:bg-white hover:text-[#1D4395] transition-colors text-sm shadow-lg"
            >
              {t("cta.startAdmission")}
            </Link>
            <Link
              href={`/${locale}/registration`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white/90 border border-white/40 hover:bg-white/10 transition-colors text-sm"
            >
              {t("hero.bookVisit")}
            </Link>
            {/* Tertiary: map */}
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white/80 border border-white/30 hover:bg-white/10 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("location.openMap")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
