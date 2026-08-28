import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPage } from "@/lib/api";
import { redirectIfMoved } from "@/lib/redirectMoved";
import { findBlock, findBlocks } from "@/lib/blocks";
import { stripHtml } from "@/lib/text";
import { seoExtras, robotsFrom } from "@/lib/seo";

type HeroBlock = { headline?: string; subheadline?: string };
type RichTextBlock = { body?: string };

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

export default async function LegalPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const res = await getPage(slug);
  const attrs = res?.data?.attributes;
  if (!attrs) notFound();
  redirectIfMoved(slug, res);

  const blocks = attrs.content ?? [];
  const hero = findBlock<HeroBlock>(blocks, "hero");
  const richBlocks = findBlocks<RichTextBlock>(blocks, "rich_text");

  const headline = hero?.headline?.trim() || attrs.title || fallbackTitle;
  const body = richBlocks.map((b) => b.body || "").join("\n");

  return (
    <>
      <Navbar lightHero />
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
          .legal-body table { width: 100%; border-collapse: collapse; margin: 1.2rem 0; font-size: 0.95em; }
          .legal-body th, .legal-body td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
          .legal-body th { background: #f9fafb; font-weight: 600; color: #111827; }
        `}</style>

        {/* Hero */}
        <section className="pt-36 md:pt-44 pb-10 md:pb-14 bg-white border-b border-gray-100">
          <div className="max-w-[820px] mx-auto px-6">
            <h1 className="font-[family-name:var(--font-dm-sans)] text-[32px] md:text-[44px] font-bold leading-[1.15] text-[#111827]">
              {headline}
            </h1>
            {(() => {
              const sub = stripHtml(hero?.subheadline);
              return sub ? (
              <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-relaxed text-[#6b7280]">
                {sub}
              </p>
              ) : null;
            })()}
          </div>
        </section>

        {/* Body */}
        <section className="py-12 md:py-16 bg-white">
          <div
            className="legal-body max-w-[820px] mx-auto px-6 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.8] text-[#374151]"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
