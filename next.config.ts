import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const adminUpstream =
  process.env.ADMIN_UPSTREAM_URL ?? "https://admission.madarisnibras.ma/admin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ar",
        permanent: false,
      },
      {
        source: "/tassjil",
        destination: "/admission",
        permanent: true,
      },
      {
        source: "/tassjil/:path*",
        destination: "/admission/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/adminsession",
        destination: adminUpstream,
      },
      {
        source: "/adminsession/:path*",
        destination: `${adminUpstream}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
