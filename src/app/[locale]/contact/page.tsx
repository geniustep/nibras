import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "../../../../site.config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";

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

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="py-20 text-center" style={{ backgroundColor: "#1a4a7a" }}>
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("heroTitle")}</h1>
          <p className="text-blue-100 text-lg md:text-xl">{t("heroSubtitle")}</p>
        </div>
      </section>

      {/* Contact info + Form */}
      <section className="py-16 bg-[#f7f8fc]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Address */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm flex items-start gap-4">
              <div className="text-3xl">📍</div>
              <div>
                <h3 className="font-bold text-[#1a4a7a] mb-1">{t("address.title")}</h3>
                <p className="text-[#4a5568] text-sm">{t("address.value")}</p>
              </div>
            </div>

            {/* Phone */}
            {siteConfig.phone !== "PUT_PHONE_HERE" && (
              <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm flex items-start gap-4">
                <div className="text-3xl">📞</div>
                <div>
                  <h3 className="font-bold text-[#1a4a7a] mb-1">{t("phone.title")}</h3>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-[#4a5568] text-sm hover:text-[#1a4a7a] transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm flex items-start gap-4">
              <div className="text-3xl">📧</div>
              <div>
                <h3 className="font-bold text-[#1a4a7a] mb-1">{t("email.title")}</h3>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[#4a5568] text-sm hover:text-[#1a4a7a] transition-colors break-all"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

            {/* WhatsApp button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white text-base transition-colors"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" fill="white">
                <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.344.635 4.64 1.84 6.65L2.667 29.333l6.896-1.807A13.28 13.28 0 0016.003 29.333C23.363 29.333 29.333 23.36 29.333 16S23.363 2.667 16.003 2.667z" />
              </svg>
              {t("whatsapp")}
            </a>

            {/* Maps button */}
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-white text-base bg-[#4285F4] hover:bg-[#3367d6] transition-colors"
            >
              🗺️ {t("map")}
            </a>

            {/* Social */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm">
              <h3 className="font-bold text-[#1a4a7a] mb-4">{t("social.title")}</h3>
              <div className="flex gap-3">
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                  style={{ backgroundColor: "#1877f2" }}
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {siteConfig.social.instagram !== "PUT_INSTAGRAM_PAGE_URL_HERE" && (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                    style={{ backgroundColor: "#e4405f" }}
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
                {siteConfig.social.youtube !== "PUT_YOUTUBE_CHANNEL_URL_HERE" && (
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
                    style={{ backgroundColor: "#ff0000" }}
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <p className="text-[#4a5568] text-xs italic">{t("responseTime")}</p>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">{t("formTitle")}</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
