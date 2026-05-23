import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const ADMIN_ORIGIN =
  process.env.ADMIN_UPSTREAM_URL ?? "https://admission.madarisnibras.ma";

/** /adminsession أو /ar|fr|en/adminsession → لوحة الإدارة على النطاق المستقل */
function getAdminSessionRedirectUrl(pathname: string): string | null {
  const localeMatch = pathname.match(
    /^\/(ar|fr|en)\/adminsession(\/.*)?$/
  );
  if (localeMatch) {
    const rest = localeMatch[2] ?? "";
    return `${ADMIN_ORIGIN}/admin${rest}`;
  }
  if (pathname === "/adminsession" || pathname.startsWith("/adminsession/")) {
    const rest = pathname.slice("/adminsession".length);
    return `${ADMIN_ORIGIN}/admin${rest}`;
  }
  return null;
}

function isLegacyAdmissionPath(pathname: string) {
  return pathname === "/admission" || pathname.startsWith("/admission/");
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminRedirect = getAdminSessionRedirectUrl(pathname);
  if (adminRedirect) {
    return NextResponse.redirect(adminRedirect);
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
