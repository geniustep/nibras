import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مدارس النبراس — Madaris Nibras",
  description: "مدارس النبراس — مؤسسة تعليمية مغربية حديثة بطنجة، من التعليم الأولي إلى الثانوي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}