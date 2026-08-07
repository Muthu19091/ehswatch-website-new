import type { Metadata } from "next";

/**
 * CMS meta.robots ("index, follow" / "noindex, nofollow") → Next metadata.
 * The CMS forces noindex,nofollow for any non-active record, so draft
 * content rendered through preview links is never indexable.
 */
export function robotsFrom(robots?: string | null): Metadata["robots"] {
  if (!robots) return undefined;
  const r = robots.toLowerCase();
  return { index: !r.includes("noindex"), follow: !r.includes("nofollow") };
}


/**
 * SEO fields beyond title/description/robots, wired straight from the CMS
 * `meta` object so the dashboard fully drives them: keywords, canonical URL,
 * and the Open Graph / Twitter social-share image. openGraph/twitter title +
 * description are omitted here when the CMS has none, so Next falls back to
 * the page's own <title>/description automatically. Spread into a page's
 * generateMetadata return: `return { ...seoExtras(meta), title, description }`.
 */
export interface CmsMeta {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical_url?: string | null;
  // CMS serialises og_image as a MediaResource ({ attributes: { url } }); some
  // older fields are flat ({ url }). Support both.
  og_image?: { url?: string | null; attributes?: { url?: string | null } | null } | null;
  robots?: string | null;
}

export function seoExtras(
  meta?: CmsMeta | null,
  ogType: "website" | "article" = "website",
): Metadata {
  const md: Metadata = {};
  // Guard every field: CMS values are not guaranteed strings (e.g. meta_keywords
  // is cast to an array), so .trim() on a raw value would crash the page.
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
  const kw: unknown = (meta as { meta_keywords?: unknown } | null | undefined)?.meta_keywords;
  const keywords = Array.isArray(kw) ? kw.map((k) => str(k)).filter(Boolean) : str(kw);
  if (Array.isArray(keywords) ? keywords.length > 0 : Boolean(keywords)) md.keywords = keywords;
  const canonical = str(meta?.canonical_url);
  if (canonical) md.alternates = { canonical };
  const ogImage = meta?.og_image?.attributes?.url || meta?.og_image?.url || undefined;
  const ogTitle = str(meta?.meta_title) || undefined;
  const ogDesc = str(meta?.meta_description) || undefined;
  md.openGraph = {
    type: ogType,
    ...(ogTitle ? { title: ogTitle } : {}),
    ...(ogDesc ? { description: ogDesc } : {}),
    ...(ogImage ? { images: [{ url: ogImage }] } : {}),
  };
  md.twitter = {
    card: ogImage ? "summary_large_image" : "summary",
    ...(ogTitle ? { title: ogTitle } : {}),
    ...(ogDesc ? { description: ogDesc } : {}),
    ...(ogImage ? { images: [ogImage] } : {}),
  };
  return md;
}
