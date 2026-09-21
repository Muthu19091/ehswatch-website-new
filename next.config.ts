import type { NextConfig } from "next";

const IS_VERCEL = process.env.VERCEL === '1';
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? (IS_VERCEL ? "" : "/ehswatch-stage");

const SECURITY_HEADERS = [
  // Already HTTPS-only in practice (port 80 doesn't respond), so this is a
  // no-op for current traffic and just makes that explicit to browsers.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  output: IS_VERCEL ? undefined : 'standalone',
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
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
      // The home page is served at the site root; the CMS "home" slug builds a
      // /home preview/view URL which would otherwise 404 (BUG-135/194).
      { source: "/home", destination: "/", permanent: true },
      { source: "/home/", destination: "/", permanent: true },
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
