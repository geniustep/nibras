import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/admission/prisma";
import { requireUserManager } from "@/lib/admission/admin-auth";
import { UserRoleBadge, UserAccountStatusBadge } from "@/components/admission/ui/UserBadges";
import { formatDate } from "@/lib/admission/format";

export const metadata = { title: "المستخدمون" };

export default async function UsersListPage() {
  const auth = await requireUserManager();
  if (auth.error === "UNAUTHORIZED") redirect("/admin/login");
  if (auth.error === "FORBIDDEN") redirect("/admin/admissions");

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0E2250]">المستخدمون</h1>
          <p className="mt-1 text-sm text-slate-600">
            إدارة حسابات الطاقم الإداري
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center justify-center rounded-xl bg-[#1D4395] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0E2250]"
        >
          مستخدم جديد
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-[#F5F8FF] text-[#0E2250]">
              <tr>
                <th className="px-4 py-3 text-right font-semibold">الاسم الكامل</th>
                <th className="px-4 py-3 text-right font-semibold">البريد الإلكتروني</th>
                <th className="px-4 py-3 text-right font-semibold">الهاتف</th>
                <th className="px-4 py-3 text-right font-semibold">الدور</th>
                <th className="px-4 py-3 text-right font-semibold">حالة الحساب</th>
                <th className="px-4 py-3 text-right font-semibold">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-right font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    لا يوجد مستخدمون بعد.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-50 transition hover:bg-[#FAFBFF]"
                >
                  <td className="px-4 py-3 font-medium text-[#0E2250]">
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {user.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <UserAccountStatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="font-semibold text-[#1D4395] hover:underline"
                    >
                      تعديل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
