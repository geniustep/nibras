import { RegistrationForm } from "@/components/forms/RegistrationForm";

export const metadata = {
  title: "التسجيل الأولي",
};

export default function RegistrationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#0E2250] sm:text-3xl">
          استمارة التسجيل الأولي
        </h1>
        <p className="mt-3 text-slate-600">
          يرجى تعبئة الحقول بدقة. الحقول المميّزة بعلامة (*) إلزامية.
        </p>
      </header>
      <RegistrationForm />
    </div>
  );
}
