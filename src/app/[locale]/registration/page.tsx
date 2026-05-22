import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ContactForm from "@/components/ContactForm";
import SectionTitle from "@/components/ui/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "registrationPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function RegistrationPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "registrationPage" });
  const isRtl = locale === "ar";
  const whatsappUrl = getWhatsAppUrl(locale);

  const steps = t.raw("process.steps") as Array<{
    step: string;
    title: string;
    description: string;
  }>;

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="py-20 text-center hero-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t("heroTitle")}</h1>
          <p className="text-[#EAF1FF] text-lg md:text-xl">{t("heroSubtitle")}</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 bg-[#FAFBFF]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#64748B] text-base leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionTitle title={t("process.title")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={i} className="card-hover bg-[#FAFBFF] rounded-2xl p-6 border border-[#E5E7EB] text-center flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: "#1D4395" }}
                >
                  {step.step}
                </div>
                <h3 className="font-bold text-[#1D4395] text-base">{step.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit section */}
      <section className="py-14 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-5">🏫</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t("visitSection.title")}
          </h2>
          <div className="h-1 w-16 bg-[#EEA748] mx-auto mb-6 rounded-full" />
          <p className="text-[#EAF1FF] text-base leading-relaxed max-w-2xl mx-auto mb-8">
            {t("visitSection.body")}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-white text-lg transition-colors"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="22" height="22" fill="white">
              <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.344.635 4.64 1.84 6.65L2.667 29.333l6.896-1.807A13.28 13.28 0 0016.003 29.333C23.363 29.333 29.333 23.36 29.333 16S23.363 2.667 16.003 2.667z" />
            </svg>
            {t("visitSection.whatsapp")}
          </a>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-[#FAFBFF]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0E2250] mb-2">
              {t("formTitle")}
            </h2>
            <p className="text-[#64748B] text-base">{t("formSubtitle")}</p>
            <div className="h-1 w-16 bg-[#EEA748] mx-auto mt-4 rounded-full" />
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
