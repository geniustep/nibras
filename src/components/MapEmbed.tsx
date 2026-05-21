"use client";

import { useState } from "react";

interface Props {
  embedUrl: string;
  mapsUrl: string;
  openLabel: string;
  title: string;
  locale: string;
}

export default function MapEmbed({ embedUrl, mapsUrl, openLabel, title, locale }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#e2e8f0]"
      style={{
        height: "420px",
        boxShadow: "0 4px 24px rgba(26,74,122,0.10)",
      }}
    >
      {/* Placeholder visible while iframe loads or if blocked */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ backgroundColor: "#f0f4f8" }}
        aria-hidden={loaded}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#4285F4" }}
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-[#4a5568] text-sm font-medium">Madaris Nibras</p>
        <p className="text-[#718096] text-xs">
          {locale === "ar"
            ? "مجمع زموري 3، قرب أسواق السلام"
            : locale === "fr"
              ? "Complexe Zemmouri 3, près d'Aswak Assalam"
              : "Zemmouri 3 Complex, near Aswak Assalam"}
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#4285F4" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {openLabel}
        </a>
      </div>

      {/* Google Maps iframe */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
