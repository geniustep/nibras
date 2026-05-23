import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/admission/ui/Button";
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admissionPortal.success" });
  return { title: t("meta.title") };
}

export default async function AdmissionSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { ref } = await searchParams;
  const t = await getTranslations({ locale, namespace: "admissionPortal.success" });
  const trackingNumber = ref ?? "—";

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1D4395]/10 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#0E2250]">{t("title")}</h1>
      <p className="mt-4 text-slate-600">{t("body")}</p>

      <div className="mt-8 rounded-2xl border-2 border-dashed border-[#EEA748]/50 bg-white p-6">
        <p className="text-sm text-slate-500">{t("trackingLabel")}</p>
        <p className="mt-2 font-mono text-2xl font-bold tracking-wide text-[#1D4395]">
          {trackingNumber}
        </p>
        <p className="mt-3 text-xs text-slate-500">{t("trackingHint")}</p>
      </div>

      <div className="mt-10">
        <Link href={`/${locale}`}>
          <Button variant="outline">{t("backHome")}</Button>
        </Link>
      </div>
    </div>
  );
}
