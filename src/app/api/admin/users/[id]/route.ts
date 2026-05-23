import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/admission/prisma";
import { requireUserManager } from "@/lib/admission/admin-auth";
import { userUpdateSchema } from "@/lib/admission/validations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserManager();
  if (auth.error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
  if (auth.error === "FORBIDDEN") {
    return NextResponse.json({ message: "ليس لديك صلاحية" }, { status: 403 });
  }

  const { id } = await params;
  const user = await prisma.adminUser.findUnique({
    where: { id },
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

  if (!user) {
    return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUserManager();
  if (auth.error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
  }
  if (auth.error === "FORBIDDEN") {
    return NextResponse.json({ message: "ليس لديك صلاحية" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = userUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        errors[String(issue.path[0] ?? "form")] = issue.message;
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 });
    }

    const data = parsed.data;
    const emailTaken = await prisma.adminUser.findFirst({
      where: { email: data.email, id: { not: id } },
    });
    if (emailTaken) {
      return NextResponse.json(
        { errors: { email: "البريد الإلكتروني مستخدم مسبقًا" } },
        { status: 400 }
      );
    }

    const updateData: {
      name: string;
      email: string;
      phone: string | null;
      role: typeof data.role;
      status: typeof data.status;
      passwordHash?: string;
    } = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role,
      status: data.status,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ message: "تعذر تحديث المستخدم" }, { status: 500 });
  }
}
