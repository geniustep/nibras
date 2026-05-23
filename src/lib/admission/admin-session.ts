import { prisma } from "@/lib/admission/prisma";
import { getSession } from "@/lib/admission/auth";
import type { AuthAdmin } from "@/lib/admission/admission-permissions";

export async function getAuthAdmin(): Promise<AuthAdmin | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });

  return user;
}

export type AuthResult =
  | { user: AuthAdmin }
  | { error: "UNAUTHORIZED" | "INACTIVE" };

export async function requireAuthAdmin(): Promise<AuthResult> {
  const user = await getAuthAdmin();
  if (!user) return { error: "UNAUTHORIZED" };
  if (user.status !== "ACTIVE") return { error: "INACTIVE" };
  return { user };
}

export function isAuthError(auth: AuthResult): auth is { error: "UNAUTHORIZED" | "INACTIVE" } {
  return "error" in auth;
}
