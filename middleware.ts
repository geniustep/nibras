import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { routing } from "./src/i18n/routing";
import { adminUrl } from "./src/lib/admission/request-origin";

const intlMiddleware = createMiddleware(routing);

const SESSION_COOKIE = "nibras_admin_session";

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function isAdminAuthenticated(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const secret = getSessionSecret();
  if (!secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

/** /adminsession أو /{locale}/adminsession → /admin على نفس الموقع */
function getAdminSessionPath(pathname: string): string | null {
  const localeMatch = pathname.match(/^\/(ar|fr|en)\/adminsession(\/.*)?$/);
  if (localeMatch) {
    const rest = localeMatch[2] ?? "";
    return `/admin${rest}`;
  }
  if (pathname === "/adminsession" || pathname.startsWith("/adminsession/")) {
    const rest = pathname.slice("/adminsession".length);
    return `/admin${rest}`;
  }
  return null;
}

function isLegacyAdmissionPath(pathname: string) {
  return pathname === "/admission" || pathname.startsWith("/admission/");
}

async function handleAdminRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const authed = await isAdminAuthenticated(request);

  if (!authed && !isLoginPage) {
    return NextResponse.redirect(
      adminUrl(request, "/admin/login", { from: pathname })
    );
  }

  if (authed && isLoginPage) {
    return NextResponse.redirect(adminUrl(request, "/admin/admissions"));
  }

  return NextResponse.next();
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminSessionPath = getAdminSessionPath(pathname);
  if (adminSessionPath) {
    const url = request.nextUrl.clone();
    url.pathname = adminSessionPath;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    return handleAdminRoutes(request);
  }

  if (isLegacyAdmissionPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/ar${pathname}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
