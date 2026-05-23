"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole, UserStatus } from "@prisma/client";
import { Button } from "@/components/admission/ui/Button";
import { Input } from "@/components/admission/ui/Input";
import { Select } from "@/components/admission/ui/Select";
import { Card } from "@/components/admission/ui/Card";
import { ROLE_LABELS, USER_STATUS_LABELS } from "@/lib/admission/user-labels";

type UserFormData = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
};

type FormErrors = Record<string, string>;

export function UserForm({
  mode,
  userId,
  initial,
}: {
  mode: "create" | "edit";
  userId?: string;
  initial?: UserFormData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [password, setPassword] = useState("");

  const [form, setForm] = useState<UserFormData>(
    initial ?? {
      name: "",
      email: "",
      phone: "",
      role: "ADMISSION_STAFF",
      status: "PENDING",
    }
  );

  function updateField<K extends keyof UserFormData>(key: K, value: UserFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      ...form,
      phone: form.phone || "",
      ...(mode === "create" || password ? { password } : {}),
    };

    try {
      const url =
        mode === "create" ? "/api/admin/users" : `/api/admin/users/${userId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else setErrors({ form: data.message ?? "تعذر حفظ المستخدم" });
        return;
      }

      router.push("/admin/users");
      router.refresh();
    } catch {
      setErrors({ form: "تعذر الاتصال بالخادم" });
    } finally {
      setLoading(false);
    }
  }

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = Object.entries(USER_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6">
      {errors.form && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.form}
        </div>
      )}

      <Card title={mode === "create" ? "مستخدم جديد" : "تعديل المستخدم"}>
        <div className="space-y-5">
          <Input
            name="name"
            label="الاسم الكامل"
            required
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
          />
          <Input
            name="email"
            label="البريد الإلكتروني"
            type="email"
            required
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
          />
          <Input
            name="phone"
            label="الهاتف (اختياري)"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
          />

          <Select
            name="role"
            label="الدور"
            required
            value={form.role}
            onChange={(e) => updateField("role", e.target.value as UserRole)}
            error={errors.role}
            options={roleOptions}
          />

          <Select
            name="status"
            label="حالة الحساب"
            required
            value={form.status}
            onChange={(e) => updateField("status", e.target.value as UserStatus)}
            error={errors.status}
            options={statusOptions}
          />

          <Input
            name="password"
            label={
              mode === "create"
                ? "كلمة المرور"
                : "كلمة المرور الجديدة (اتركها فارغة للإبقاء على الحالية)"
            }
            type="password"
            required={mode === "create"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        <Button type="submit" loading={loading} fullWidth>
          {mode === "create" ? "إنشاء المستخدم" : "حفظ التعديلات"}
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => router.push("/admin/users")}
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
