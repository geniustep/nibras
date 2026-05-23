import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isAdmissionPortalPath(pathname: string) {
  return pathname === "/admission" || pathname.startsWith("/admission/");
}

function isAdminSessionPath(pathname: string) {
  return pathname === "/adminsession" || pathname.startsWith("/adminsession/");
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdmissionPortalPath(pathname) || isAdminSessionPath(pathname)) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
