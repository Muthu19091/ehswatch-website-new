import type { MetadataRoute } from "next";
import { getSettings, getBlogPosts, getCaseStudies, getProductModules } from "@/lib/api";

// Rendered per-request so new blog posts / case studies / modules appear without
// a rebuild. URLs are absolute, built from the CMS canonical_base_url (which
// already includes the deploy's basePath), so no origin is hardcoded.
export const dynamic = "force-dynamic";

// Public, indexable top-level routes. Excluded on purpose: home-v2 (unlinked
// experimental home duplicate), cookie-settings (utility), preview/* (internal).
const STATIC_ROUTES = [
  "",
  "/about",
  "/product",
  "/iris",
  "/industries",
  "/pricing",
  "/blog",
  "/case-studies",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
] as const;

type Row = { attributes?: { slug?: string; updated_at?: string } };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settingsRes = await getSettings().catch(() => null);
  const settings = (settingsRes?.data ?? null) as Record<string, unknown> | null;
  const seo = (settings?.seo ?? null) as { canonical_base_url?: string } | null;
  const siteUrl = (seo?.canonical_base_url || "https://stage.odigma.ooo/ehswatch-stage").replace(/\/+$/, "");

  const [blogs, cases, modules] = await Promise.all([
    getBlogPosts().catch(() => null),
    getCaseStudies().catch(() => null),
    getProductModules().catch(() => null),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${siteUrl}${r}/`,
    lastModified: now,
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));

  const dynEntries = (rows: { data?: Row[] } | null, prefix: string): MetadataRoute.Sitemap =>
    (rows?.data ?? [])
      .filter((it) => it.attributes?.slug)
      .map((it) => ({
        url: `${siteUrl}${prefix}/${it.attributes!.slug}/`,
        lastModified: it.attributes?.updated_at ? new Date(it.attributes.updated_at) : now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));

  return [
    ...staticEntries,
    ...dynEntries(blogs as { data?: Row[] } | null, "/blog"),
    ...dynEntries(cases as { data?: Row[] } | null, "/case-studies"),
    ...dynEntries(modules as { data?: Row[] } | null, "/modules"),
  ];
}
