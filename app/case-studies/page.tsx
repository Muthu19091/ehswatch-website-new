import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CaseStudiesHero from "@/components/sections/CaseStudiesHero";
import CaseStudiesGrid from "@/components/sections/CaseStudiesGrid";
import CTABanner from "@/components/sections/CTABanner";
import { getPage, getCaseStudies } from "@/lib/api";
import { findBlock, resolveHref } from "@/lib/blocks";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("case-studies");
  const meta = (pageRes?.data as any)?.attributes?.meta;
  return {
    title: meta?.meta_title || "Case Studies — EHSWatch",
    description:
      meta?.meta_description ||
      "See how EHSQ teams across construction, energy, manufacturing and logistics use EHSWatch to cut reporting time, accelerate audits and gain full visibility into risk.",
  };
}

export default async function CaseStudiesPage() {
  const [pageRes, caseStudiesRes] = await Promise.all([
    getPage("case-studies"),
    getCaseStudies(),
  ]);

  const blocks = (pageRes?.data as any)?.attributes?.content ?? [];

  const heroBlock = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(blocks, "hero");

  const ctaBlock = findBlock<{
    headline?: string;
    subhead?: string;
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(blocks, "cta_banner");

  const cmsItems = caseStudiesRes?.data ?? [];

  const ctaPrimaryHref = ctaBlock?.primary_cta ? resolveHref(ctaBlock.primary_cta) : undefined;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <CaseStudiesHero
          cmsHeadline={heroBlock?.headline || undefined}
          cmsSubheadline={heroBlock?.subheadline || undefined}
        />
        <CaseStudiesGrid cmsStudies={cmsItems.length > 0 ? cmsItems : undefined} />
        <CTABanner
          cmsHeadline={ctaBlock?.headline || undefined}
          cmsSubhead={ctaBlock?.subhead || undefined}
          cmsPrimaryCta={
            ctaBlock?.primary_cta?.label
              ? { label: ctaBlock.primary_cta.label, url: ctaPrimaryHref || "#" }
              : undefined
          }
        />
      </main>
      <Footer />
    </>
  );
}
