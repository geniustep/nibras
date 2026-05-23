import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/admission/prisma";
import { requireAuthAdmin } from "@/lib/admission/admin-session";
import {
  canDeleteAdmission,
  canEditAdmissionRecord,
} from "@/lib/admission/admission-permissions";
import { AdmissionDeleteButton } from "@/components/admin/AdmissionDeleteButton";
import { listAdmissionRequests } from "@/lib/admission/admissions/queries";
import type { AdmissionListFilters } from "@/lib/admission/admissions/service";
import { AdmissionStatusBadge } from "@/components/admission/ui/AdmissionStatusBadge";
import {
  CYCLE_LABELS,
  LEVEL_LABELS,
  TRACK_LABELS,
  formatSchoolSelectionShort,
} from "@/lib/admission/school-levels";
import { ADMISSION_STATUS_LABELS, ALL_ADMISSION_STATUSES } from "@/lib/admission/admission-labels";
import { formatDate, formatDateTime } from "@/lib/admission/format";
import type {
  AdmissionRequestStatus,
  SchoolCycle,
  SchoolLevel,
  CommonCoreTrack,
} from "@prisma/client";
import { APPOINTMENT_TYPE_LABELS } from "@/lib/admission/appointment-labels";

export const metadata = { title: "طلبات التسجيل" };

function yesNo(value: boolean) {
  return value ? "نعم" : "لا";
}

