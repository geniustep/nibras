import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/admission/prisma";
import { requireAuthAdmin } from "@/lib/admission/admin-session";
import { getAdmissionDetail } from "@/lib/admission/admissions/queries";
import {
  canStaffViewRequest,
  canAssignRequest,
  canModifyRequest,
  canEditAdmissionRecord,
  canDeleteAdmission,
} from "@/lib/admission/admission-permissions";
import { AdmissionDeleteButton } from "@/components/admin/AdmissionDeleteButton";
import { Card } from "@/components/admission/ui/Card";
import { AdmissionStatusBadge } from "@/components/admission/ui/AdmissionStatusBadge";
import { AdmissionStatusChanger } from "@/components/admin/AdmissionStatusChanger";
import { AdmissionAssigner } from "@/components/admin/AdmissionAssigner";
import { AdmissionNotesPanel } from "@/components/admin/AdmissionNotesPanel";
import { AdmissionAppointmentsPanel } from "@/components/admin/AdmissionAppointmentsPanel";
import { AdmissionParentMessage } from "@/components/admin/AdmissionParentMessage";
import {
  CYCLE_LABELS,
  LEVEL_LABELS,
  TRACK_LABELS,
  formatSchoolSelectionShort,
} from "@/lib/admission/school-levels";
import { GENDER_LABELS } from "@/lib/admission/labels";
import { ADMISSION_STATUS_LABELS } from "@/lib/admission/admission-labels";
import { ACTIVITY_LABELS } from "@/lib/admission/activity-log";
import { formatDate, formatDateTime } from "@/lib/admission/format";

export const metadata = { title: "تفاصيل الطلب" };

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
      <dt className="w-40 shrink-0 text-slate-500">{label}</dt>
      <dd className="text-[#0E2250]">{value}</dd>
    </div>
  );
}

