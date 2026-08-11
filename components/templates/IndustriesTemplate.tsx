import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SolutionsHero from "@/components/sections/SolutionsHero";
import SolutionsZigzag from "@/components/sections/SolutionsZigzag";
import CTABanner from "@/components/sections/CTABanner";
import Testimonials from "@/components/sections/Testimonials";
import { getPage, getTestimonials, getPageList } from "@/lib/api";
import { stripHtml, stripHtmlOpt, headingHtmlOpt } from "@/lib/text";
import { findBlock, normalizeArray, buildPageMap, resolveCta } from "@/lib/blocks";
import type { CmsIndustryCard } from "@/components/sections/SolutionsZigzag";
import type { Metadata } from "next";
import { robotsFrom, seoExtras } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function industriesMetadata(slug: string): Promise<Metadata> {
  const pageData = await getPage(slug).catch(() => null);
  const attrs = (pageData?.data as any)?.attributes ?? {};
  return {
    ...seoExtras(attrs.meta),
    robots: robotsFrom(attrs.meta?.robots),
    title: attrs.meta?.meta_title || "Industries — EHSWatch",
    description: attrs.meta?.meta_description || "Every industry has different risks. EHSWatch is configured to the compliance requirements, workflows and hazard profiles of your sector.",
  };
}

export default async function IndustriesTemplate({ slug }: { slug: string }) {
  const [industriesData, testimonialsRes, pageListRes] = await Promise.all([
    getPage(slug),
    getTestimonials(),
    getPageList(),
  ]);
  // CMS page record must be published — drafts and missing records 404
  if (!industriesData?.data) notFound();

  const industryBlocks: any[] = (industriesData?.data as any)?.attributes?.content ?? [];
  const cmsTestimonials = testimonialsRes?.data ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  /* Hero — from industries CMS page */
  const cmsHero = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
    secondary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(industryBlocks, "hero");

  /* CTA banner — from industries CMS page */
  const ctaData = findBlock<{
    headline?: string;
    subhead?: string;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(industryBlocks, "cta_banner");
  const ctaPrimary   = resolveCta(ctaData?.primary_cta, pageMap);
  const ctaSecondary = resolveCta(ctaData?.secondary_cta, pageMap);

  /* Testimonials section header — from the industries CMS testimonials block */
  const testimonialsData = findBlock<{ heading?: string; subheading?: string; visible_count?: number | string | null }>(industryBlocks, "testimonials");
  const testimonialsLimit = Number(testimonialsData?.visible_count) || undefined;
  const limitedTestimonials = testimonialsLimit ? cmsTestimonials.slice(0, testimonialsLimit) : cmsTestimonials;

  // ── solution_carousel block → SolutionsZigzag ─────────────────────────────
  const solutionCarousel = findBlock<{
    heading?: string;
    subheading?: string;
    eyebrow?: string;
    cards?: Record<string, CmsIndustryCard> | CmsIndustryCard[];
  }>(industryBlocks, "solution_carousel");
  const cmsZigzagCards: CmsIndustryCard[] | undefined = solutionCarousel?.cards
    ? normalizeArray<CmsIndustryCard>(solutionCarousel.cards)
        .filter((c) => c.title)
        .map((c) => ({
          ...c,
          title: stripHtml(c.title),
          subheading: stripHtmlOpt(c.subheading),
        }))
    : undefined;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <SolutionsHero
          cmsEyebrow={stripHtmlOpt(cmsHero?.eyebrow)}
          cmsHeadline={stripHtmlOpt(cmsHero?.headline)}
          cmsSubheadline={stripHtmlOpt(cmsHero?.subheadline)}
          cmsPrimaryCta={resolveCta(cmsHero?.primary_cta, pageMap) ?? undefined}
          cmsSecondaryCta={resolveCta(cmsHero?.secondary_cta, pageMap) ?? undefined}
        />
        <SolutionsZigzag
          cmsCards={cmsZigzagCards}
          cmsHeading={headingHtmlOpt(solutionCarousel?.heading)}
          cmsSubheading={stripHtmlOpt(solutionCarousel?.subheading)}
          cmsEyebrow={stripHtmlOpt(solutionCarousel?.eyebrow)}
        />
        {cmsTestimonials.length > 0 && (
          <Testimonials
            title={headingHtmlOpt(testimonialsData?.heading)}
            subtitle={stripHtmlOpt(testimonialsData?.subheading) ?? ""}
            cmsItems={limitedTestimonials}
          />
        )}
        {ctaData?.headline && (
          <CTABanner
            cmsHeadline={headingHtmlOpt(ctaData.headline)}
            cmsSubhead={stripHtmlOpt(ctaData?.subhead)}
            cmsPrimaryCta={ctaPrimary ?? undefined}
            cmsSecondaryCta={ctaSecondary ?? undefined}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
