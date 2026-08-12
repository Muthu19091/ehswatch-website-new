export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPage } from "@/lib/api";
import CaseStudyDetailTemplate, { caseStudyDetailMetadata } from "@/components/templates/CaseStudyDetailTemplate";

// The case-studies listing's CURRENT slug (follows a CMS rename).
async function listingSlug(): Promise<string> {
  const res = await getPage("case-studies").catch(() => null);
  return ((res?.data?.attributes as { slug?: string } | undefined)?.slug) || "case-studies";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return caseStudyDetailMetadata(slug);
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ls = await listingSlug();
  if (ls !== "case-studies") permanentRedirect(`/${ls}/${slug}`);
  return <CaseStudyDetailTemplate slug={slug} listingSlug="case-studies" />;
}
