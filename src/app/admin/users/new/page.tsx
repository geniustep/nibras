import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUserManager } from "@/lib/admission/admin-auth";
import { UserForm } from "@/components/admin/UserForm";

export const metadata = { title: "مستخدم جديد" };

export default async function NewUserPage() {
  const auth = await requireUserManager();
  if (auth.error === "UNAUTHORIZED") redirect("/admin/login");
  if (auth.error === "FORBIDDEN") redirect("/admin/applications");

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="text-sm text-[#1D4395] hover:underline"
      >
        ← العودة إلى المستخدمين
      </Link>
      <UserForm mode="create" />
    </div>
  );
}
