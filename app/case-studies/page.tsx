import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import CaseStudiesHero from "@/components/sections/CaseStudiesHero";
import CaseStudiesGrid from "@/components/sections/CaseStudiesGrid";
import CTABanner from "@/components/sections/CTABanner";
import { getPage, getCaseStudies, getPageList } from "@/lib/api";
import { findBlock, buildPageMap, resolveCta } from "@/lib/blocks";
import { stripHtmlOpt, headingHtmlOpt } from "@/lib/text";
import type { Metadata } from "next";
import { robotsFrom, seoExtras } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("case-studies");
  const meta = (pageRes?.data as any)?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "Case Studies — EHSWatch",
    description:
      meta?.meta_description ||
      "See how EHSQ teams across construction, energy, manufacturing and logistics use EHSWatch to cut reporting time, accelerate audits and gain full visibility into risk.",
  };
}

export default async function CaseStudiesPage() {
  const [pageRes, caseStudiesRes, pageListRes] = await Promise.all([
    getPage("case-studies"),
    getCaseStudies(),
    getPageList(),
  ]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();

  const blocks = (pageRes?.data as any)?.attributes?.content ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  const heroBlock = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "hero");

  const listingBlock = findBlock<{
    heading?: string; subheading?: string;
    pagination?: string; limit?: number | string; sort?: string;
    show_image?: boolean; show_excerpt?: boolean; show_date?: boolean;
    show_author?: boolean; show_category?: boolean;
    card_cta_label?: string; empty_state_text?: string;
  }>(blocks, "post_listing");
  const listingLimit = Number(listingBlock?.limit);

  const ctaBlock = findBlock<{
    headline?: string;
    subhead?: string;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "cta_banner");

  const cmsItems = caseStudiesRes?.data ?? [];

  const ctaPrimary   = resolveCta(ctaBlock?.primary_cta, pageMap);
  const ctaSecondary = resolveCta(ctaBlock?.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <CaseStudiesHero
          cmsEyebrow={stripHtmlOpt(heroBlock?.eyebrow)}
          cmsHeadline={headingHtmlOpt(heroBlock?.headline)}
          cmsSubheadline={stripHtmlOpt(heroBlock?.subheadline)}
          cmsPrimaryCta={resolveCta(heroBlock?.primary_cta, pageMap) ?? undefined}
          cmsSecondaryCta={resolveCta(heroBlock?.secondary_cta, pageMap) ?? undefined}
        />
        <CaseStudiesGrid
          cmsStudies={cmsItems.length > 0 ? cmsItems : undefined}
          pagination={listingBlock?.pagination}
          limit={Number.isFinite(listingLimit) && listingLimit > 0 ? listingLimit : undefined}
          heading={stripHtmlOpt(listingBlock?.heading)}
          subheading={stripHtmlOpt(listingBlock?.subheading)}
          showImage={listingBlock?.show_image}
          showExcerpt={listingBlock?.show_excerpt}
          showDate={listingBlock?.show_date}
          showAuthor={listingBlock?.show_author}
          showCategory={listingBlock?.show_category}
          cardCtaLabel={stripHtmlOpt(listingBlock?.card_cta_label)}
          emptyStateText={stripHtmlOpt(listingBlock?.empty_state_text)}
        />
        <CTABanner
          cmsHeadline={headingHtmlOpt(ctaBlock?.headline)}
          cmsSubhead={stripHtmlOpt(ctaBlock?.subhead)}
          cmsPrimaryCta={ctaPrimary ?? undefined}
          cmsSecondaryCta={ctaSecondary ?? undefined}
        />
      </main>
      <Footer />
    </>
  );
}
