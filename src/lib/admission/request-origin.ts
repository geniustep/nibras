import type { NextRequest } from "next/server";

const PRODUCTION_FALLBACK =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.madarisnibras.ma";
const DEV_FALLBACK = "http://localhost:3000";

function isBlockedHost(hostname: string) {
  return hostname === "0.0.0.0";
}

function originFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (isBlockedHost(parsed.hostname)) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

/** أصل آمن للروابط خلف Docker/Traefik — يتجنّب 0.0.0.0 غير الصالح في المتصفح */
export function getTrustedOrigin(request?: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL
    ? originFromUrl(process.env.NEXT_PUBLIC_APP_URL)
    : null;
  if (fromEnv) return fromEnv;

  if (request) {
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      ?.trim();
    const forwardedProto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
      "https";

    if (forwardedHost && !isBlockedHost(forwardedHost.split(":")[0])) {
      return `${forwardedProto}://${forwardedHost}`;
    }

    const host = request.headers.get("host");
    const hostName = host?.split(":")[0];
    if (host && hostName && !isBlockedHost(hostName)) {
      const proto = request.nextUrl.protocol.replace(":", "") || "https";
      return `${proto}://${host}`;
    }

    if (!isBlockedHost(request.nextUrl.hostname)) {
      return request.nextUrl.origin;
    }
  }

  return process.env.NODE_ENV === "production"
    ? PRODUCTION_FALLBACK
    : DEV_FALLBACK;
}

export function adminUrl(
  request: NextRequest,
  pathname: string,
  searchParams?: Record<string, string>
) {
  const url = new URL(pathname, getTrustedOrigin(request));
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}
