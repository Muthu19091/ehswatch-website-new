export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";
import { getCaseStudy, getCaseStudies, getProductModules, getPageList } from "@/lib/api";
import { notFound } from "next/navigation";
import { robotsFrom, seoExtras } from "@/lib/seo";
import { buildPageMap, resolveCta } from "@/lib/blocks";
import { headingHtmlOpt, stripHtmlOpt } from "@/lib/text";

export async function caseStudyDetailMetadata(slug: string): Promise<Metadata> {
  const res = await getCaseStudy(slug);
  const study = res?.data;
  const meta = study?.attributes.meta;
  return {
    ...seoExtras(meta, "article"),
    robots: robotsFrom(meta?.robots),
    title:
      meta?.meta_title ||
      (study ? `${study.attributes.title} | EHSWatch` : "Case Study | EHSWatch"),
    description:
      meta?.meta_description ||
      study?.attributes.summary ||
      `EHSWatch case study — ${slug.replace(/-/g, " ")}.`,
  };
}

export default async function CaseStudyDetailTemplate({ slug, listingSlug = "case-studies" }: { slug: string; listingSlug?: string }) {
  const [res, allRes, modulesRes, pageListRes] = await Promise.all([
    getCaseStudy(slug),
    getCaseStudies(),
    getProductModules(),
    getPageList(),
  ]);
  const cmsStudy = res?.data;
  if (!cmsStudy) notFound();
  const pms = (cmsStudy.attributes as {
    product_modules_section?: { source?: string; heading?: string; curated_ids?: number[]; visible_count?: number | string | null };
  }).product_modules_section;
  const moduleList = modulesRes?.data ?? [];
  const moduleById = new Map(moduleList.map((m) => [m.id, m]));
  let applications: { name: string; slug: string }[] = [];
  if (pms) {
    if (pms.source === "curated" && Array.isArray(pms.curated_ids)) {
      applications = pms.curated_ids
        .map((id) => moduleById.get(id))
        .filter((m): m is NonNullable<typeof m> => !!m)
        .map((m) => ({ name: m.attributes.name, slug: m.attributes.slug }));
    } else {
      applications = moduleList.map((m) => ({ name: m.attributes.name, slug: m.attributes.slug }));
    }
    // "Cards shown by default" cap — applies to ANY source; accepts a number or
    // a numeric string ("5"), which the CMS sometimes stores.
    const vc = Number(pms.visible_count);
    if (Number.isFinite(vc) && vc > 0) applications = applications.slice(0, vc);
  }

  // CTA banner (new cta_section field on the Case Study API). Same shape as the
  // cta_banner block; render only when a headline is set (mirrors the CTA rule
  // "no label -> don't render"). CTAs resolved via pageMap for page_id links.
  const pageMap = buildPageMap(pageListRes?.data);
  const rawCta = (cmsStudy.attributes as {
    cta_section?: { headline?: string; subhead?: string; primary_cta?: unknown; secondary_cta?: unknown } | null;
  }).cta_section;
  const ctaHeadline = headingHtmlOpt(rawCta?.headline);
  const ctaSection = ctaHeadline
    ? {
        headline: ctaHeadline,
        subhead: stripHtmlOpt(rawCta?.subhead),
        primaryCta: resolveCta(rawCta?.primary_cta, pageMap) ?? undefined,
        secondaryCta: resolveCta(rawCta?.secondary_cta, pageMap) ?? undefined,
      }
    : undefined;

  const allSlugs = (allRes?.data ?? [])
    .sort((a, b) => new Date(b.attributes.published_at).getTime() - new Date(a.attributes.published_at).getTime())
    .map((s) => s.attributes.slug);

  return (
    <>
      <Navbar lightHero />
      <main>
        <CaseStudyTemplate
          slug={slug}
          cmsStudy={cmsStudy}
          allSlugs={allSlugs.length > 0 ? allSlugs : undefined}
          applications={applications}
          applicationsHeading={pms?.heading || undefined}
          ctaSection={ctaSection}
          listingSlug={listingSlug}
        />
      </main>
      <Footer />
    </>
  );
}
