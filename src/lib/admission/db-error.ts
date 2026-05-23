import { Prisma } from "@prisma/client";

export function logApplicationDbError(error: unknown) {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("[applications] DB init:", error.message);
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[applications] Prisma ${error.code}:`, error.message);
    return;
  }
  console.error("[applications]", error);
}

/** تلميح داخلي في سجلات Vercel — لا يُعرض للمستخدم إلا مع ADMISSION_API_DEBUG=true */
export function getApplicationDbDebugHint(error: unknown): string | undefined {
  if (!process.env.DATABASE_URL) {
    return "DATABASE_URL غير معرّف على Vercel";
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    if (error.message.includes("DATABASE_URL")) {
      return "DATABASE_URL غير صالح أو غير معرّف";
    }
    return "تعذر الاتصال بقاعدة PostgreSQL (تحقق من HOST، SSL، الجدار الناري، pooler)";
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021" || error.code === "P2022") {
      return "جدول أو عمود غير موجود — قد تحتاج prisma migrate deploy على السيرفر";
    }
  }
  return undefined;
}
