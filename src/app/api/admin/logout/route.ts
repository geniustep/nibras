import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/admission/auth";
import { adminUrl } from "@/lib/admission/request-origin";

export async function POST(request: NextRequest) {
  await destroySession();
  return NextResponse.redirect(adminUrl(request, "/admin/login"));
}
