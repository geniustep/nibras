"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "../../site.config";
import { getWhatsAppUrl } from "@/lib/whatsapp";

type Locale = "ar" | "fr" | "en";

interface Props {
  locale: Locale;
}

const localeLabels: Record<Locale, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
};

export default function Header({ locale }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRtl = locale === "ar";
  const whatsappUrl = getWhatsAppUrl(locale);

  // Switch locale while keeping the path
  function switchLocale(newLocale: Locale) {
    // pathname is like /ar/about → replace leading locale segment
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/") || `/${newLocale}`);
    setMenuOpen(false);
  }

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

  const otherLocales = (["ar", "fr", "en"] as Locale[]).filter(
    (l) => l !== locale
  );

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0] shadow-sm"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <Image
              src={siteConfig.assets.logo}
              alt={locale === "ar" ? siteConfig.name.ar : siteConfig.name.fr}
              width={44}
              height={44}
              className="object-contain"
              priority
            />
            <span className="font-bold text-[#1a4a7a] text-sm hidden sm:block">
              {locale === "ar" ? siteConfig.name.ar : siteConfig.name.fr}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(({ key, href }) => {
              const isActive = pathname === href || (key === "home" && pathname === `/${locale}`);
              return (
                <Link
                  key={key}
                  href={href}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-[#1a4a7a] bg-blue-50 font-semibold"
                      : "text-[#4a5568] hover:text-[#1a4a7a] hover:bg-blue-50"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="hidden md:flex items-center gap-1">
              {otherLocales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className="px-2 py-1 text-xs font-medium text-[#4a5568] hover:text-[#1a4a7a] border border-[#e2e8f0] rounded hover:border-[#1a4a7a] transition-colors"
                >
                  {localeLabels[l]}
                </button>
              ))}
            </div>

            {/* WhatsApp icon */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center transition-colors"
              style={{ backgroundColor: "#25D366" }}
              aria-label="WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="18"
                height="18"
                fill="white"
              >
                <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.344.635 4.64 1.84 6.65L2.667 29.333l6.896-1.807A13.28 13.28 0 0016.003 29.333C23.363 29.333 29.333 23.36 29.333 16S23.363 2.667 16.003 2.667zm0 2.4c5.955 0 10.8 4.845 10.8 10.8s-4.845 10.8-10.8 10.8a10.76 10.76 0 01-5.527-1.523l-.394-.238-4.088 1.072 1.09-3.973-.258-.41A10.758 10.758 0 015.203 16c0-5.955 4.845-10.933 10.8-10.933zm-3.066 5.6c-.24 0-.627.09-.956.45-.329.36-1.254 1.226-1.254 2.99 0 1.764 1.284 3.468 1.463 3.708.18.24 2.487 3.803 6.094 5.181.853.328 1.517.523 2.035.671.855.243 1.634.209 2.249.127.686-.093 2.11-.862 2.408-1.694.298-.833.298-1.546.208-1.695-.09-.148-.33-.238-.69-.418-.36-.18-2.11-1.042-2.44-1.162-.328-.12-.567-.18-.806.18-.24.36-.927 1.162-1.136 1.4-.208.24-.417.27-.777.09-.36-.18-1.52-.56-2.895-1.787-1.071-.954-1.794-2.132-2.003-2.492-.208-.36-.022-.554.157-.733.16-.16.36-.418.54-.627.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.807-1.944-1.105-2.663-.29-.7-.587-.604-.807-.615l-.687-.012z" />
              </svg>
            </a>

            {/* CTA Button */}
            <Link
              href={`/${locale}/registration`}
              className="hidden lg:flex items-center px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors"
              style={{ backgroundColor: "#c9a227" }}
            >
              {t("getInfo")}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 rounded-md text-[#4a5568] hover:text-[#1a4a7a] hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden border-t border-[#e2e8f0] bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-[#1a1a2e] hover:bg-blue-50 hover:text-[#1a4a7a] transition-colors"
              >
                {t(key)}
              </Link>
            ))}
            {/* Language switcher mobile */}
            <div className="flex gap-2 pt-3 border-t border-[#e2e8f0] mt-2">
              {(["ar", "fr", "en"] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`flex-1 py-2 text-xs font-semibold rounded border transition-colors ${
                    l === locale
                      ? "border-[#1a4a7a] text-[#1a4a7a] bg-blue-50"
                      : "border-[#e2e8f0] text-[#4a5568] hover:border-[#1a4a7a]"
                  }`}
                >
                  {localeLabels[l]}
                </button>
              ))}
            </div>
            <Link
              href={`/${locale}/registration`}
              onClick={() => setMenuOpen(false)}
              className="mt-2 py-3 rounded-lg text-center text-sm font-bold text-white"
              style={{ backgroundColor: "#c9a227" }}
            >
              {t("getInfo")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
