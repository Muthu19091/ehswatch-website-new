import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/api";

// Per-request so the crawl policy always reflects the live canonical_base_url
// (Settings → SEO). A staging origin is blocked outright; production allows
// normal crawling and points at the sitemap.
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settingsRes = await getSettings().catch(() => null);
  const settings = (settingsRes?.data ?? null) as Record<string, unknown> | null;
  const seo = (settings?.seo ?? null) as { canonical_base_url?: string } | null;
  const siteUrl = (seo?.canonical_base_url || "https://stage.odigma.ooo/ehswatch-stage").replace(/\/+$/, "");

  // A staging / preview deployment must never be indexed — block every crawler.
  const isStaging = /stage|preview|localhost|127\.0\.0\.1/i.test(siteUrl);
  if (isStaging) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cookie-settings/", "/preview/", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
