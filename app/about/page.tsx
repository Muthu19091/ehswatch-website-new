import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import AboutStory from "@/components/sections/AboutStory";
import AboutDrives from "@/components/sections/AboutDrives";
import Stats from "@/components/sections/Stats";
import CTABanner from "@/components/sections/CTABanner";
import type { Metadata } from "next";
import { getPage } from "@/lib/api";
import { findBlock, findBlocks, normalizeArray, ctaHref } from "@/lib/blocks";
import { robotsFrom } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage("about");
  const meta = pageData?.data?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageData?.data) notFound();
  return {
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "About Us — EHSWatch",
    description:
      meta?.meta_description ||
      "Built to simplify EHSQ. Designed to protect. The intelligent safety platform trusted by 25K+ teams worldwide.",
  };
}

export default async function AboutPage() {
  const pageData = await getPage("about");
  // CMS page record must be published — drafts and missing records 404
  if (!pageData?.data) notFound();
  const blocks = pageData?.data?.attributes?.content ?? [];

  // ── hero block ──────────────────────────────────────────────────────────────
  const heroData = findBlock<{
    eyebrow?: string | null;
    headline?: string | null;
    subheadline?: string | null;
    primary_cta?: { label?: string | null; url?: string | null; anchor?: string | null; type?: string | null } | null;
  }>(blocks, "hero");

  const heroEyebrow = heroData?.eyebrow || undefined;
  const heroHeadline = heroData?.headline || undefined;
  const heroSubheadline = heroData?.subheadline || undefined;
  const heroCtaRaw = heroData?.primary_cta;
  const heroCtaLabel = heroCtaRaw?.label || undefined;
  const heroCtaUrl =
    (heroCtaRaw?.type === "anchor" ? heroCtaRaw?.anchor : heroCtaRaw?.url) || undefined;

  // ── image_text block (AboutStory) ───────────────────────────────────────────
  const imageTextData = findBlock<{
    heading?: string | null;
    body?: string | null;
  }>(blocks, "image_text");

  const storyHeading = imageTextData?.heading || undefined;
  const storyBody = imageTextData?.body || undefined;

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
    primary_cta?: {
      label?: string | null; url?: string | null; type?: string | null; anchor?: string | null;
      cta?: { label?: string | null; url?: string | null; type?: string | null; anchor?: string | null };
    } | null;
    secondary_cta?: {
      label?: string | null; url?: string | null; type?: string | null; anchor?: string | null;
      cta?: { label?: string | null; url?: string | null; type?: string | null; anchor?: string | null };
    } | null;
  }>(blocks, "cta_banner");

  const ctaPrimary = ctaBlock?.primary_cta?.cta ?? ctaBlock?.primary_cta;
  const ctaSecondary = ctaBlock?.secondary_cta?.cta ?? ctaBlock?.secondary_cta;

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
        />
        <AboutStory
          cmsHeading={storyHeading}
          cmsBody={storyBody}
        />
        <AboutDrives
          cmsHeading={drives?.heading}
          cmsSubheading={drives?.subheading}
          cmsItems={drives?.items}
        />
        <Stats cmsItems={statsItems} />
        {principles?.items && principles.items.length > 0 && (
          <AboutDrives
            cmsHeading={principles.heading}
            cmsSubheading={principles.subheading}
            cmsItems={principles.items}
          />
        )}
        <CTABanner
          cmsHeadline={ctaBlock?.headline || undefined}
          cmsSubhead={ctaBlock?.subheadline || ctaBlock?.subhead || undefined}
          cmsPrimaryCta={
            ctaPrimary?.label
              ? { label: ctaPrimary.label, url: ctaHref(ctaPrimary) }
              : undefined
          }
          cmsSecondaryCta={
            ctaSecondary?.label
              ? { label: ctaSecondary.label, url: ctaHref(ctaSecondary) }
              : undefined
          }
        />
      </main>
      <Footer />
    </>
  );
}
