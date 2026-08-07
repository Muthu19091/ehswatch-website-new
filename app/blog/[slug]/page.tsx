export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPost from "@/components/sections/BlogPost";
import { getBlogPost, getBlogPosts, getSettings } from "@/lib/api";
import { notFound } from "next/navigation";
import { robotsFrom, seoExtras } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [res, settingsRes] = await Promise.all([getBlogPost(slug), getSettings().catch(() => null)]);
  const post = res?.data;
  // Prefer the post's SEO meta fields; fall back to title/excerpt.
  const meta = post?.attributes.meta;
  const seo = seoExtras(meta, "article") as Record<string, any>;
  // Emit a self-referential canonical when the CMS didn't set one.
  const cBase = ((settingsRes?.data as any)?.seo?.canonical_base_url || "").replace(/\/+$/, "");
  if (!seo.alternates?.canonical && cBase) {
    seo.alternates = { ...(seo.alternates ?? {}), canonical: `${cBase}/blog/${slug}` };
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
      `EHSWatch EHS insights — ${slug.replace(/-/g, " ")}.`,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [res, allRes, settingsRes] = await Promise.all([
    getBlogPost(slug),
    getBlogPosts(),
    getSettings().catch(() => null),
  ]);
  const cmsPost = res?.data;
  // Drafts and unknown slugs 404 — the public API only serves published posts
  if (!cmsPost) notFound();
  // BlogPosting structured data (JSON-LD) for the article.
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
    mainEntityOfPage: `${sBase}/blog/${slug}`,
    url: `${sBase}/blog/${slug}`,
  };
  // Sort all CMS posts newest-first so prev/next are chronologically adjacent
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
        <BlogPost slug={slug} cmsPost={cmsPost} cmsSlugs={cmsSlugs.length > 0 ? cmsSlugs : undefined} />
      </main>
      <Footer />
    </>
  );
}
