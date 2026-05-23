import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireAuthAdmin } from "@/lib/admission/admin-session";
import {
  canEditAdmissionRecord,
  canStaffViewRequest,
} from "@/lib/admission/admission-permissions";
import {
  AdminAdmissionForm,
  toFormDateValue,
} from "@/components/admin/AdminAdmissionForm";
import { prisma } from "@/lib/admission/prisma";

export const metadata = { title: "تعديل الطلب" };

export default async function EditAdmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuthAdmin();
  if ("error" in auth) redirect("/admin/login");
  if (!canEditAdmissionRecord(auth.user)) redirect("/admin/admissions");

  const { id } = await params;
  const item = await prisma.admissionRequest.findUnique({ where: { id } });
  if (!item) notFound();
  if (!canStaffViewRequest(auth.user, item.assignedToId)) redirect("/admin/admissions");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href={`/admin/admissions/${id}`}
        className="text-sm text-[#1D4395] hover:underline"
      >
        ← العودة إلى الطلب
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-[#0E2250]">تعديل الطلب</h1>
        <p className="mt-1 font-mono text-sm text-[#1D4395]">{item.trackingNumber}</p>
      </header>
      <AdminAdmissionForm
        mode="edit"
        requestId={id}
        cancelHref={`/admin/admissions/${id}`}
        initialValues={{
          studentFirstName: item.studentFirstName,
          studentLastName: item.studentLastName,
          studentDateOfBirth: toFormDateValue(item.studentDateOfBirth),
          studentGender: item.studentGender,
          studentNationalId: item.studentNationalId ?? "",
          currentSchool: item.currentSchool ?? "",
          parentFullName: item.parentFullName,
          parentPhone: item.parentPhone,
          parentEmail: item.parentEmail ?? "",
          parentAddress: item.parentAddress ?? "",
          schoolCycle: item.schoolCycle,
          schoolLevel: item.schoolLevel,
          commonCoreTrack: item.commonCoreTrack ?? "",
          needsTransport: item.needsTransport,
          transportNotes: item.transportNotes ?? "",
          needsCanteen: item.needsCanteen,
        }}
      />
    </div>
  );
}
