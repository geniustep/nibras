import { NextResponse } from "next/server";
import { prisma } from "@/lib/admission/prisma";

/**
 * فحص اتصال القاعدة — للفريق فقط (أضف HEALTH_CHECK_SECRET على Vercel).
 * GET /api/health/db?secret=YOUR_SECRET
 */
export async function GET(request: Request) {
  const secret = process.env.HEALTH_CHECK_SECRET;
  const { searchParams } = new URL(request.url);

  if (!secret || searchParams.get("secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json({
      ok: false,
      error: "DATABASE_URL not set",
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    const count = await prisma.applicationCounter.findUnique({
      where: { id: "default" },
      select: { year: true, value: true },
    });
    return NextResponse.json({
      ok: true,
      counter: count ?? "no row yet",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
