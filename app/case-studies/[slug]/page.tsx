export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CaseStudyDetail from "@/components/sections/CaseStudyDetail";
import CTABanner from "@/components/sections/CTABanner";
import { getCaseStudy, getCaseStudies } from "@/lib/api";
import { notFound } from "next/navigation";
import { robotsFrom } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getCaseStudy(slug);
  const study = res?.data;
  return {
    robots: robotsFrom(study?.attributes.meta?.robots),
    title: study
      ? `${study.attributes.title} | EHSWatch`
      : "Case Study | EHSWatch",
    description:
      study?.attributes.meta?.meta_description ??
      study?.attributes.summary ??
      `EHSWatch case study — ${slug.replace(/-/g, " ")}.`,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [res, allRes] = await Promise.all([
    getCaseStudy(slug),
    getCaseStudies(),
  ]);

  const cmsStudy = res?.data;
  // Drafts and unknown slugs 404 — the public API only serves published studies
  if (!cmsStudy) notFound();
  const allSlugs = (allRes?.data ?? [])
    .sort(
      (a, b) =>
        new Date(b.attributes.published_at).getTime() -
        new Date(a.attributes.published_at).getTime(),
    )
    .map((s) => s.attributes.slug);

  return (
    <>
      <Navbar lightHero />
      <main>
        <CaseStudyDetail
          slug={slug}
          cmsStudy={cmsStudy}
          allSlugs={allSlugs.length > 0 ? allSlugs : undefined}
        />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
