export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPage } from "@/lib/api";
import BlogPostTemplate, { blogPostMetadata } from "@/components/templates/BlogPostTemplate";

// The blog listing's CURRENT slug (follows a CMS rename); "blog" when unchanged.
async function listingSlug(): Promise<string> {
  const res = await getPage("blog").catch(() => null);
  return ((res?.data?.attributes as { slug?: string } | undefined)?.slug) || "blog";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return blogPostMetadata(slug, await listingSlug());
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ls = await listingSlug();
  // Listing renamed → move posts to the new base path too (/newslug/<post>).
  if (ls !== "blog") permanentRedirect(`/${ls}/${slug}`);
  return <BlogPostTemplate slug={slug} listingSlug="blog" />;
}
