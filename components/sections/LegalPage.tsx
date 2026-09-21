import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalPageHero, { heroHasMediaBackground, type HeroBlockData } from "@/components/sections/LegalPageHero";
import LegalPageRichText from "@/components/sections/LegalPageRichText";
import CTABanner from "@/components/sections/CTABanner";
import { getPage, getPageList } from "@/lib/api";
import { redirectIfMoved } from "@/lib/redirectMoved";
import { findBlock, buildPageMap, resolveCta } from "@/lib/blocks";
import { headingHtmlOpt, stripHtmlOpt } from "@/lib/text";
import { seoExtras, robotsFrom } from "@/lib/seo";

type RichTextBlockData = { heading?: string; subheading?: string; body?: string };
type CtaBannerBlockData = {
  headline?: string | null;
  subhead?: string | null;
  subheadline?: string | null;
  primary_cta?: unknown;
  secondary_cta?: unknown;
};

export async function legalMetadata(slug: string, fallbackTitle: string): Promise<Metadata> {
  const res = await getPage(slug);
  const attrs = res?.data?.attributes;
  return {
    ...seoExtras(attrs?.meta),
    robots: robotsFrom(attrs?.meta?.robots),
    title: attrs?.meta?.meta_title || `${attrs?.title || fallbackTitle} - EHSWatch`,
    description:
      attrs?.meta?.meta_description ||
      `${attrs?.title || fallbackTitle} for the EHSWatch platform and website.`,
  };
}

/**
 * Every field HeroBlock.php's "Background type" select actually offers
 * (image / slider / video_file / video_url / none) -- this generic
 * fallback template previously only read headline/subheadline, so an
 * admin-picked background never showed on any page without one of the
 * hand-designed bespoke templates (about/, pricing/, ...). Those
 * bespoke templates each have their own fixed hero design and don't
 * honour background_type either -- this IS the one place a new page's
 * actual background choice needs to render, since a brand-new page
 * has no bespoke design of its own.
 *
 * QC-caught live: this used to ALWAYS render hero first, then every
 * rich_text block's body merged into one combined section below it --
 * an admin who drag-reordered rich_text above hero in the CMS builder
 * (confirmed the BE stores and serves that exact order correctly, via
 * both a direct DB check and the real API response) saw zero change on
 * the live page, since the render order here was hardcoded and never
 * actually looked at content[]'s own order. Now walks blocks in the
 * order the CMS actually returns them, rendering each independently at
 * its own position -- a page with rich_text → hero → rich_text
 * genuinely renders in that order, three separate sections, not one
 * merged body block.
 */
export default async function LegalPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const [res, pageListRes] = await Promise.all([getPage(slug), getPageList()]);
  const attrs = res?.data?.attributes;
  if (!attrs) notFound();
  redirectIfMoved(slug, res);
  const pageMap = buildPageMap(pageListRes?.data);

  const blocks = attrs.content ?? [];
  const fallbackHeadline = attrs.title || fallbackTitle;
  const hasHeroBlock = findBlock(blocks, "hero") !== null;
  // Navbar's lightHero reflects whatever actually renders FIRST on the
  // page now that block order is admin-controlled, not "is there a
  // hero block somewhere" -- a dark-background hero reordered below a
  // rich_text block (white background) means the navbar sits over
  // white at the top regardless of the hero's own background.
  const firstBlock = blocks[0];
  const firstBlockIsMediaHero =
    firstBlock?.type === "hero" && heroHasMediaBackground(firstBlock.data as HeroBlockData);

  return (
    <>
      <Navbar lightHero={!firstBlockIsMediaHero} />
      <main>
        <style>{`
          .legal-body h1 { font-size: 1.85rem; font-weight: 700; color: #111827; margin: 0 0 1.1rem; line-height: 1.2; }
          .legal-body h2 { font-size: 1.45rem; font-weight: 700; color: #111827; margin: 2.4rem 0 0.9rem; }
          .legal-body h3 { font-size: 1.15rem; font-weight: 600; color: #111827; margin: 1.8rem 0 0.7rem; }
          .legal-body p { margin: 0 0 1.1rem; }
          .legal-body ul, .legal-body ol { margin: 0 0 1.1rem; padding-left: 1.5rem; }
          .legal-body ul { list-style: disc; }
          .legal-body ol { list-style: decimal; }
          .legal-body li { margin: 0.45rem 0; }
          .legal-body a { color: #FF6D00; text-decoration: underline; text-underline-offset: 2px; }
          .legal-body a:hover { color: #e05f00; }
          .legal-body strong { color: #111827; }
          .legal-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
          .legal-body table { display: block; overflow-x: auto; width: 100%; border-collapse: collapse; margin: 1.2rem 0; font-size: 0.95em; }
          .legal-body th, .legal-body td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
          .legal-body th { background: #f9fafb; font-weight: 600; color: #111827; }
          .legal-body code { background: #f3f4f6; color: #b34700; padding: 0.15rem 0.4rem; border-radius: 4px; font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 0.9em; }
          .legal-body pre { background: #111827; color: #e5e7eb; padding: 1rem 1.2rem; border-radius: 8px; margin: 1.2rem 0; overflow-x: auto; font-size: 0.875em; line-height: 1.6; }
          .legal-body pre code { background: none; color: inherit; padding: 0; }
        `}</style>

        {!hasHeroBlock && (
          <section className="pt-36 md:pt-44 pb-10 md:pb-14 bg-white border-b border-gray-100">
            <div className="max-w-[820px] mx-auto px-6">
              <h1 className="font-[family-name:var(--font-dm-sans)] text-[32px] md:text-[44px] font-bold leading-[1.15] text-[#111827]">
                {fallbackHeadline}
              </h1>
            </div>
          </section>
        )}

        {blocks.map((block, i) => {
          if (block.type === "hero") {
            return (
              <LegalPageHero
                key={i}
                hero={block.data as HeroBlockData}
                slug={slug}
                pageMap={pageMap}
                fallbackHeadline={fallbackHeadline}
              />
            );
          }
          if (block.type === "rich_text") {
            const rt = block.data as RichTextBlockData;
            return (
              <LegalPageRichText
                key={i}
                heading={headingHtmlOpt(rt.heading)}
                subheading={stripHtmlOpt(rt.subheading)}
                body={rt.body ?? ""}
              />
            );
          }
          if (block.type === "cta_banner") {
            // QC-caught live: cookie-policy has a real cta_banner block
            // an admin added (headline + primary CTA) that silently
            // never rendered -- this generic fallback only had
            // components for hero/rich_text. cta_banner is used on 7 of
            // the 8 bespoke templates, so it's a common block, not an
            // edge case; reuses the exact same CTABanner component and
            // resolveCta()/headingHtmlOpt()/stripHtmlOpt() resolution
            // AboutTemplate.tsx (etc.) already use, for consistency.
            const cta = block.data as CtaBannerBlockData;
            return (
              <CTABanner
                key={i}
                cmsHeadline={headingHtmlOpt(cta.headline)}
                cmsSubhead={stripHtmlOpt(cta.subhead || cta.subheadline)}
                cmsPrimaryCta={resolveCta(cta.primary_cta, pageMap) ?? undefined}
                cmsSecondaryCta={resolveCta(cta.secondary_cta, pageMap) ?? undefined}
              />
            );
          }
          // Any other block type: this generic fallback template only
          // has real components for hero/rich_text/cta_banner -- skip
          // rather than fail the page, same resilience convention used
          // everywhere else CMS content is walked.
          return null;
        })}
      </main>
      <Footer />
    </>
  );
}
