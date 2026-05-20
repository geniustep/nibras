import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مدارس النبراس — Madaris Nibras",
  description: "مدارس النبراس — مؤسسة تعليمية خاصة بطنجة",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
