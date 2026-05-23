import Link from "next/link";
import { Button } from "@/components/admission/ui/Button";

export const metadata = {
  title: "بوابة التسجيل الأولي",
};

export default function AdmissionIntroPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F8FF] to-[#FAFBFF]">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-l from-[#EEA748] via-[#1D4395] to-[#0E2250]" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full border border-[#EEA748]/40 bg-white px-4 py-1 text-xs font-semibold text-[#1D4395]">
              مدارس النبراس — التسجيل الأولي
            </span>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-[#0E2250] sm:text-4xl lg:text-5xl">
              بوابة التسجيل الأولي
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              مرحبًا بكم. هذه المنصة مخصّصة لتقديم طلب التسجيل الأولي
              لتلميذكم، بخطوات بسيطة وواضحة. سيتواصل معكم فريقنا لاستكمال
              الإجراءات بكل عناية.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/admission">
                <Button variant="primary">بدء التسجيل الأولي</Button>
              </Link>
              <a href="#ma3lomat">
                <Button variant="outline">معلومات مفيدة</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="ma3lomat" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold text-[#0E2250]">كيف تعمل المنصة؟</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              step: "١",
              title: "تعبئة الاستمارة",
              text: "أدخلوا معلومات التلميذ وولي الأمر والمستوى المطلوب.",
            },
            {
              step: "٢",
              title: "استلام رقم التتبع",
              text: "بعد الإرسال، يظهر رقم طلبكم للاحتفاظ به.",
            },
            {
              step: "٣",
              title: "متابعة من الفريق",
              text: "يتواصل معكم فريق القبول لاستكمال الخطوات.",
            },
          ].map((item) => (
            <article
              key={item.step}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D4395] text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 font-bold text-[#0E2250]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#0E2250] py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-lg font-medium">
            نرافقكم بكل احترام في رحلة انضمام تلميذكم إلى مدارس النبراس.
          </p>
          <Link href="/admission" className="mt-6 inline-block">
            <Button variant="gold">تقديم طلب الآن</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
