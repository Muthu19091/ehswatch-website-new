import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SolutionsHero from "@/components/sections/SolutionsHero";
import SolutionsZigzag from "@/components/sections/SolutionsZigzag";
import SolutionsCTA from "@/components/sections/SolutionsCTA";
import Testimonials from "@/components/sections/Testimonials";
import { getPage, getTestimonials } from "@/lib/api";
import { findBlock, ctaHref } from "@/lib/blocks";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Industries — EHSWatch",
  description: "Every industry has different risks. EHSWatch is configured to the compliance requirements, workflows and hazard profiles of your sector.",
};

export default async function IndustriesPage() {
  const [pageData, testimonialsRes] = await Promise.all([
    getPage("industries"),
    getTestimonials(),
  ]);

  const blocks: any[] = pageData?.data?.attributes?.content ?? [];
  const cmsTestimonials = testimonialsRes?.data ?? [];

  const cmsHero = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
    secondary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(blocks, "hero");

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <SolutionsHero
          cmsHeadline={cmsHero?.headline || undefined}
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
        <SolutionsZigzag />
        <Testimonials cmsItems={cmsTestimonials.length > 0 ? cmsTestimonials : undefined} />
        <SolutionsCTA />
      </main>
      <Footer />
    </>
  );
}
