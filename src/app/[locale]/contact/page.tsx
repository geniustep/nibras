import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "../../../../site.config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const isRtl = locale === "ar";
  const whatsappUrl = getWhatsAppUrl(locale);
  const embedUrl = `${siteConfig.googleMapsEmbedUrl}&hl=${locale}`;
  const mapTitle =
    locale === "ar"
      ? "موقع مدارس النبراس على الخريطة"
      : locale === "fr"
      ? "Localisation de Madaris Nibras"
      : "Madaris Nibras location on map";

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>

      {/* ── Hero ── */}
      <section className="py-16 md:py-20 text-center relative overflow-hidden hero-gradient">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, #EEA748 0%, transparent 60%), radial-gradient(circle at 70% 30%, #ffffff 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t("heroTitle")}
          </h1>
          <div className="h-1 w-16 rounded-full mx-auto mb-5" style={{ backgroundColor: "#EEA748" }} />
          <p className="text-[#EAF1FF] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* ── Contact cards ── */}
      <section className="py-12 bg-[#FAFBFF]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" fill="white">
                  <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.344.635 4.64 1.84 6.65L2.667 29.333l6.896-1.807A13.28 13.28 0 0016.003 29.333C23.363 29.333 29.333 23.36 29.333 16S23.363 2.667 16.003 2.667zm0 2.4c5.955 0 10.8 4.845 10.8 10.8s-4.845 10.8-10.8 10.8a10.76 10.76 0 01-5.527-1.523l-.394-.238-4.088 1.072 1.09-3.973-.258-.41A10.758 10.758 0 015.203 16c0-5.955 4.845-10.933 10.8-10.933zm-3.066 5.6c-.24 0-.627.09-.956.45-.329.36-1.254 1.226-1.254 2.99 0 1.764 1.284 3.468 1.463 3.708.18.24 2.487 3.803 6.094 5.181.853.328 1.517.523 2.035.671.855.243 1.634.209 2.249.127.686-.093 2.11-.862 2.408-1.694.298-.833.298-1.546.208-1.695-.09-.148-.33-.238-.69-.418-.36-.18-2.11-1.042-2.44-1.162-.328-.12-.567-.18-.806.18-.24.36-.927 1.162-1.136 1.4-.208.24-.417.27-.777.09-.36-.18-1.52-.56-2.895-1.787-1.071-.954-1.794-2.132-2.003-2.492-.208-.36-.022-.554.157-.733.16-.16.36-.418.54-.627.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.807-1.944-1.105-2.663-.29-.7-.587-.604-.807-.615l-.687-.012z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#1D4395] text-sm mb-1">WhatsApp</p>
                <p className="text-[#64748B] text-xs">{siteConfig.phone}</p>
              </div>
            </a>

            {/* Phone */}
            {siteConfig.phone !== "PUT_PHONE_HERE" && (
              <a
                href={`tel:${siteConfig.phone}`}
                className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#1D4395" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-[#1D4395] text-sm mb-1">{t("phone.title")}</p>
                  <p className="text-[#64748B] text-xs">{siteConfig.phone}</p>
                </div>
              </a>
            )}

            {/* Email */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#EEA748" }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#1D4395] text-sm mb-1">{t("email.title")}</p>
                <p className="text-[#64748B] text-xs break-all">{siteConfig.email}</p>
              </div>
            </a>

            {/* Location */}
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#4285F4" }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[#1D4395] text-sm mb-1">{t("address.title")}</p>
                <p className="text-[#64748B] text-xs">{t("address.value")}</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── Map section ── */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Info card */}
            <div className="lg:col-span-2 bg-[#FAFBFF] rounded-2xl p-7 border border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#4285F4" }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#1D4395]">{t("mapSection.title")}</h2>
              </div>
              <div className="h-0.5 w-12 rounded-full mb-5" style={{ backgroundColor: "#EEA748" }} />
              <p className="text-[#64748B] text-sm leading-relaxed mb-6">{t("mapSection.body")}</p>
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#4285F4" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t("mapSection.openMap")}
              </a>

              {/* Social */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
                <p className="text-xs font-semibold text-[#64748B] mb-3 uppercase tracking-wide">
                  {t("social.title")}
                </p>
                <div className="flex gap-2">
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#1877f2" }}
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  {siteConfig.social.instagram !== "PUT_INSTAGRAM_PAGE_URL_HERE" && (
                    <a
                      href={siteConfig.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#e4405f" }}
                      aria-label="Instagram"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  )}
                  {siteConfig.social.youtube !== "PUT_YOUTUBE_CHANNEL_URL_HERE" && (
                    <a
                      href={siteConfig.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "#ff0000" }}
                      aria-label="YouTube"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Google Maps — interactive with fallback */}
            <div className="lg:col-span-3">
              <MapEmbed
                embedUrl={embedUrl}
                mapsUrl={siteConfig.googleMapsUrl}
                openLabel={t("mapSection.openMap")}
                title={mapTitle}
                locale={locale}
              />
              <p className="text-xs text-[#64748B] mt-2 text-center">
                {siteConfig.name[locale as "ar" | "fr" | "en"]} — {t("address.value")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact form ── */}
      <section className="py-12 bg-[#FAFBFF]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D4395] mb-3">{t("formTitle")}</h2>
            <div className="h-1 w-12 rounded-full mx-auto" style={{ backgroundColor: "#EEA748" }} />
            <p className="text-[#64748B] text-sm mt-3">{t("responseTime")}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
