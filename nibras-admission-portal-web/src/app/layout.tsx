import type { Metadata } from "next";
import "./globals.css";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://admission.madarisnibras.ma";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "بوابة التسجيل الأولي | مدارس النبراس",
    template: "%s | مدارس النبراس",
  },
  description:
    "منصة التسجيل الأولي لمدارس النبراس — تقديم طلب الانضمام ومتابعة مسار التسجيل.",
  icons: {
    icon: [{ url: "/logo_nibrass.png", type: "image/png" }],
    shortcut: "/logo_nibrass.png",
    apple: "/logo_nibrass.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_MA",
    url: appUrl,
    siteName: "مدارس النبراس — التسجيل الأولي",
    title: "بوابة التسجيل الأولي | مدارس النبراس",
    description:
      "منصة التسجيل الأولي لمدارس النبراس — تقديم طلب الانضمام بخطوات بسيطة.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
