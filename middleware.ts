import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isAdmissionPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/tassjil");
}

export default function middleware(request: NextRequest) {
  if (isAdmissionPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
