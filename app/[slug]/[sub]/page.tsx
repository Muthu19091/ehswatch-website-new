export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getPage } from "@/lib/api";
import BlogPostTemplate, { blogPostMetadata } from "@/components/templates/BlogPostTemplate";
import CaseStudyDetailTemplate, { caseStudyDetailMetadata } from "@/components/templates/CaseStudyDetailTemplate";

// Two-segment catch-all for detail pages under a RENAMED listing, e.g.
// /blogs/<post> or /studies/<slug> after the listing slug was changed. Static
// routes (/blog/<post>, /case-studies/<x>, /modules/<x>) take precedence, so
// only renamed / unknown parents land here. The parent page's CMS `template`
// decides how the child renders.
async function resolveParent(slug: string): Promise<{ template?: string; canonical: string } | null> {
  const res = await getPage(slug).catch(() => null);
  const attrs = res?.data?.attributes as { slug?: string; template?: string } | undefined;
  if (!attrs) return null;
  return { template: attrs.template, canonical: attrs.slug || slug };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; sub: string }> }): Promise<Metadata> {
  const { slug, sub } = await params;
  const p = await resolveParent(slug);
  if (p?.template === "blog") return blogPostMetadata(sub, p.canonical);
  if (p?.template === "case-studies") return caseStudyDetailMetadata(sub);
  return {};
}

export default async function NestedDetailPage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const p = await resolveParent(slug);
  if (!p) notFound();
  if (p.canonical !== slug) permanentRedirect(`/${p.canonical}/${sub}`);
  if (p.template === "blog") return <BlogPostTemplate slug={sub} listingSlug={p.canonical} />;
  if (p.template === "case-studies") return <CaseStudyDetailTemplate slug={sub} listingSlug={p.canonical} />;
  notFound();
}
