import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const adminOrigin =
  process.env.ADMIN_UPSTREAM_URL ?? "https://admission.madarisnibras.ma";

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
      {
        source: "/adminsession",
        destination: `${adminOrigin}/admin`,
        permanent: false,
      },
      {
        source: "/adminsession/:path*",
        destination: `${adminOrigin}/admin/:path*`,
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
