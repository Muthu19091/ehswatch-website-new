import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LegalPageHero, { heroHasMediaBackground, type HeroBlockData } from "@/components/sections/LegalPageHero";
import LegalPageRichText from "@/components/sections/LegalPageRichText";
import { getPage, getPageList } from "@/lib/api";
import { redirectIfMoved } from "@/lib/redirectMoved";
import { findBlock, buildPageMap } from "@/lib/blocks";
import { seoExtras, robotsFrom } from "@/lib/seo";

type RichTextBlockData = { body?: string };

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
            return <LegalPageRichText key={i} body={(block.data as RichTextBlockData).body ?? ""} />;
          }
          // Any other block type: this generic fallback template only
          // has real components for hero/rich_text -- skip rather than
          // fail the page, same resilience convention used everywhere
          // else CMS content is walked.
          return null;
        })}
      </main>
      <Footer />
    </>
  );
}
