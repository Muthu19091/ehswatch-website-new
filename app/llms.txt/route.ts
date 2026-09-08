import { getSettings } from "@/lib/api";

// Per-request so it always reflects Settings → SEO `llms_txt`. Editor-authored
// content is served verbatim; the fallback below is used only when the field is
// empty.
export const dynamic = "force-dynamic";

const DEFAULT_SITE_URL = "https://ehswatch.com";

export async function GET(): Promise<Response> {
  const settingsRes = await getSettings().catch(() => null);
  const settings = (settingsRes?.data ?? null) as Record<string, unknown> | null;
  const seo = (settings?.seo ?? null) as { llms_txt?: string; canonical_base_url?: string } | null;

  if (seo?.llms_txt?.trim()) {
    return new Response(seo.llms_txt.trim() + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  // Same canonical_base_url Settings → SEO field sitemap.xml uses — single
  // source of truth for the frontend's own domain, no per-file hardcoding.
  const siteUrl = (seo?.canonical_base_url || DEFAULT_SITE_URL).replace(/\/+$/, "");
  const fallback = `# EHSWatch

> EHSWatch is an AI-powered EHSQ (Environment, Health, Safety & Quality) management platform that helps industrial and enterprise teams move from manual, paper-based safety processes to real-time, intelligent compliance and risk management.

## Key pages
- Home: ${siteUrl}/
- Product: ${siteUrl}/product/
- Pricing: ${siteUrl}/pricing/
- Sitemap: ${siteUrl}/sitemap.xml
`;
  return new Response(fallback, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
