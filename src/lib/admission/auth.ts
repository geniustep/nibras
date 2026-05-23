import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { UserStatus } from "@prisma/client";
import { prisma } from "@/lib/admission/prisma";
import { USER_STATUS_LOGIN_MESSAGES } from "@/lib/admission/user-labels";

const SESSION_COOKIE = "nibras_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET must be set (min 16 chars)");
  }
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      id: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "مسؤول",
    };
  } catch {
    return null;
  }
}

export type CredentialCheckResult =
  | { ok: true; user: SessionUser }
  | { ok: false; reason: "invalid_credentials" }
  | { ok: false; reason: "account_status"; status: UserStatus };

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<CredentialCheckResult> {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return { ok: false, reason: "invalid_credentials" };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { ok: false, reason: "invalid_credentials" };

  if (user.status !== "ACTIVE") {
    return { ok: false, reason: "account_status", status: user.status };
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export function accountStatusLoginMessage(status: UserStatus): string {
  if (status === "ACTIVE") return "";
  return USER_STATUS_LOGIN_MESSAGES[status];
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
