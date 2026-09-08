import { getSettings, getBlogPosts, getCaseStudies, getProductModules } from "@/lib/api";

// Prefer the CMS-managed sitemap (Settings → SEO). The CMS serves it at
// /ehswatch-cms/sitemap.xml; when present we return it verbatim. If that is
// unavailable we generate one from live CMS content so /sitemap.xml is never
// empty.
export const dynamic = "force-dynamic";

// Derived from the same CMS_API_SSR_BASE env var lib/api.ts already reads,
// stripped of its /api/v1 suffix — single source of truth for the CMS's
// internal (SSR) base URL, same fallback as lib/api.ts for stage.
const CMS_ORIGIN = (process.env.CMS_API_SSR_BASE || "https://cmsapi.ehswatch.com/api/v1").replace(/\/api\/v1\/?$/, "");

const STATIC_ROUTES = [
  "", "/about", "/product", "/iris", "/industries", "/pricing",
  "/blog", "/case-studies", "/contact-us",
  "/privacy-policy", "/terms-of-service", "/cookie-policy",
];

type Row = { attributes?: { slug?: string; updated_at?: string } };

function xml(body: string): Response {
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

export async function GET(): Promise<Response> {
  // 1) CMS-managed sitemap wins.
  try {
    const res = await fetch(`${CMS_ORIGIN}/sitemap.xml`, { cache: "no-store" });
    if (res.ok) {
      const doc = await res.text();
      if (/<urlset|<sitemapindex/i.test(doc)) return xml(doc);
    }
  } catch {
    /* fall through to generated */
  }

  // 2) Fallback: generate from canonical_base_url + live content.
  const settingsRes = await getSettings().catch(() => null);
  const settings = (settingsRes?.data ?? null) as Record<string, unknown> | null;
  const seo = (settings?.seo ?? null) as { canonical_base_url?: string } | null;
  const siteUrl = (seo?.canonical_base_url || "https://ehswatch.com").replace(/\/+$/, "");

  const [blogs, cases, modules] = await Promise.all([
    getBlogPosts().catch(() => null),
    getCaseStudies().catch(() => null),
    getProductModules().catch(() => null),
  ]);

  const urls: string[] = STATIC_ROUTES.map((r) => `${siteUrl}${r}/`);
  const push = (rows: { data?: Row[] } | null, prefix: string) =>
    (rows?.data ?? []).forEach((it) => {
      if (it.attributes?.slug) urls.push(`${siteUrl}${prefix}/${it.attributes.slug}/`);
    });
  push(blogs as { data?: Row[] } | null, "/blog");
  push(cases as { data?: Row[] } | null, "/case-studies");
  push(modules as { data?: Row[] } | null, "/modules");

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
    `\n</urlset>\n`;
  return xml(body);
}
