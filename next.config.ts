import type { NextConfig } from "next";

const IS_VERCEL = process.env.VERCEL === '1';
const BASE_PATH = IS_VERCEL ? "" : "/ehswatch-stage";

const nextConfig: NextConfig = {
  output: IS_VERCEL ? undefined : 'standalone',
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  // Dev-only. `next dev` rejects cross-origin requests with 403 to stop other
  // sites reading your source over localhost. Testing on a phone/tablet hits the
  // machine's LAN IP, which is a different origin, so every client chunk 403s and
  // the page loads without hydrating. List the LAN origins allowed to reach the
  // dev server. Ignored by production builds.
  allowedDevOrigins: ["10.245.231.233"],
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  async redirects() {
    return [
      { source: "/solutions", destination: "/industries", permanent: true },
      { source: "/solutions/", destination: "/industries/", permanent: true },
      { source: "/solutions-v2", destination: "/industries", permanent: true },
      { source: "/solutions-v2/", destination: "/industries/", permanent: true },
      // The Contact-Us page lives at /contact-us. Redirect old /support links.
      { source: "/support", destination: "/contact-us", permanent: true },
      { source: "/support/", destination: "/contact-us/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "stage.odigma.ooo" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
