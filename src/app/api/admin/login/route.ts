import { NextResponse } from "next/server";
import {
  accountStatusLoginMessage,
  createSession,
  verifyAdminCredentials,
} from "@/lib/admission/auth";
import { loginSchema } from "@/lib/admission/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "بيانات الدخول غير صالحة" },
        { status: 400 }
      );
    }

    const result = await verifyAdminCredentials(
      parsed.data.email,
      parsed.data.password
    );

    if (!result.ok) {
      if (result.reason === "account_status") {
        return NextResponse.json(
          { message: accountStatusLoginMessage(result.status) },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    await createSession(result.user);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "تعذر تسجيل الدخول" },
      { status: 500 }
    );
  }
}