export default async function AdmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireAuthAdmin();
  if ("error" in auth) redirect("/admin/login");

  const { id } = await params;
  const item = await getAdmissionDetail(id);
  if (!item) notFound();
  if (!canStaffViewRequest(auth.user, item.assignedToId)) redirect("/admin/admissions");

  const assignees = await prisma.adminUser.findMany({
    where: { status: "ACTIVE", role: { in: ["ADMIN", "ADMISSION_STAFF"] } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const canEditPanels = canModifyRequest(auth.user, item.assignedToId);
  const canEditRecord = canEditAdmissionRecord(auth.user);
  const canDelete = canDeleteAdmission(auth.user);
  const canAssign = canAssignRequest(auth.user);

  const notes = item.notes.map((n) => ({
    id: n.id,
    content: n.content,
    createdAt: n.createdAt.toISOString(),
    author: n.author,
    visibility: n.visibility,
  }));

  const appointments = item.appointments.map((a) => ({
    id: a.id,
    scheduledAt: a.scheduledAt.toISOString(),
    type: a.type,
    status: a.status,
    note: a.note,
    createdBy: a.createdBy,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/admissions" className="text-sm text-[#1D4395] hover:underline">
          ← العودة إلى القائمة
        </Link>
        <div className="flex flex-wrap gap-2">
          {canEditRecord && (
            <Link
              href={`/admin/admissions/${id}/edit`}
              className="inline-flex rounded-xl border-2 border-[#1D4395] px-4 py-2 text-sm font-semibold text-[#1D4395] hover:bg-[#F5F8FF]"
            >
              تعديل البيانات
            </Link>
          )}
          {canDelete && (
            <AdmissionDeleteButton id={id} trackingNumber={item.trackingNumber} />
          )}
        </div>
      </div>

      <Card className="border-[#EEA748]/30 bg-gradient-to-l from-[#F5F8FF] to-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">رقم الطلب</p>
            <h1 className="font-mono text-xl font-bold text-[#0E2250]">
              {item.trackingNumber}
            </h1>
            <p className="mt-2 text-sm">
              {item.studentFirstName} {item.studentLastName} —{" "}
              {formatSchoolSelectionShort(item.schoolLevel, item.commonCoreTrack)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              أُرسل {formatDate(item.createdAt)} · آخر تحديث {formatDateTime(item.updatedAt)}
            </p>
            <p className="mt-2 text-sm">
              المسؤول: {item.assignedTo?.name ?? "غير مسند"}
            </p>
          </div>
          <AdmissionStatusBadge status={item.status} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="معالجة الملف">
          <div className="space-y-8">
            <section>
              <h3 className="mb-3 text-sm font-bold text-[#0E2250]">تغيير حالة الطلب</h3>
              <AdmissionStatusChanger
                requestId={item.id}
                currentStatus={item.status}
                canEdit={canEditPanels}
              />
            </section>
            <section>
              <h3 className="mb-3 text-sm font-bold text-[#0E2250]">إسناد الطلب</h3>
              <AdmissionAssigner
                requestId={item.id}
                currentAssignedId={item.assignedToId}
                assignees={assignees}
                canAssign={canAssign}
              />
            </section>
            <section>
              <h3 className="mb-3 text-sm font-bold text-[#0E2250]">رسالة لولي الأمر</h3>
              <AdmissionParentMessage
                requestId={item.id}
                initialMessage={item.parentMessage ?? ""}
                canEdit={canEditPanels}
              />
            </section>
          </div>
        </Card>

        <Card title="معلومات التلميذ">
          <dl className="space-y-3 text-sm">
            <DetailRow
              label="الاسم"
              value={`${item.studentFirstName} ${item.studentLastName}`}
            />
            <DetailRow label="تاريخ الازدياد" value={formatDate(item.studentDateOfBirth)} />
            <DetailRow label="الجنس" value={GENDER_LABELS[item.studentGender]} />
            <DetailRow label="السلك" value={CYCLE_LABELS[item.schoolCycle]} />
            <DetailRow
              label="المستوى"
              value={formatSchoolSelectionShort(item.schoolLevel, item.commonCoreTrack)}
            />
            {item.commonCoreTrack && (
              <DetailRow label="الشعبة" value={TRACK_LABELS[item.commonCoreTrack]} />
            )}
            {item.currentSchool && (
              <DetailRow label="المؤسسة السابقة" value={item.currentSchool} />
            )}
            {item.studentNotes && (
              <DetailRow label="ملاحظات خاصة" value={item.studentNotes} />
            )}
          </dl>
        </Card>

        <Card title="معلومات ولي الأمر">
          <dl className="space-y-3 text-sm">
            <DetailRow label="الاسم" value={item.parentFullName} />
            <DetailRow label="الهاتف" value={item.parentPhone} />
            {item.parentWhatsapp && (
              <DetailRow label="واتساب" value={item.parentWhatsapp} />
            )}
            {item.parentEmail && <DetailRow label="البريد" value={item.parentEmail} />}
            {item.parentAddress && (
              <DetailRow label="العنوان" value={item.parentAddress} />
            )}
          </dl>
        </Card>

        <Card title="الخدمات المطلوبة">
          <dl className="space-y-3 text-sm">
            <DetailRow label="النقل المدرسي" value={item.needsTransport ? "نعم" : "لا"} />
            {item.transportNotes && (
              <DetailRow label="ملاحظات النقل" value={item.transportNotes} />
            )}
            <DetailRow label="المطعم المدرسي" value={item.needsCanteen ? "نعم" : "لا"} />
          </dl>
        </Card>
      </div>

      <Card title="المواعيد">
        <AdmissionAppointmentsPanel
          requestId={item.id}
          initialAppointments={appointments}
          canManage={canEditPanels}
          requestStatus={item.status}
        />
      </Card>

      <Card title="ملاحظات داخلية">
        <AdmissionNotesPanel
          requestId={item.id}
          initialNotes={notes}
          canAdd={canEditPanels}
        />
      </Card>

      <Card title="سجل تغييرات حالة الطلب">
        <ul className="space-y-3">
          {item.statusHistory.length === 0 && (
            <li className="text-sm text-slate-500">لا يوجد سجل بعد.</li>
          )}
          {item.statusHistory.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-slate-100 bg-[#FAFBFF] px-4 py-3 text-sm"
            >
              {entry.oldStatus ? (
                <>
                  <span className="text-slate-500">
                    {ADMISSION_STATUS_LABELS[entry.oldStatus]}
                  </span>
                  <span className="mx-2">←</span>
                </>
              ) : (
                <span className="text-slate-500">إنشاء الطلب → </span>
              )}
              <span className="font-semibold text-[#1D4395]">
                {ADMISSION_STATUS_LABELS[entry.newStatus]}
              </span>
              {entry.note && (
                <p className="mt-1 text-slate-600">{entry.note}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                {formatDateTime(entry.createdAt)}
                {entry.changedBy ? ` — ${entry.changedBy.name}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="سجل النشاط">
        <ul className="space-y-2">
          {item.activityLogs.length === 0 && (
            <li className="text-sm text-slate-500">لا يوجد نشاط مسجّل.</li>
          )}
          {item.activityLogs.map((log) => (
            <li
              key={log.id}
              className="flex flex-wrap justify-between gap-2 border-b border-slate-50 py-2 text-sm"
            >
              <span className="text-[#0E2250]">
                {ACTIVITY_LABELS[log.action] ?? log.action} — {log.description}
              </span>
              <span className="text-xs text-slate-500">
                {log.user.name} · {formatDateTime(log.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
