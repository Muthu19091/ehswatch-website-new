import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import AboutStory from "@/components/sections/AboutStory";
import AboutDrives from "@/components/sections/AboutDrives";
import Stats from "@/components/sections/Stats";
import CTABanner from "@/components/sections/CTABanner";
import type { Metadata } from "next";
import { getPage, getPageList } from "@/lib/api";
import { redirectIfMoved } from "@/lib/redirectMoved";
import { findBlock, findBlocks, normalizeArray, buildPageMap, resolveCta } from "@/lib/blocks";
import { stripHtmlOpt, headingHtmlOpt, richHtml } from "@/lib/text";
import { robotsFrom, seoExtras } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function aboutMetadata(slug: string): Promise<Metadata> {
  const pageData = await getPage(slug);
  const meta = pageData?.data?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageData?.data) notFound();
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "About Us - EHSWatch",
    description:
      meta?.meta_description ||
      "Built to simplify EHSQ. Designed to protect. The intelligent safety platform trusted by 25K+ teams worldwide.",
  };
}

export default async function AboutTemplate({ slug }: { slug: string }) {
  const [pageData, pageListRes] = await Promise.all([getPage(slug), getPageList()]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageData?.data) notFound();
  redirectIfMoved(slug, pageData);
  const blocks = pageData?.data?.attributes?.content ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  // ── hero block ──────────────────────────────────────────────────────────────
  const heroData = findBlock<{
    eyebrow?: string | null;
    headline?: string | null;
    subheadline?: string | null;
    primary_cta?: { label?: string | null; url?: string | null; anchor?: string | null; type?: string | null } | null;
  }>(blocks, "hero");

  const heroEyebrow = heroData?.eyebrow || undefined;
  const heroHeadline = heroData?.headline || undefined;
  const heroSubheadline = stripHtmlOpt(heroData?.subheadline);
  // Resolve the hero CTA through resolveCta so Page (page_id) links work too —
  // the old anchor/url-only extraction dropped internal Page links (no href →
  // button hidden). pageMap is built above from getPageList.
  const heroCta = resolveCta(heroData?.primary_cta, pageMap);
  const heroCtaLabel = heroCta?.label || undefined;
  const heroCtaUrl = heroCta?.url || undefined;
  // Video popup: when the hero CTA is a "video_popup", surface its video URL
  // so the button opens a modal player instead of navigating (like the home hero).
  const heroPrimaryRaw = heroData?.primary_cta as
    | { type?: string | null; video_url?: string | null; video_file?: { url?: string } | string | null }
    | null
    | undefined;
  const heroVideoUrl =
    heroPrimaryRaw?.type === "video_popup"
      ? heroPrimaryRaw.video_url ||
        (typeof heroPrimaryRaw.video_file === "string"
          ? heroPrimaryRaw.video_file
          : heroPrimaryRaw.video_file?.url) ||
        undefined
      : undefined;

  // ── image_text block (AboutStory) ───────────────────────────────────────────
  const imageTextData = findBlock<{
    heading?: string | null;
    subheading?: string | null;
    body?: string | null;
    image?: { url?: string | null } | string | null;
  }>(blocks, "image_text");

  const storyHeading = imageTextData?.heading || undefined;
  const storySubheading = stripHtmlOpt(imageTextData?.subheading);
  const storyBody = richHtml(imageTextData?.body) || undefined;
  const storyImage =
    (typeof imageTextData?.image === "string"
      ? imageTextData.image
      : imageTextData?.image?.url) || undefined;

  // ── icon_features blocks ────────────────────────────────────────────────────
  // [0] "Purpose Behind Every Feature" (Mission / Vision cards)
  // [1] "What drives us" (principles) — rendered after Stats, matching CMS order
  const iconFeaturesAll = findBlocks<{
    heading?: string | null;
    subheading?: string | null;
    items?: unknown;
  }>(blocks, "icon_features");

  const parseDrives = (block: (typeof iconFeaturesAll)[number] | null | undefined) => {
    if (!block) return null;
    const rawItems = normalizeArray<{
      title?: string | null;
      description?: string | null;
      icon?: string | null;
    }>(block.items);
    return {
      heading: block.heading || undefined,
      subheading: block.subheading || undefined,
      items:
        rawItems.length > 0
          ? rawItems.map((item) => ({
              title: item.title || "",
              description: item.description || "",
              icon: item.icon ?? null,
            }))
          : undefined,
    };
  };

  const drives = parseDrives(iconFeaturesAll[0]);
  const principles = parseDrives(iconFeaturesAll[1]);

  // ── stats_row block ─────────────────────────────────────────────────────────
  const statsData = findBlock<{
    heading?: string | null;
    items?: unknown;
  }>(blocks, "stats_row");

  const statsRawItems = normalizeArray<{
    value?: string | null;
    suffix?: string | null;
    label?: string | null;
  }>(statsData?.items);
  const statsItems =
    statsRawItems.length > 0
      ? statsRawItems.map((item) => ({
          value: item.value || "0",
          suffix: item.suffix || null,
          label: item.label || "",
        }))
      : undefined;

  // ── cta_banner block ────────────────────────────────────────────────────────
  const ctaBlock = findBlock<{
    headline?: string | null;
    subheadline?: string | null;
    subhead?: string | null;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "cta_banner");

  const ctaPrimary = resolveCta(ctaBlock?.primary_cta, pageMap);
  const ctaSecondary = resolveCta(ctaBlock?.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <AboutHero
          cmsEyebrow={heroEyebrow}
          cmsHeadline={heroHeadline}
          cmsSubheadline={heroSubheadline}
          cmsPrimaryCtaLabel={heroCtaLabel}
          cmsPrimaryCtaUrl={heroCtaUrl}
          cmsHeroVideoUrl={heroVideoUrl}
        />
        <AboutStory
          cmsHeading={storyHeading}
          cmsSubheading={storySubheading}
          cmsBody={storyBody}
          cmsImage={storyImage}
        />
        <AboutDrives
          cmsHeading={drives?.heading}
          cmsSubheading={drives?.subheading}
          cmsItems={drives?.items}
        />
        <Stats cmsItems={statsItems} cmsHeading={headingHtmlOpt(statsData?.heading)} />
        {principles?.items && principles.items.length > 0 && (
          <AboutDrives
            cmsHeading={principles.heading}
            cmsSubheading={principles.subheading}
            cmsItems={principles.items}
          />
        )}
        <CTABanner
          cmsHeadline={headingHtmlOpt(ctaBlock?.headline)}
          cmsSubhead={stripHtmlOpt(ctaBlock?.subhead || ctaBlock?.subheadline)}
          cmsPrimaryCta={ctaPrimary ?? undefined}
          cmsSecondaryCta={ctaSecondary ?? undefined}
        />
      </main>
      <Footer />
    </>
  );
}
