import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuthAdmin } from "@/lib/admission/admin-session";
import { canEditAdmissionRecord } from "@/lib/admission/admission-permissions";
import { AdminAdmissionForm } from "@/components/admin/AdminAdmissionForm";

export const metadata = { title: "تسجيل تلميذ جديد" };

export default async function NewAdmissionPage() {
  const auth = await requireAuthAdmin();
  if ("error" in auth) redirect("/admin/login");
  if (!canEditAdmissionRecord(auth.user)) redirect("/admin/admissions");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/admin/admissions" className="text-sm text-[#1D4395] hover:underline">
        ← العودة إلى القائمة
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-[#0E2250]">تسجيل تلميذ جديد</h1>
        <p className="mt-1 text-sm text-slate-600">
          إدخال طلب تسجيل أولي نيابة عن ولي الأمر.
        </p>
      </header>
      <AdminAdmissionForm mode="create" />
    </div>
  );
}
