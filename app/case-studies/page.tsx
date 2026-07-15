import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import CaseStudiesHero from "@/components/sections/CaseStudiesHero";
import CaseStudiesGrid from "@/components/sections/CaseStudiesGrid";
import CTABanner from "@/components/sections/CTABanner";
import { getPage, getCaseStudies, getPageList } from "@/lib/api";
import { findBlock, buildPageMap, resolveCta } from "@/lib/blocks";
import { stripHtmlOpt } from "@/lib/text";
import type { Metadata } from "next";
import { robotsFrom } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("case-studies");
  const meta = (pageRes?.data as any)?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  return {
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
          cmsHeadline={stripHtmlOpt(heroBlock?.headline)}
          cmsSubheadline={stripHtmlOpt(heroBlock?.subheadline)}
          cmsPrimaryCta={resolveCta(heroBlock?.primary_cta, pageMap) ?? undefined}
          cmsSecondaryCta={resolveCta(heroBlock?.secondary_cta, pageMap) ?? undefined}
        />
        <CaseStudiesGrid cmsStudies={cmsItems.length > 0 ? cmsItems : undefined} />
        <CTABanner
          cmsHeadline={stripHtmlOpt(ctaBlock?.headline)}
          cmsSubhead={stripHtmlOpt(ctaBlock?.subhead)}
          cmsPrimaryCta={ctaPrimary ?? undefined}
          cmsSecondaryCta={ctaSecondary ?? undefined}
        />
      </main>
      <Footer />
    </>
  );
}
