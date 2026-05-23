import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "تم استلام طلبكم",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const trackingNumber = ref ?? "—";

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1D4395]/10 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#0E2250]">
        تم استلام طلبكم بنجاح
      </h1>
      <p className="mt-4 text-slate-600">
        شكرًا لثقتكم. سيقوم فريق القبول والتسجيل بمراجعة طلبكم والتواصل
        معكم في أقرب وقت ممكن.
      </p>

      <div className="mt-8 rounded-2xl border-2 border-dashed border-[#EEA748]/50 bg-white p-6">
        <p className="text-sm text-slate-500">رقم تتبع الطلب</p>
        <p className="mt-2 font-mono text-2xl font-bold tracking-wide text-[#1D4395]">
          {trackingNumber}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          يرجى الاحتفاظ بهذا الرقم عند أي تواصل مع المؤسسة.
        </p>
      </div>

      <div className="mt-10">
        <Link href="/">
          <Button variant="outline">العودة إلى الصفحة الرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}
