import { CMS_ORIGIN } from "@/lib/api";

// See app/sitemaps/pages.xml/route.ts for why this proxy exists.
export const dynamic = "force-dynamic";

const EMPTY_URLSET = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';

export async function GET(): Promise<Response> {
  // A crawler that reaches this via the sitemapindex should never see a
  // crashed 500 — an empty but valid urlset is a safe degrade when the CMS
  // is unreachable, same as app/sitemap.xml/route.ts falling back rather
  // than erroring.
  try {
    const res = await fetch(`${CMS_ORIGIN}/sitemaps/videos.xml`, { cache: "no-store" });
    const body = res.ok ? await res.text() : EMPTY_URLSET;
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  } catch {
    return new Response(EMPTY_URLSET, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
