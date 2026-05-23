import type { Metadata } from "next";
import { Noto_Kufi_Arabic, Noto_Sans_Arabic, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic-heading",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic-body",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const locale = "ar" as const;

export const metadata: Metadata = {
  title: {
    default: "بوابة التسجيل الأولي | مدارس النبراس",
    template: "%s | مدارس النبراس",
  },
  description:
    "منصة التسجيل الأولي لمدارس النبراس — تقديم طلب الانضمام ومتابعة مسار التسجيل.",
};

export default async function AdmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages({ locale });
  const fontVars = `${notoKufiArabic.variable} ${notoSansArabic.variable} ${inter.variable}`;

  return (
    <html lang={locale} dir="rtl" className={`${fontVars} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
          <WhatsAppButton locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
