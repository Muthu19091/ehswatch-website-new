import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SolutionsHero from "@/components/sections/SolutionsHero";
import SolutionsZigzag from "@/components/sections/SolutionsZigzag";
import CTABanner from "@/components/sections/CTABanner";
import Testimonials from "@/components/sections/Testimonials";
import { getPage, getTestimonials } from "@/lib/api";
import { findBlock, normalizeArray, ctaHref } from "@/lib/blocks";
import type { CmsIndustryCard } from "@/components/sections/SolutionsZigzag";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage("industries").catch(() => null);
  const attrs = (pageData?.data as any)?.attributes ?? {};
  return {
    title: attrs.meta?.meta_title || "Industries — EHSWatch",
    description: attrs.meta?.meta_description || "Every industry has different risks. EHSWatch is configured to the compliance requirements, workflows and hazard profiles of your sector.",
  };
}

export default async function IndustriesPage() {
  const [industriesData, testimonialsRes] = await Promise.all([
    getPage("industries"),
    getTestimonials(),
  ]);

  const industryBlocks: any[] = (industriesData?.data as any)?.attributes?.content ?? [];
  const cmsTestimonials = testimonialsRes?.data ?? [];

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
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string; cta?: { label?: string; url?: string; type?: string; anchor?: string } };
    secondary_cta?: { label?: string; url?: string; type?: string; anchor?: string; cta?: { label?: string; url?: string; type?: string; anchor?: string } };
  }>(industryBlocks, "cta_banner");
  const ctaPrimary   = ctaData?.primary_cta?.cta   ?? ctaData?.primary_cta;
  const ctaSecondary = ctaData?.secondary_cta?.cta  ?? ctaData?.secondary_cta;

  // ── solution_carousel block → SolutionsZigzag ─────────────────────────────
  const solutionCarousel = findBlock<{
    cards?: Record<string, CmsIndustryCard> | CmsIndustryCard[];
  }>(industryBlocks, "solution_carousel");
  const cmsZigzagCards: CmsIndustryCard[] | undefined = solutionCarousel?.cards
    ? normalizeArray<CmsIndustryCard>(solutionCarousel.cards).filter((c) => c.title)
    : undefined;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <SolutionsHero
          cmsEyebrow={cmsHero?.eyebrow || undefined}
          cmsHeadline={cmsHero?.headline || undefined}
          cmsSubheadline={cmsHero?.subheadline || undefined}
          cmsPrimaryCta={
            cmsHero?.primary_cta?.label
              ? { label: cmsHero.primary_cta.label, url: ctaHref(cmsHero.primary_cta) }
              : undefined
          }
          cmsSecondaryCta={
            cmsHero?.secondary_cta?.label
              ? { label: cmsHero.secondary_cta.label, url: ctaHref(cmsHero.secondary_cta) }
              : undefined
          }
        />
        <SolutionsZigzag cmsCards={cmsZigzagCards} />
        {cmsTestimonials.length > 0 && (
          <Testimonials title="A Snapshot of Real‑World Impact" cmsItems={cmsTestimonials} />
        )}
        {ctaData?.headline && (
          <CTABanner
            cmsHeadline={ctaData.headline}
            cmsSubhead={ctaData?.subhead || undefined}
            cmsPrimaryCta={ctaPrimary?.label ? { label: ctaPrimary.label, url: ctaHref(ctaPrimary) } : undefined}
            cmsSecondaryCta={ctaSecondary?.label ? { label: ctaSecondary.label, url: ctaHref(ctaSecondary) } : undefined}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
