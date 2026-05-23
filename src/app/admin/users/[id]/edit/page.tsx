import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/admission/prisma";
import { requireUserManager } from "@/lib/admission/admin-auth";
import { UserForm } from "@/components/admin/UserForm";

export const metadata = { title: "تعديل المستخدم" };

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireUserManager();
  if (auth.error === "UNAUTHORIZED") redirect("/admin/login");
  if (auth.error === "FORBIDDEN") redirect("/admin/applications");

  const { id } = await params;

  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="text-sm text-[#1D4395] hover:underline"
      >
        ← العودة إلى المستخدمين
      </Link>
      <UserForm
        mode="edit"
        userId={user.id}
        initial={{
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          role: user.role,
          status: user.status,
        }}
      />
    </div>
  );
}