export default async function AdmissionsListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const auth = await requireAuthAdmin();
  if ("error" in auth) redirect("/admin/login");

  const sp = await searchParams;
  const filters: AdmissionListFilters = {
    q: sp.q,
    status: sp.status as AdmissionRequestStatus | undefined,
    schoolCycle: sp.schoolCycle as SchoolCycle | undefined,
    schoolLevel: sp.schoolLevel as SchoolLevel | undefined,
    commonCoreTrack: sp.commonCoreTrack as CommonCoreTrack | undefined,
    assignedToId: sp.assignedToId,
    needsTransport: sp.needsTransport,
    needsCanteen: sp.needsCanteen,
    dateFrom: sp.dateFrom,
    dateTo: sp.dateTo,
  };
  const sort = sp.sort ?? "newest";

  const [items, assignees, stats] = await Promise.all([
    listAdmissionRequests(auth.user, filters, sort),
    prisma.adminUser.findMany({
      where: { status: "ACTIVE", role: { in: ["ADMIN", "ADMISSION_STAFF"] } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.admissionRequest.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const total = stats.reduce((a, s) => a + s._count, 0);
  const newCount = stats.find((s) => s.status === "NEW")?._count ?? 0;
  const canEdit = canEditAdmissionRecord(auth.user);
  const canDelete = canDeleteAdmission(auth.user);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0E2250]">طلبات التسجيل</h1>
          <p className="mt-1 text-sm text-slate-600">
            إجمالي الطلبات: {total} — جديدة: {newCount}
          </p>
        </div>
        {canEdit && (
          <Link
            href="/admin/admissions/new"
            className="inline-flex items-center rounded-xl bg-[#1D4395] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0E2250]"
          >
            + تسجيل تلميذ جديد
          </Link>
        )}
      </header>

      <form className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="بحث: اسم، رقم الطلب، هاتف..."
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm lg:col-span-2"
          />
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="">كل حالات الطلب</option>
            {ALL_ADMISSION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ADMISSION_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="newest">الأحدث أولًا</option>
            <option value="oldest">الأقدم أولًا</option>
            <option value="updated">آخر تحديث</option>
            <option value="status">حالة الطلب</option>
            <option value="level">المستوى الدراسي</option>
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select name="schoolCycle" defaultValue={sp.schoolCycle ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">كل الأسلاك</option>
            {Object.entries(CYCLE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select name="schoolLevel" defaultValue={sp.schoolLevel ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">كل المستويات</option>
            {Object.entries(LEVEL_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select name="commonCoreTrack" defaultValue={sp.commonCoreTrack ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">كل الشعب</option>
            {Object.entries(TRACK_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select name="assignedToId" defaultValue={sp.assignedToId ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">كل الموظفين</option>
            <option value="unassigned">غير مسند</option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input type="date" name="dateFrom" defaultValue={sp.dateFrom ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <input type="date" name="dateTo" defaultValue={sp.dateTo ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <select name="needsTransport" defaultValue={sp.needsTransport ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">النقل: الكل</option>
            <option value="true">نقل: نعم</option>
            <option value="false">نقل: لا</option>
          </select>
          <select name="needsCanteen" defaultValue={sp.needsCanteen ?? ""} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">المطعم: الكل</option>
            <option value="true">مطعم: نعم</option>
            <option value="false">مطعم: لا</option>
          </select>
        </div>
        <button type="submit" className="rounded-xl bg-[#1D4395] px-6 py-2.5 text-sm font-semibold text-white">
          تطبيق الفلاتر
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-[#F5F8FF] text-[#0E2250]">
              <tr>
                <th className="px-3 py-3 text-right font-semibold">رقم الطلب</th>
                <th className="px-3 py-3 text-right font-semibold">التلميذ</th>
                <th className="px-3 py-3 text-right font-semibold">ولي الأمر</th>
                <th className="px-3 py-3 text-right font-semibold">الهاتف</th>
                <th className="px-3 py-3 text-right font-semibold">السلك</th>
                <th className="px-3 py-3 text-right font-semibold">المستوى</th>
                <th className="px-3 py-3 text-right font-semibold">الشعبة</th>
                <th className="px-3 py-3 text-right font-semibold">نقل</th>
                <th className="px-3 py-3 text-right font-semibold">مطعم</th>
                <th className="px-3 py-3 text-right font-semibold">حالة الطلب</th>
                <th className="px-3 py-3 text-right font-semibold">المسؤول</th>
                <th className="px-3 py-3 text-right font-semibold">إرسال</th>
                <th className="px-3 py-3 text-right font-semibold">تحديث</th>
                <th className="px-3 py-3 text-right font-semibold">موعد</th>
                <th className="px-3 py-3 text-right font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={15} className="px-4 py-10 text-center text-slate-500">
                    لا توجد طلبات مطابقة.
                  </td>
                </tr>
              )}
              {items.map((app) => {
                const nextAppt = app.appointments[0];
                return (
                  <tr key={app.id} className="border-t border-slate-50 hover:bg-[#FAFBFF]">
                    <td className="px-3 py-3 font-mono text-xs font-semibold text-[#1D4395]">
                      {app.trackingNumber}
                    </td>
                    <td className="px-3 py-3">
                      {app.studentFirstName} {app.studentLastName}
                    </td>
                    <td className="px-3 py-3">{app.parentFullName}</td>
                    <td className="px-3 py-3 text-xs">{app.parentPhone}</td>
                    <td className="px-3 py-3 text-xs">{CYCLE_LABELS[app.schoolCycle]}</td>
                    <td className="px-3 py-3 text-xs max-w-[140px]">
                      {formatSchoolSelectionShort(app.schoolLevel, app.commonCoreTrack)}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {app.commonCoreTrack ? TRACK_LABELS[app.commonCoreTrack] : "—"}
                    </td>
                    <td className="px-3 py-3">{yesNo(app.needsTransport)}</td>
                    <td className="px-3 py-3">{yesNo(app.needsCanteen)}</td>
                    <td className="px-3 py-3">
                      <AdmissionStatusBadge status={app.status} />
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {app.assignedTo?.name ?? "غير مسند"}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {formatDateTime(app.updatedAt)}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600">
                      {nextAppt
                        ? `${APPOINTMENT_TYPE_LABELS[nextAppt.type]} · ${formatDateTime(nextAppt.scheduledAt)}`
                        : "—"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/admissions/${app.id}`}
                          className="text-sm font-semibold text-[#1D4395] hover:underline"
                        >
                          عرض
                        </Link>
                        {canEdit && (
                          <Link
                            href={`/admin/admissions/${app.id}/edit`}
                            className="text-sm font-semibold text-slate-700 hover:underline"
                          >
                            تعديل
                          </Link>
                        )}
                        {canDelete && (
                          <AdmissionDeleteButton
                            id={app.id}
                            trackingNumber={app.trackingNumber}
                            className="!px-2.5 !py-1 text-xs"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
