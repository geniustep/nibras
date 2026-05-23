"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/admission/ui/Button";

type Props = {
  id: string;
  trackingNumber: string;
  redirectTo?: string;
  className?: string;
};

export function AdmissionDeleteButton({
  id,
  trackingNumber,
  redirectTo = "/admin/admissions",
  className = "",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الطلب ${trackingNumber}؟\nلا يمكن التراجع عن هذا الإجراء.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/admissions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.message ?? "تعذر حذف الطلب.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      window.alert("تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      loading={loading}
      onClick={handleDelete}
      className={`border-red-300 text-red-700 hover:bg-red-50 ${className}`}
    >
      حذف
    </Button>
  );
}
