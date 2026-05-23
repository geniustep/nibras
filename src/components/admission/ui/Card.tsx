import { ReactNode } from "react";

export function Card({
  children,
  className = "",
  title,
  subtitle,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ${className}`}
    >
      {(title || subtitle) && (
        <header className="mb-5 border-b border-slate-100 pb-4">
          {title && (
            <h2 className="text-lg font-bold text-[#0E2250]">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
