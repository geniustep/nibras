"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admission/ui/Button";
import { Select } from "@/components/admission/ui/Select";

type Assignee = { id: string; name: string };

export function AdmissionAssigner({
  requestId,
  currentAssignedId,
  assignees,
  canAssign,
}: {
  requestId: string;
  currentAssignedId: string | null;
  assignees: Assignee[];
  canAssign: boolean;
}) {
  const router = useRouter();
  const [assignedToId, setAssignedToId] = useState(currentAssignedId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!canAssign) {
    return (
      <p className="text-sm text-slate-500">
        الإسناد متاح للمدير العام والإدارة فقط.
      </p>
    );
  }

  async function handleAssign() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/admin/admissions/${requestId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedToId: assignedToId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message ?? "تعذر الإسناد");
        return;
      }
      setMessage("تم تحديث الإسناد");
      router.refresh();
    } catch {
      setMessage("حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Select
          label="الموظف المسؤول"
          name="assignedToId"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
          options={[
            { value: "", label: "غير مسند" },
            ...assignees.map((a) => ({ value: a.id, label: a.name })),
          ]}
        />
      </div>
      <Button onClick={handleAssign} loading={loading} variant="secondary">
        حفظ الإسناد
      </Button>
      {message && <p className="text-sm text-slate-600 sm:basis-full">{message}</p>}
    </div>
  );
}
