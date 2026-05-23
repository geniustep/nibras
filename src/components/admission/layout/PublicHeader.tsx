import Link from "next/link";
import { BrandLogo } from "@/components/admission/layout/BrandLogo";

export function PublicHeader() {
  return (
    <header className="border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <BrandLogo priority height={48} />
          <p className="hidden text-xs text-slate-500 sm:block">بوابة التسجيل الأولي</p>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/tassjil"
            className="rounded-xl bg-[#1D4395] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0E2250]"
          >
            تسجيل أولي
          </Link>
        </nav>
      </div>
    </header>
  );
}
