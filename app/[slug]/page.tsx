import { notFound } from "next/navigation";
import LegalPage, { legalMetadata } from "@/components/sections/LegalPage";
import { getPage } from "@/lib/api";

// Top-level catch-all so a page whose slug was renamed in the CMS still resolves
// instead of 404ing. Next.js always prefers the bespoke static routes (about,
// product, terms-of-service, …) over this dynamic segment, so only UNMATCHED
// top-level slugs land here. getPage() follows the CMS slug_history 301, so both
// the new slug and any old slug resolve. Rendered per-request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return legalMetadata(slug, "EHSWatch");
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await getPage(slug).catch(() => null);
  if (!res?.data?.attributes) notFound();
  return <LegalPage slug={slug} fallbackTitle="EHSWatch" />;
}
