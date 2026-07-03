import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import IrisPage from "@/components/sections/IrisPage";
import { getPage } from "@/lib/api";
import { findBlock, iconFeaturesToArray } from "@/lib/blocks";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage("iris");
  const meta = pageData?.data?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageData?.data) notFound();
  return {
    title: meta?.meta_title || "IRIS — AI-Powered EHSQ | EHSWatch",
    description:
      meta?.meta_description ||
      "Meet IRIS, EHSWatch's Intelligent Risk & Insight System. Six AI capabilities embedded across your EHSQ workflows.",
  };
}

export default async function IrisPageRoute() {
  const pageData = await getPage("iris");
  const blocks: Array<{ type: string; data: Record<string, unknown> }> =
    (pageData?.data?.attributes?.content as Array<{ type: string; data: Record<string, unknown> }>) ?? [];

  const cmsHero         = findBlock<{ eyebrow?: string; headline?: string; subheadline?: string; primary_cta?: unknown; secondary_cta?: unknown }>(blocks, "hero") ?? undefined;
  const cmsTextCta      = findBlock<{ heading?: string; subheading?: string; cta?: unknown }>(blocks, "text_cta") ?? undefined;
  const cmsIconFeatures = findBlock<{ heading?: string; subheading?: string; items?: Record<string, unknown> }>(blocks, "icon_features");
  const cmsProblems     = iconFeaturesToArray(cmsIconFeatures?.items);
  const cmsNumberSteps  = findBlock<{ heading?: string; subheading?: string; steps?: unknown }>(blocks, "number_steps");
  const rawSteps        = cmsNumberSteps?.steps;
  const cmsCapabilities = rawSteps
    ? (Array.isArray(rawSteps) ? rawSteps : Object.values(rawSteps as Record<string, unknown>))
    : undefined;
  const cmsCtaBanner    = findBlock<{ headline?: string; subhead?: string; primary_cta?: unknown; secondary_cta?: unknown }>(blocks, "cta_banner") ?? undefined;

  return (
    <>
      <Navbar lightHero />
      <main>
        <IrisPage
          cmsHero={cmsHero}
          cmsTextCta={cmsTextCta}
          cmsProblems={cmsProblems.length > 0 ? cmsProblems : undefined}
          cmsProblemsHeading={cmsIconFeatures?.heading || undefined}
          cmsProblemsSubheading={cmsIconFeatures?.subheading || undefined}
          cmsCapabilities={cmsCapabilities && cmsCapabilities.length > 0 ? cmsCapabilities as Array<{ title?: string; description?: string; eyebrow?: string; sub_items?: unknown[] }> : undefined}
          cmsStepsHeading={cmsNumberSteps?.heading || undefined}
          cmsStepsSubheading={cmsNumberSteps?.subheading || undefined}
          cmsCtaBanner={cmsCtaBanner}
        />
      </main>
      <Footer />
    </>
  );
}
