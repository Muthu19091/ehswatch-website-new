import { getSettings } from "@/lib/api";

// Per-request so it always reflects Settings → SEO `llms_txt`. Editor-authored
// content is served verbatim; the fallback below is used only when the field is
// empty.
export const dynamic = "force-dynamic";

const FALLBACK = `# EHSWatch

> EHSWatch is an AI-powered EHSQ (Environment, Health, Safety & Quality) management platform that helps industrial and enterprise teams move from manual, paper-based safety processes to real-time, intelligent compliance and risk management.

## Key pages
- Home: https://stage.odigma.ooo/ehswatch-stage/
- Product: https://stage.odigma.ooo/ehswatch-stage/product/
- Pricing: https://stage.odigma.ooo/ehswatch-stage/pricing/
- Sitemap: https://stage.odigma.ooo/ehswatch-stage/sitemap.xml`;

export async function GET(): Promise<Response> {
  const settingsRes = await getSettings().catch(() => null);
  const settings = (settingsRes?.data ?? null) as Record<string, unknown> | null;
  const seo = (settings?.seo ?? null) as { llms_txt?: string } | null;

  const body = (seo?.llms_txt?.trim() || FALLBACK) + "\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
