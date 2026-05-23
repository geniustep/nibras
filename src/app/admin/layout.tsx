import { redirect } from "next/navigation";
import { getSession } from "@/lib/admission/auth";
import { AdminSidebar } from "@/components/admission/layout/AdminSidebar";
import { BrandLogo } from "@/components/admission/layout/BrandLogo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Login page renders without sidebar (handled by checking path in child)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row-reverse">
      <AdminSidebar userName={session.name} />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <BrandLogo href="/admin" height={36} />
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-[#1D4395] underline"
            >
              خروج
            </button>
          </form>
        </header>
        <main className="flex-1 bg-[#F5F8FF] p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
