import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ar",
        permanent: false,
      },
      {
        source: "/admission",
        destination: "/ar/admission",
        permanent: false,
      },
      {
        source: "/admission/:path*",
        destination: "/ar/admission/:path*",
        permanent: false,
      },
      {
        source: "/tassjil",
        destination: "/ar/admission",
        permanent: true,
      },
      {
        source: "/tassjil/:path*",
        destination: "/ar/admission/:path*",
        permanent: true,
      },
      {
        source: "/adminsession",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/adminsession/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
      {
        source: "/:locale(ar|fr|en)/adminsession",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/:locale(ar|fr|en)/adminsession/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
