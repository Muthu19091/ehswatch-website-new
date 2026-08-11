import { getSettings } from "@/lib/api";

// Per-request so it always reflects Settings → SEO. If the CMS `robots_txt`
// field is set, it is served VERBATIM (the editor owns the policy). Otherwise a
// sensible default is generated: a staging origin blocks all crawlers, prod
// allows crawling and points at the sitemap.
export const dynamic = "force-dynamic";

function plain(body: string): Response {
  return new Response(body.endsWith("\n") ? body : body + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function GET(): Promise<Response> {
  const settingsRes = await getSettings().catch(() => null);
  const settings = (settingsRes?.data ?? null) as Record<string, unknown> | null;
  const seo = (settings?.seo ?? null) as { robots_txt?: string; canonical_base_url?: string } | null;

  const custom = seo?.robots_txt?.trim();
  if (custom) return plain(custom);

  const siteUrl = (seo?.canonical_base_url || "https://stage.odigma.ooo/ehswatch-stage").replace(/\/+$/, "");
  const isStaging = /stage|preview|localhost|127\.0\.0\.1/i.test(siteUrl);
  return plain(
    isStaging
      ? "User-agent: *\nDisallow: /"
      : `User-agent: *\nAllow: /\nDisallow: /cookie-settings/\nDisallow: /preview/\nSitemap: ${siteUrl}/sitemap.xml`,
  );
}
