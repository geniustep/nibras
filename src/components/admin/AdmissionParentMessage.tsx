"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admission/ui/Button";
import { Textarea } from "@/components/admission/ui/Textarea";

export function AdmissionParentMessage({
  requestId,
  initialMessage,
  canEdit,
}: {
  requestId: string;
  initialMessage: string;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [parentMessage, setParentMessage] = useState(initialMessage);
  const [loading, setLoading] = useState(false);

  if (!canEdit) {
    return initialMessage ? (
      <p className="text-sm text-[#0E2250]">{initialMessage}</p>
    ) : (
      <p className="text-sm text-slate-500">لا توجد رسالة موجهة لولي الأمر.</p>
    );
  }

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/admin/admissions/${requestId}/parent-message`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentMessage }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <Textarea
        label="رسالة موجهة لولي الأمر (اختياري)"
        name="parentMessage"
        value={parentMessage}
        onChange={(e) => setParentMessage(e.target.value)}
        hint="ستُعرض لاحقًا في صفحة التتبع عند تفعيلها — حاليًا للتحضير فقط"
      />
      <Button onClick={handleSave} loading={loading} variant="outline">
        حفظ الرسالة
      </Button>
    </div>
  );
}
