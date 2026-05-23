"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admission/ui/Button";
import { Input } from "@/components/admission/ui/Input";
import { Select } from "@/components/admission/ui/Select";
import { Textarea } from "@/components/admission/ui/Textarea";
import { formatDateTime } from "@/lib/admission/format";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
} from "@/lib/admission/appointment-labels";

type Appointment = {
  id: string;
  scheduledAt: string;
  type: keyof typeof APPOINTMENT_TYPE_LABELS;
  status: keyof typeof APPOINTMENT_STATUS_LABELS;
  note: string | null;
  createdBy: { name: string };
};

export function AdmissionAppointmentsPanel({
  requestId,
  initialAppointments,
  canManage,
  requestStatus,
}: {
  requestId: string;
  initialAppointments: Appointment[];
  canManage: boolean;
  requestStatus: string;
}) {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [scheduledAt, setScheduledAt] = useState("");
  const [type, setType] = useState("VISIT");
  const [note, setNote] = useState("");
  const [autoSetStatus, setAutoSetStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const terminal = ["FINAL_REGISTERED", "CANCELLED"].includes(requestStatus);

  async function handleCreate() {
    if (!scheduledAt) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/admissions/${requestId}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt,
          type,
          note: note || undefined,
          autoSetStatus: terminal ? false : autoSetStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "تعذر تحديد الموعد");
        return;
      }
      setScheduledAt("");
      setNote("");
      router.refresh();
    } catch {
      setError("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(appointmentId: string, status: string) {
    await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {canManage && (
        <div className="rounded-xl border border-slate-100 bg-[#FAFBFF] p-4 space-y-4">
          <h4 className="font-semibold text-[#0E2250]">تحديد موعد جديد</h4>
          <Input
            label="التاريخ والوقت"
            type="datetime-local"
            name="scheduledAt"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
          <Select
            label="نوع الموعد"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={Object.entries(APPOINTMENT_TYPE_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
          <Textarea
            label="ملاحظة (اختياري)"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {!terminal && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoSetStatus}
                onChange={(e) => setAutoSetStatus(e.target.checked)}
              />
              تحديث حالة الطلب إلى «موعد محدد» تلقائيًا
            </label>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={handleCreate} loading={loading}>
            حفظ الموعد
          </Button>
        </div>
      )}

      <ul className="space-y-3">
        {appointments.length === 0 && (
          <li className="text-sm text-slate-500">لا توجد مواعيد.</li>
        )}
        {appointments.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 p-4"
          >
            <div>
              <p className="font-medium text-[#0E2250]">
                {APPOINTMENT_TYPE_LABELS[a.type]} — {formatDateTime(a.scheduledAt)}
              </p>
              <p className="text-xs text-slate-500">
                {APPOINTMENT_STATUS_LABELS[a.status]} · {a.createdBy.name}
              </p>
              {a.note && <p className="mt-1 text-sm text-slate-600">{a.note}</p>}
            </div>
            {canManage && a.status === "SCHEDULED" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => updateStatus(a.id, "DONE")}
                >
                  تم
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => updateStatus(a.id, "CANCELLED")}
                >
                  إلغاء
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
