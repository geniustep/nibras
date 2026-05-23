import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/admission/prisma";
import { getSession } from "@/lib/admission/auth";

const USER_MANAGER_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];

export async function requireUserManager() {
  const session = await getSession();
  if (!session) {
    return { error: "UNAUTHORIZED" as const, session: null };
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.id },
    select: { id: true, role: true, status: true },
  });

  if (!user || user.status !== "ACTIVE") {
    return { error: "UNAUTHORIZED" as const, session: null };
  }

  if (!USER_MANAGER_ROLES.includes(user.role)) {
    return { error: "FORBIDDEN" as const, session };
  }

  return { error: null, session, role: user.role };
}
