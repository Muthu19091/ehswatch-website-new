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
import { redirectIfMoved } from "@/lib/redirectMoved";

export const dynamic = "force-dynamic";

export async function caseStudiesMetadata(slug: string): Promise<Metadata> {
  const pageRes = await getPage(slug).catch(() => null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = (pageRes?.data as any)?.attributes?.meta;
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "Case Studies - EHSWatch",
    description:
      meta?.meta_description ||
      "See how EHSQ teams across construction, energy, manufacturing and logistics use EHSWatch to cut reporting time, accelerate audits and gain full visibility into risk.",
  };
}

export default async function CaseStudiesTemplate({ slug }: { slug: string }) {
  const [pageRes, caseStudiesRes, pageListRes] = await Promise.all([
    getPage(slug),
    getCaseStudies(),
    getPageList(),
  ]);
  if (!pageRes?.data) notFound();
  redirectIfMoved(slug, pageRes);
  const listingSlug = (pageRes.data.attributes as { slug?: string }).slug || slug;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks = (pageRes?.data as any)?.attributes?.content ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  const heroBlock = findBlock<{
    eyebrow?: string; headline?: string; subheadline?: string;
    primary_cta?: unknown; secondary_cta?: unknown;
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
    headline?: string; subhead?: string; primary_cta?: unknown; secondary_cta?: unknown;
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
          listingSlug={listingSlug}
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
