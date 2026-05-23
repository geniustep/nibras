import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isAdminSessionPath(pathname: string) {
  return pathname === "/adminsession" || pathname.startsWith("/adminsession/");
}

function isLegacyAdmissionPath(pathname: string) {
  return pathname === "/admission" || pathname.startsWith("/admission/");
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminSessionPath(pathname)) {
    return NextResponse.next();
  }

  // مسارات قديمة بدون لغة → العربية الافتراضية (تفعيل الترجمة + تبديل اللغة)
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
