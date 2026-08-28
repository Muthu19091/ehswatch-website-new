export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPost from "@/components/sections/BlogPost";
import { getBlogPost, getBlogPosts, getSettings } from "@/lib/api";
import { notFound } from "next/navigation";
import { robotsFrom, seoExtras } from "@/lib/seo";

// Slug-aware blog POST renderer. `slug` is the post; `listingSlug` is the blog
// listing's CURRENT slug so canonical / prev-next / JSON-LD URLs follow a
// renamed listing (e.g. /blogs/<post> after blog→blogs).
export async function blogPostMetadata(slug: string, listingSlug = "blog"): Promise<Metadata> {
  const [res, settingsRes] = await Promise.all([getBlogPost(slug), getSettings().catch(() => null)]);
  const post = res?.data;
  const meta = post?.attributes.meta;
  const seo = seoExtras(meta, "article") as Record<string, any>;
  const cBase = ((settingsRes?.data as any)?.seo?.canonical_base_url || "").replace(/\/+$/, "");
  if (!seo.alternates?.canonical && cBase) {
    seo.alternates = { ...(seo.alternates ?? {}), canonical: `${cBase}/${listingSlug}/${slug}` };
  }
  return {
    ...seo,
    robots: robotsFrom(meta?.robots),
    title:
      meta?.meta_title ||
      (post ? `${post.attributes.title} | EHSWatch` : `Blog | EHSWatch`),
    description:
      meta?.meta_description ||
      post?.attributes.excerpt ||
      `EHSWatch EHS insights - ${slug.replace(/-/g, " ")}.`,
  };
}

export default async function BlogPostTemplate({ slug, listingSlug = "blog" }: { slug: string; listingSlug?: string }) {
  const [res, allRes, settingsRes] = await Promise.all([
    getBlogPost(slug),
    getBlogPosts(),
    getSettings().catch(() => null),
  ]);
  const cmsPost = res?.data;
  if (!cmsPost) notFound();
  const a = cmsPost.attributes as any;
  const sBase = ((settingsRes?.data as any)?.seo?.canonical_base_url || "https://stage.odigma.ooo/ehswatch-stage").replace(/\/+$/, "");
  const cover = a.cover?.attributes?.url || a.cover?.url || undefined;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    ...(a.excerpt ? { description: a.excerpt } : {}),
    ...(cover ? { image: cover } : {}),
    ...(a.published_at ? { datePublished: a.published_at } : {}),
    ...(a.updated_at ? { dateModified: a.updated_at } : {}),
    author: { "@type": "Organization", name: (settingsRes?.data as any)?.brand?.name || "EHSWatch" },
    publisher: { "@type": "Organization", name: (settingsRes?.data as any)?.brand?.name || "EHSWatch" },
    mainEntityOfPage: `${sBase}/${listingSlug}/${slug}`,
    url: `${sBase}/${listingSlug}/${slug}`,
  };
  const cmsSlugs = (allRes?.data ?? [])
    .sort((a, b) => new Date(b.attributes.published_at).getTime() - new Date(a.attributes.published_at).getTime())
    .map((p) => p.attributes.slug);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Navbar lightHero />
      <main>
        <BlogPost slug={slug} cmsPost={cmsPost} cmsSlugs={cmsSlugs.length > 0 ? cmsSlugs : undefined} listingSlug={listingSlug} />
      </main>
      <Footer />
    </>
  );
}
