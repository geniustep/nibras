"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "../../site.config";

type Locale = "ar" | "fr" | "en";

interface Props {
  locale: Locale;
}

// Static label objects — never depend on window/browser state
const localeFull: Record<Locale, string> = {
  ar: "العربية",
  fr: "Français",
  en: "English",
};

export default function Header({ locale }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const isRtl = locale === "ar";
  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  function switchLocale(newLocale: Locale) {
    // Preserve current page path, only swap the locale segment
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
  }

  function isActive(href: string, key: string): boolean {
    if (key === "home") return pathname === `/${locale}`;
    return pathname === href || pathname.startsWith(href + "/");
  }

  // Primary links — always visible on desktop
  const primaryLinks = [
    { key: "home", href: `/${locale}` },
    { key: "about", href: `/${locale}/about` },
    { key: "pedagogicalProject", href: `/${locale}/pedagogical-project` },
    { key: "levels", href: `/${locale}/levels` },
    { key: "registration", href: `/${locale}/registration` },
    { key: "contact", href: `/${locale}/contact` },
  ] as const;

  // Secondary links — in "More" dropdown
  const secondaryLinks = [
    { key: "languages", href: `/${locale}/languages` },
    { key: "schoolLifeActivities", href: `/${locale}/school-life` },
  ] as const;

  const allLocales: Locale[] = ["ar", "fr", "en"];

  return (
    <header
      className="sticky top-0 z-50 bg-white"
      style={{
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 6px 0 rgba(26,74,122,0.06)",
      }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            href={`/${locale}`}
            className="flex items-center flex-shrink-0"
            aria-label={siteConfig.name[locale]}
          >
            <Image
              src={siteConfig.assets.logo}
              alt={siteConfig.name[locale]}
              width={140}
              height={52}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {primaryLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(href, key)
                    ? "text-[#1a4a7a] bg-blue-50 font-semibold"
                    : "text-[#4a5568] hover:text-[#1a4a7a] hover:bg-blue-50"
                }`}
              >
                {t(key)}
              </Link>
            ))}

            {/* More dropdown */}
            <div ref={moreRef} className="relative">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#4a5568] hover:text-[#1a4a7a] hover:bg-blue-50 transition-colors"
                aria-expanded={moreOpen}
              >
                {t("more")}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreOpen && (
                <div
                  className={`absolute top-full mt-1.5 w-56 bg-white border border-[#e2e8f0] rounded-xl overflow-hidden ${
                    isRtl ? "right-0" : "left-0"
                  }`}
                  style={{ boxShadow: "0 8px 24px rgba(26,74,122,0.10)" }}
                >
                  {secondaryLinks.map(({ key, href }) => (
                    <Link
                      key={key}
                      href={href}
                      onClick={() => setMoreOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(href, key)
                          ? "text-[#1a4a7a] bg-blue-50 font-semibold"
                          : "text-[#4a5568] hover:text-[#1a4a7a] hover:bg-blue-50"
                      }`}
                    >
                      {t(key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">

            {/* Language dropdown (desktop) */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#4a5568] border border-[#e2e8f0] rounded-lg hover:border-[#1a4a7a] hover:text-[#1a4a7a] transition-colors"
                aria-expanded={langOpen}
              >
                {localeFull[locale]}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {langOpen && (
                <div
                  className={`absolute top-full mt-1.5 w-36 bg-white border border-[#e2e8f0] rounded-xl overflow-hidden ${
                    isRtl ? "right-0" : "left-0"
                  }`}
                  style={{ boxShadow: "0 8px 24px rgba(26,74,122,0.10)" }}
                >
                  {allLocales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        l === locale
                          ? "text-[#1a4a7a] font-semibold bg-blue-50"
                          : "text-[#4a5568] hover:bg-blue-50 hover:text-[#1a4a7a]"
                      }`}
                    >
                      {localeFull[l]}
                      {l === locale && (
                        <svg className="w-3.5 h-3.5 text-[#1a4a7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              href={`/${locale}/contact`}
              className="hidden lg:flex items-center px-4 py-2 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ backgroundColor: "#c9a227" }}
            >
              {t("getInfo")}
            </Link>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-[#4a5568] hover:text-[#1a4a7a] hover:bg-blue-50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div
          className="lg:hidden border-t border-[#e2e8f0] bg-white"
          style={{ boxShadow: "0 8px 24px rgba(26,74,122,0.08)" }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {/* All nav links */}
            {[...primaryLinks, ...secondaryLinks].map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(href, key)
                    ? "text-[#1a4a7a] bg-blue-50 font-semibold"
                    : "text-[#1a1a2e] hover:bg-blue-50 hover:text-[#1a4a7a]"
                }`}
              >
                {t(key)}
              </Link>
            ))}

            <div className="border-t border-[#e2e8f0] mt-2 pt-3 flex flex-col gap-2">
              {/* Language switcher — pill buttons */}
              <div className="flex gap-1.5">
                {allLocales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      l === locale
                        ? "border-[#1a4a7a] text-[#1a4a7a] bg-blue-50"
                        : "border-[#e2e8f0] text-[#4a5568] hover:border-[#1a4a7a] hover:text-[#1a4a7a]"
                    }`}
                  >
                    {localeFull[l]}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 rounded-xl text-center text-sm font-bold text-white"
                style={{ backgroundColor: "#c9a227" }}
              >
                {t("getInfo")}
              </Link>

              {/* Book visit */}
              <Link
                href={`/${locale}/registration`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 rounded-xl text-center text-sm font-semibold text-[#1a4a7a] border-2 border-[#1a4a7a] hover:bg-blue-50 transition-colors"
              >
                {t("bookVisit")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
