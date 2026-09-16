import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CmsPageContent from "@/components/sections/cms/CmsPageContent";
import { getPage, getPageIdSlugMap, getPageSlugs, mediaAlt, mediaUrl, type PageSectionBlock } from "@/lib/cms";

/**
 * Navbar's `lightHero` prop switches its logo/text between white (for
 * a dark hero background) and dark (for a light one) — every existing
 * bespoke route (about/, product/, pricing/, even the homepage) passes
 * this explicitly, matching its own Hero's background. A page built
 * from the CMS's Hero block can genuinely have either: `background_type`
 * "image"/"slider"/"video_file"/"video_url" imply a dark photo/video
 * behind the text (dark navbar text there would be near-invisible),
 * while "none" (the common case today — 5 of 7 real pages) is a plain
 * white hero, same as About/Product/Pricing's own. Doesn't verify the
 * referenced media actually resolved (e.g. "image" selected but
 * nothing uploaded, which CmsHero itself falls back to white for) —
 * a real but rare misconfiguration this simpler check won't catch.
 */
function isLightHero(content: PageSectionBlock[] | null | undefined): boolean {
  const first = Array.isArray(content) ? content[0] : null;
  if (!first || first.type !== "hero") return true;

  const backgroundType = first.data?.background_type;
  return !["image", "slider", "video_file", "video_url"].includes(String(backgroundType));
}

/**
 * Generic renderer for any CMS Page that doesn't already have its own
 * bespoke route (about/, pricing/, product/, …). Built for the new
 * "Create page from template" admin flow — previously a brand-new
 * page created in the CMS had no way to appear on the live site at
 * all; a developer had to hand-build a whole new route + components
 * for it.
 *
 * This project builds with `output: "export"` (next.config.ts), which
 * makes `dynamicParams` unsupported — every path must be enumerated
 * by generateStaticParams() at build time. So a page created in the
 * CMS still needs a rebuild + redeploy to go live (same as blog posts
 * today) — what this removes is having to write new page-specific
 * React/JSX for it. Section types without a registered component
 * (components/sections/cms/registry.tsx) render nothing rather than
 * fail the build; extend the registry as more block types get a real
 * FE component.
 */

// Slugs already served by their own hand-built route — must be
// excluded here or the static export would try to emit the same
// output path twice and fail the build. "home" is excluded because
// the CMS's "home" page is served by app/page.tsx (the root), not a
// /home/ path. "404" is excluded because app/not-found.tsx already
// fetches and renders the CMS's "404" page itself, client-side.
// "api" guards against an admin ever naming a page "api", which would
// otherwise collide with the whole app/api/ route-handlers directory.
const RESERVED_SLUGS = new Set([
  "home",
  "404",
  "api",
  "about",
  "blog",
  "case-studies",
  "contact-us",
  "home-v2",
  "iris",
  "modules",
  "pricing",
  "product",
  "search",
  "solutions",
  "solutions-v2",
  "support",
]);

export async function generateStaticParams() {
  const slugs = await getPageSlugs();
  return slugs.filter((slug) => !RESERVED_SLUGS.has(slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  const { title, meta } = page.attributes;
  const ogImageUrl = mediaUrl(meta.og_image);
  const resolvedTitle = meta.meta_title || `${title} | EHSWatch`;

  return {
    title: resolvedTitle,
    description: meta.meta_description || undefined,
    alternates: meta.canonical_url ? { canonical: meta.canonical_url } : undefined,
    robots: meta.robots || undefined,
    openGraph: ogImageUrl
      ? {
          title: resolvedTitle,
          description: meta.meta_description || undefined,
          images: [{ url: ogImageUrl, alt: mediaAlt(meta.og_image, resolvedTitle) }],
        }
      : undefined,
    twitter: ogImageUrl
      ? {
          card: "summary_large_image",
          title: resolvedTitle,
          description: meta.meta_description || undefined,
          images: [ogImageUrl],
        }
      : undefined,
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Belt-and-braces: RESERVED_SLUGS already keeps generateStaticParams
  // from emitting these, but guards a direct/renamed-route edge case
  // from silently double-rendering a page that has its own bespoke route.
  if (RESERVED_SLUGS.has(slug)) notFound();

  const [page, pageMap] = await Promise.all([getPage(slug), getPageIdSlugMap()]);
  if (!page || page.attributes.status !== "active") notFound();

  return (
    <>
      {/* PageResource.php's own docblock: "Frontend embeds the returned
          array as <script type='application/ld+json'> on each page" —
          BreadcrumbList always, FAQPage auto-added when the content has
          a faq_accordion block, plus any admin-pasted custom JSON-LD. */}
      {(page.attributes.structured_data ?? []).map((entry, i) => (
        // A JSON-LD string value containing the literal text `</script>`
        // would otherwise close this tag early and let raw markup
        // through — escape `<` so that can't happen, standard practice
        // for embedding JSON inside a <script> tag.
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, "\\u003c") }}
        />
      ))}
      <Navbar lightHero={isLightHero(page.attributes.content)} />
      <main className="bg-white">
        <CmsPageContent content={page.attributes.content} pageMap={pageMap} />
      </main>
      <Footer />
    </>
  );
}
