import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/admission/prisma";
import { requireUserManager } from "@/lib/admission/admin-auth";
import { userCreateSchema } from "@/lib/admission/validations";

export async function GET() {
  const auth = await requireUserManager();
  if (auth.error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
  if (auth.error === "FORBIDDEN") {
    return NextResponse.json({ message: "ليس لديك صلاحية" }, { status: 403 });
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const auth = await requireUserManager();
  if (auth.error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
  if (auth.error === "FORBIDDEN") {
    return NextResponse.json({ message: "ليس لديك صلاحية" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = userCreateSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        errors[String(issue.path[0] ?? "form")] = issue.message;
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = parsed.data;
    const existing = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json(
        { errors: { email: "البريد الإلكتروني مستخدم مسبقًا" } },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        role: data.role,
        status: data.status,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("User create error:", error);
    return NextResponse.json({ message: "تعذر إنشاء المستخدم" }, { status: 500 });
  }
}
