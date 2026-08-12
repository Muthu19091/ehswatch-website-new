export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";
import { getCaseStudy, getCaseStudies, getProductModules } from "@/lib/api";
import { notFound } from "next/navigation";
import { robotsFrom, seoExtras } from "@/lib/seo";

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
  const [res, allRes, modulesRes] = await Promise.all([
    getCaseStudy(slug),
    getCaseStudies(),
    getProductModules(),
  ]);
  const cmsStudy = res?.data;
  if (!cmsStudy) notFound();
  const pms = (cmsStudy.attributes as {
    product_modules_section?: { source?: string; heading?: string; curated_ids?: number[]; visible_count?: number | null };
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
      if (typeof pms.visible_count === "number" && pms.visible_count > 0) {
        applications = applications.slice(0, pms.visible_count);
      }
    }
  }

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
          listingSlug={listingSlug}
        />
      </main>
      <Footer />
    </>
  );
}
