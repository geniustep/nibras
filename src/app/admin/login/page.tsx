"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/admission/ui/Button";
import { Input } from "@/components/admission/ui/Input";
import { Card } from "@/components/admission/ui/Card";
import { BrandLogo } from "@/components/admission/layout/BrandLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "تعذر تسجيل الدخول");
        return;
      }

      const from = searchParams.get("from") ?? "/admin/admissions";
      router.push(from);
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex justify-center">
            <BrandLogo href={null} priority height={56} />
          </div>
          <h1 className="mt-6 text-xl font-bold text-[#0E2250]">
            دخول لوحة الإدارة
          </h1>
          <p className="mt-2 text-sm text-slate-600">مدارس النبراس — بوابة التسجيل الأولي</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <Input
              name="email"
              label="البريد الإلكتروني"
              type="email"
              required
              autoComplete="email"
            />
            <Input
              name="password"
              label="كلمة المرور"
              type="password"
              required
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} fullWidth>
              تسجيل الدخول
            </Button>
          </form>
        </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F8FF] p-4">
      <Suspense fallback={<p className="text-slate-600">جاري التحميل...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
