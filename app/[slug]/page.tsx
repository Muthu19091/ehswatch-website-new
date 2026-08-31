import { notFound } from "next/navigation";
import LegalPage, { legalMetadata } from "@/components/sections/LegalPage";
import { getPage } from "@/lib/api";
import { redirectIfMoved } from "@/lib/redirectMoved";
import { TEMPLATE_COMPONENTS, TEMPLATE_METADATA } from "@/components/templates/registry";

// Top-level catch-all. Next prefers the bespoke static routes (about, product,
// terms-of-service, …), so only UNMATCHED top-level slugs land here — e.g. a
// page whose slug was renamed in the CMS. getPage() follows the slug_history
// 301, so both the new slug and any old slug resolve. The page's CMS `template`
// field selects the bespoke design (via the registry); pages without a template
// render through the generic LegalPage. Unknown slugs 404.
export const dynamic = "force-dynamic";

// The CMS "404" page record exists purely as a content SOURCE for
// not-found.tsx's own hero + CTA-banner rendering (see its own getPage("404")
// call) -- it's not meant to be a real, directly-navigable page. Without this
// guard, visiting /404 directly matched this catch-all, rendered the same
// content through the generic LegalPage template instead (no hero styling,
// no CTA banner), and returned a real 200 status instead of a genuine 404 --
// wrong for SEO and semantically wrong for a URL literally named "404".
const RESERVED_SLUGS = ["404"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug)) notFound();
  const res = await getPage(slug).catch(() => null);
  const template = (res?.data as { attributes?: { template?: string } } | null)?.attributes?.template;
  const metaFn = template ? TEMPLATE_METADATA[template] : undefined;
  if (metaFn) return metaFn(slug);
  return legalMetadata(slug, "EHSWatch");
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug)) notFound();
  const res = await getPage(slug).catch(() => null);
  if (!res?.data?.attributes) notFound();
  redirectIfMoved(slug, res);
  const template = (res.data as { attributes?: { template?: string } }).attributes?.template;
  const Tpl = template ? TEMPLATE_COMPONENTS[template] : undefined;
  if (Tpl) return <Tpl slug={slug} />;
  return <LegalPage slug={slug} fallbackTitle="EHSWatch" />;
}
