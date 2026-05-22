import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "../../site.config";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type Locale = "ar" | "fr" | "en";

interface Props {
  locale: Locale;
}

export default async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const isRtl = locale === "ar";
  const whatsappUrl = getWhatsAppUrl(locale);

  const navLinks = [
    { key: "home", href: `/${locale}` },
    { key: "about", href: `/${locale}/about` },
    { key: "pedagogicalProject", href: `/${locale}/pedagogical-project` },
    { key: "levels", href: `/${locale}/levels` },
    { key: "languages", href: `/${locale}/languages` },
    { key: "schoolLife", href: `/${locale}/school-life` },
    { key: "registration", href: `/${locale}/registration` },
    { key: "contact", href: `/${locale}/contact` },
  ] as const;

  return (
    <footer
      className="bg-[#0E2250] text-white pt-12 pb-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={siteConfig.assets.logo}
                alt={siteConfig.name[locale]}
                width={48}
                height={48}
                className="object-contain rounded-lg"
              />
              <span className="font-bold text-lg text-white">
                {siteConfig.name[locale]}
              </span>
            </div>
            <p className="text-[#EAF1FF]/80 text-sm leading-relaxed mb-4">
              {t("description")}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877f2] transition-colors"
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
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#e4405f] transition-colors"
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
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff0000] transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              {t("quickLinks")}
            </h3>
            <ul className="flex flex-col gap-2">
              {navLinks.slice(0, 4).map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-[#EAF1FF]/80 text-sm hover:text-[#EEA748] transition-colors"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: More links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider opacity-0 select-none">
              &nbsp;
            </h3>
            <ul className="flex flex-col gap-2">
              {navLinks.slice(4).map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-[#EAF1FF]/80 text-sm hover:text-[#EEA748] transition-colors"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              {t("contactInfo")}
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <span className="text-[#EEA748] mt-0.5">📍</span>
                <span className="text-[#EAF1FF]/80 text-sm">{t("address")}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#EEA748] mt-0.5">📧</span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[#EAF1FF]/80 text-sm hover:text-[#EEA748] transition-colors break-all"
                >
                  {siteConfig.email}
                </a>
              </div>
              {siteConfig.phone !== "PUT_PHONE_HERE" && (
                <div className="flex items-start gap-2">
                  <span className="text-[#EEA748] mt-0.5">📞</span>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-[#EAF1FF]/80 text-sm hover:text-[#EEA748] transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors mt-1"
                style={{ backgroundColor: "#25D366" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="white">
                  <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.344.635 4.64 1.84 6.65L2.667 29.333l6.896-1.807A13.28 13.28 0 0016.003 29.333C23.363 29.333 29.333 23.36 29.333 16S23.363 2.667 16.003 2.667z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#4285F4] hover:bg-[#3367d6] transition-colors"
              >
                🗺️ Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-[#EAF1FF]/60 text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
