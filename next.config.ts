import type { NextConfig } from "next";

const IS_VERCEL = process.env.VERCEL === '1';
const BASE_PATH = IS_VERCEL ? "" : "/ehswatch-website";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
  images: { unoptimized: true },
};

export default nextConfig;