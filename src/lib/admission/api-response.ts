import { NextResponse } from "next/server";

export function unauthorized() {
  return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ message: "ليس لديك صلاحية" }, { status: 403 });
}

export function notFound() {
  return NextResponse.json({ message: "غير موجود" }, { status: 404 });
}

export function badRequest(message: string, errors?: Record<string, string>) {
  return NextResponse.json({ message, errors }, { status: 400 });
}

export function serverError() {
  return NextResponse.json({ message: "خطأ في الخادم" }, { status: 500 });
}
