import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTABanner from "@/components/sections/CTABanner";
import HeroDotBackground from "@/components/ui/HeroDotBackground";
import Link from "next/link";
import { connection } from "next/server";
import { getPage, getPageList } from "@/lib/api";
import { findBlock, buildPageMap, resolveCta } from "@/lib/blocks";
import { stripHtmlOpt, headingHtmlOpt } from "@/lib/text";
import type { Metadata } from "next";
import { robotsFrom, seoExtras } from "@/lib/seo";

// Custom 404 — renders the CMS "404" page (slug "404") content, so editors
// control the not-found copy/CTAs. Falls back to sensible defaults if the CMS
// page is unavailable. Next.js serves this with a 404 status automatically.
// SEO for the 404 is CMS-driven too: title/description/keywords/canonical/og
// come from the "404" page record; a 404 defaults to noindex unless the CMS
// robots field explicitly overrides it. Runs per-request (route is dynamic).
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage("404").catch(() => null);
  const attrs = pageData?.data?.attributes as { meta?: Parameters<typeof seoExtras>[0]; title?: string } | undefined;
  const meta = attrs?.meta;
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots) ?? { index: false, follow: false },
    title: meta?.meta_title || attrs?.title || "Page Not Found — EHSWatch",
    description:
      meta?.meta_description ||
      "The page you\u2019re looking for may have been moved or no longer exists.",
  };
}

// Render per-request so editors' CMS "404" page edits reflect without a rebuild.
// not-found.tsx ignores `export const dynamic`, so connection() below is what
// actually opts this route out of static prerendering; the export documents intent.
export const dynamic = "force-dynamic";

export default async function NotFound() {
  await connection(); // opt out of build-time prerender
  const [pageRes, pageListRes] = await Promise.all([
    getPage("404").catch(() => null),
    getPageList().catch(() => null),
  ]);
  const blocks: any[] = (pageRes?.data as any)?.attributes?.content ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  const hero = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "hero");

  const eyebrow = hero?.eyebrow?.trim() || "404";
  const headline = hero?.headline?.trim() || "We couldn't find that page";
  const subheadline =
    stripHtmlOpt(hero?.subheadline) ||
    "The link you followed may be broken, or the page may have been moved.";
  const cta = resolveCta(hero?.primary_cta, pageMap) ?? { label: "Back to home", url: "/" };
  const secondaryCta = resolveCta(hero?.secondary_cta, pageMap);

  const ctaBlock = findBlock<{
    headline?: string;
    subheadline?: string;
    subhead?: string;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "cta_banner");
  const bannerPrimary = resolveCta(ctaBlock?.primary_cta, pageMap);
  const bannerSecondary = resolveCta(ctaBlock?.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero />
      <main>
        <section className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[140px] pb-[80px] min-h-[68vh]">
          <HeroDotBackground />
          <div className="relative z-20 max-w-[640px] w-full mx-auto text-center flex flex-col items-center gap-5">
            <span className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
              {eyebrow}
            </span>
            <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[52px] leading-[1.08] text-gray-900 tracking-[-0.03em]">
              {headline}
            </h1>
            <p className="font-[family-name:var(--font-dm-sans)] text-[16px] text-gray-600 leading-[1.75] max-w-[460px] text-pretty">
              {subheadline}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={cta.url || "/"}
              className="inline-flex items-center gap-2 px-8 py-[12px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white hover:shadow-lg transition-shadow"
              style={{ backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)" }}
            >
              {cta.label || "Back to home"}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            {secondaryCta?.url && (
              <Link
                href={secondaryCta.url}
                className="inline-flex items-center gap-2 px-8 py-[12px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-[#1b1b1b] bg-white border border-[#d5d9e2] hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition-colors"
              >
                {secondaryCta.label}
              </Link>
            )}
            </div>
          </div>
        </section>
        {ctaBlock?.headline && (
          <CTABanner
            cmsHeadline={headingHtmlOpt(ctaBlock.headline)}
            cmsSubhead={stripHtmlOpt(ctaBlock.subheadline || ctaBlock.subhead)}
            cmsPrimaryCta={bannerPrimary ?? undefined}
            cmsSecondaryCta={bannerSecondary ?? undefined}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
