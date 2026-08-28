import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/HeroV2";
import TrustedLogos from "@/components/sections/TrustedLogos";
import Stats from "@/components/sections/Stats";
import PainPoints from "@/components/sections/PainPoints";
import OnePlatform from "@/components/sections/OnePlatform";
import AISection from "@/components/sections/AISection";
import WorkEnvironments from "@/components/sections/WorkEnvironments";
import Testimonials from "@/components/sections/Testimonials";
import Blogs from "@/components/sections/Blogs";
import CTABanner from "@/components/sections/CTABanner";
import { getTestimonials, getClientLogos, getPage, getPageList } from "@/lib/api";
import { stripHtml, stripHtmlOpt, headingHtmlOpt } from "@/lib/text";
import { findBlock, normalizeArray, buildPageMap, resolveCta, mediaUrl } from "@/lib/blocks";
import { robotsFrom, seoExtras } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage("home");
  const meta = pageData?.data?.attributes?.meta;
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "EHSWatch - From Manual Chaos to Smart Safety",
    description:
      meta?.meta_description ||
      "AI-powered EHS platform to streamline reporting everywhere.",
  };
}

export default async function HomePage() {
  const [testimonialsRes, logosRes, homePageRes, pageListRes] = await Promise.all([
    getTestimonials(),
    getClientLogos(),
    getPage("home"),
    getPageList(),
  ]);
  const pageMap = buildPageMap(pageListRes?.data);
  // CMS page record must be published — drafts and missing records 404
  if (!homePageRes?.data) notFound();
  const cmsTestimonials = testimonialsRes?.data ?? [];
  const cmsLogos = logosRes?.data ?? [];
  const blocks = homePageRes?.data?.attributes?.content ?? [];

  // ── hero block ──────────────────────────────────────────────────────────────
  const heroBlock = findBlock<{
    headline?: string;
    subheadline?: string;
    eyebrow?: string;
    desktop_image?: unknown;
    mobile_image?: unknown;
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
    secondary_cta?: { label?: string; url?: string; type?: string; anchor?: string; video_url?: string; video_file?: { url?: string } | string | null };
    tertiary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(blocks, "hero");

  // Watch-Demo video popup: when the secondary CTA is a "video_popup", surface
  // its video URL so the hero opens a modal player instead of navigating.
  const heroSecondary = heroBlock?.secondary_cta;
  const heroVideoUrl =
    heroSecondary?.type === "video_popup"
      ? (heroSecondary.video_url ||
         (typeof heroSecondary.video_file === "string" ? heroSecondary.video_file : heroSecondary.video_file?.url) ||
         undefined)
      : undefined;

  // ── trusted_logos block (heading only; logos come from getClientLogos) ──────
  const trustedBlock = findBlock<{ heading?: string; subheading?: string }>(blocks, "trusted_logos");

  // ── testimonials block (section heading/subheading; items from getTestimonials) ──
  const testimonialsBlock = findBlock<{ heading?: string; subheading?: string; visible_count?: number | string | null }>(blocks, "testimonials");
  const testimonialsLimit = Number(testimonialsBlock?.visible_count) || undefined;
  const limitedTestimonials = testimonialsLimit ? cmsTestimonials.slice(0, testimonialsLimit) : cmsTestimonials;

  // ── stats_row block ─────────────────────────────────────────────────────────
  const statsBlock = findBlock<{
    items?: Array<{ label?: string; value?: string; suffix?: string | null }>;
  }>(blocks, "stats_row");

  // ── pain_points block ───────────────────────────────────────────────────────
  const painBlock = findBlock<{
    heading?: string;
    subheading?: string;
    items?: Array<{ label?: string; description?: string; icon?: string }>;
  }>(blocks, "pain_points");

  // ── image_text block (AI / IRIS section) ───────────────────────────────────
  const imageTextBlock = findBlock<{
    heading?: string;
    body?: string;
    eyebrow?: string;
    // CMS stores the CTA flat: { type, label, url | page_id | anchor } — resolve
    // it via the page map (page_id → path) like every other block CTA.
    cta?: { label?: string; url?: string; type?: string; page_id?: string; anchor?: string };
  }>(blocks, "image_text");
  const aiCta = resolveCta(imageTextBlock?.cta, pageMap);

  // ── solution_carousel block (WorkEnvironments) ──────────────────────────────
  const solutionBlock = findBlock<{
    heading?: string;
    subheading?: string;
    eyebrow?: string;
    description?: string;
    cta?: unknown;
    cards?: Record<string, { title?: string; subheading?: string; description?: string }> | Array<{ title?: string; subheading?: string; description?: string }>;
  }>(blocks, "solution_carousel");

  // Normalise solution cards (CMS sends them as a keyed object)
  const solutionCards = solutionBlock?.cards
    ? normalizeArray<{ title?: string; subheading?: string; description?: string; image?: { url?: string } | string | null; video?: { url?: string } | string | null }>(solutionBlock.cards).map(c => ({
        title:      stripHtml(c.title),
        subheading: stripHtml(c.subheading),
        description: stripHtml(c.description),
        image:      c.image      ?? null,
        video:      c.video      ?? null,
      }))
    : undefined;


  // ── tabs_carousel block (OnePlatform) ──────────────────────────────────────
  const tabsCarouselBlock = findBlock<{
    heading?: string;
    subheading?: string;
    tabs?: Record<string, { label?: string; title?: string; description?: string; cta?: { label?: string; url?: string } }> | Array<{ label?: string; title?: string; description?: string; cta?: { label?: string; url?: string } }>;
  }>(blocks, "tabs_carousel");

  const cmsPlatformTabs = tabsCarouselBlock?.tabs
    ? normalizeArray<{ label?: string; title?: string; description?: string; badge?: string | null; image?: { url?: string; attributes?: { url?: string } } | string | null; cta?: { label?: string; url?: string } }>(tabsCarouselBlock.tabs).map(t => ({
        label:       t.label       || "",
        title:       t.title       || "",
        description: t.description || "",
        badge:       t.badge       || null,
        cmsImage:    mediaUrl(t.image) || null,
        ctaLabel:    t.cta?.label  || "",
        ctaUrl:      resolveCta(t.cta, pageMap)?.url || "",
      }))
    : undefined;

  // ── blog_highlights block ───────────────────────────────────────────────────
  const blogBlock = findBlock<{
    heading?: string;
    subheading?: string;
    view_all_cta?: unknown;
    items?: Array<{
      slug?: string;
      title?: string;
      excerpt?: string;
      category?: string;
      published_at?: string;
      featured_image_url?: string | null;
    }>;
  }>(blocks, "blog_highlights");

  const cmsBlogPosts = blogBlock?.items
    ? blogBlock.items
        .filter((i) => !!i.slug && !!i.title)
        .map((i) => ({
          slug:              i.slug!,
          title:             stripHtml(i.title),
          excerpt:           stripHtmlOpt(i.excerpt),
          category:          i.category,
          published_at:      i.published_at,
          featured_image_url:i.featured_image_url,
        }))
    : undefined;

  // ── cta_banner block ────────────────────────────────────────────────────────
  const ctaBlock = findBlock<{
    headline?: string;
    subheadline?: string;
    subhead?: string;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "cta_banner");

  const ctaPrimary   = resolveCta(ctaBlock?.primary_cta, pageMap);
  const ctaSecondary = resolveCta(ctaBlock?.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero />
      <main>
        <Hero
          cmsHeadline={stripHtmlOpt(heroBlock?.headline)}
          cmsSubheadline={stripHtmlOpt(heroBlock?.subheadline)}
          cmsEyebrow={stripHtmlOpt(heroBlock?.eyebrow)}
          cmsPrimaryCta={resolveCta(heroBlock?.primary_cta, pageMap) ?? undefined}
          cmsSecondaryCta={resolveCta(heroBlock?.secondary_cta, pageMap) ?? undefined}
          cmsTertiaryCta={resolveCta(heroBlock?.tertiary_cta, pageMap) ?? undefined}
          cmsHeroVideoUrl={heroVideoUrl}
          cmsHeroImage={mediaUrl(heroBlock?.desktop_image)}
          cmsHeroImageMobile={mediaUrl(heroBlock?.mobile_image)}
        />
        {/* id=logos = target for the hero "Read More" anchor CTA (#logos) */}
        <div id="logos">
          <TrustedLogos
            cmsLogos={cmsLogos.length > 0 ? cmsLogos : undefined}
            cmsHeading={headingHtmlOpt(trustedBlock?.heading)}
          />
        </div>
        <Stats
          cmsItems={
            statsBlock?.items && statsBlock.items.length > 0
              ? statsBlock.items.map((item) => ({
                  label:  stripHtml(item.label),
                  value:  stripHtml(item.value) || "0",
                  suffix: item.suffix ?? null,
                }))
              : undefined
          }
        />
        <PainPoints
          cmsHeading={painBlock?.heading || undefined}
          cmsSubheading={painBlock?.subheading || undefined}
          cmsItems={
            painBlock?.items && painBlock.items.length > 0
              ? painBlock.items.map((item) => ({
                  label:       stripHtml(item.label),
                  description: stripHtml(item.description),
                  icon:        item.icon        || "",
                }))
              : undefined
          }
        />
        <OnePlatform
          cmsHeading={tabsCarouselBlock?.heading || undefined}
          cmsSubheading={tabsCarouselBlock?.subheading || undefined}
          cmsTabs={cmsPlatformTabs}
        />
        <AISection
          cmsHeading={imageTextBlock?.heading || undefined}
          cmsBody={imageTextBlock?.body || undefined}
          cmsCtaLabel={aiCta?.label || undefined}
          cmsCtaUrl={aiCta?.url || undefined}
        />
        <WorkEnvironments
          cmsHeading={solutionBlock?.heading || undefined}
          cmsSubheading={solutionBlock?.subheading || undefined}
          cmsEyebrow={stripHtmlOpt(solutionBlock?.eyebrow)}
          cmsCards={solutionCards}
          cmsCta={resolveCta(solutionBlock?.cta, pageMap) ?? undefined}
        />
        <Testimonials
          cmsItems={limitedTestimonials.length > 0 ? limitedTestimonials : undefined}
          title={headingHtmlOpt(testimonialsBlock?.heading)}
          subtitle={stripHtmlOpt(testimonialsBlock?.subheading) ?? ""}
        />
        <Blogs
          cmsHeading={blogBlock?.heading || undefined}
          cmsSubheading={blogBlock?.subheading || undefined}
          cmsPosts={cmsBlogPosts}
          cmsViewAllCta={resolveCta(blogBlock?.view_all_cta, pageMap) ?? undefined}
        />
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
