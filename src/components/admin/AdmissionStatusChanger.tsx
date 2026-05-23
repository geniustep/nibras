"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdmissionRequestStatus } from "@prisma/client";
import { Button } from "@/components/admission/ui/Button";
import { Select } from "@/components/admission/ui/Select";
import { Textarea } from "@/components/admission/ui/Textarea";
import { ALL_ADMISSION_STATUSES, ADMISSION_STATUS_LABELS } from "@/lib/admission/admission-labels";

export function AdmissionStatusChanger({
  requestId,
  currentStatus,
  canEdit,
}: {
  requestId: string;
  currentStatus: AdmissionRequestStatus;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!canEdit) {
    return (
      <p className="text-sm text-slate-500">لا تملك صلاحية تغيير حالة هذا الطلب.</p>
    );
  }

  async function handleUpdate() {
    if (status === currentStatus && !note.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/admissions/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "تعذر التحديث");
        return;
      }
      setMessage("تم تحديث حالة الطلب");
      router.refresh();
    } catch {
      setMessage("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Select
        label="حالة الطلب الجديدة"
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value as AdmissionRequestStatus)}
        options={ALL_ADMISSION_STATUSES.map((s) => ({
          value: s,
          label: ADMISSION_STATUS_LABELS[s],
        }))}
      />
      <Textarea
        label="ملاحظة التغيير (اختياري)"
        name="note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="سبب تغيير الحالة..."
      />
      <Button onClick={handleUpdate} loading={loading}>
        تحديث حالة الطلب
      </Button>
      {message && <p className="text-sm text-slate-600">{message}</p>}
    </div>
  );
}
