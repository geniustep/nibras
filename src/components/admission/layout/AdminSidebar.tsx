import Link from "next/link";
import { BrandLogo } from "@/components/admission/layout/BrandLogo";

const links = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/admissions", label: "طلبات التسجيل" },
  { href: "/admin/users", label: "المستخدمون" },
];

export function AdminSidebar({ userName }: { userName: string }) {
  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-[#0E2250] text-white lg:w-64 lg:border-b-0 lg:border-l">
      <div className="p-5">
        <div className="mb-3 rounded-xl bg-white/95 px-2 py-2">
          <BrandLogo href="/admin" height={40} />
        </div>
        <p className="text-xs text-slate-300">لوحة الإدارة</p>
        <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm">{userName}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition hover:bg-white/10 lg:w-full"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action="/api/admin/logout" method="POST" className="hidden px-3 pb-6 lg:block">
        <button
          type="submit"
          className="w-full rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          تسجيل الخروج
        </button>
      </form>
    </aside>
  );
}
