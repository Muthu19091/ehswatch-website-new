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
import { getTestimonials, getClientLogos, getPage } from "@/lib/api";
import { stripHtml, stripHtmlOpt } from "@/lib/text";
import { findBlock, normalizeArray, ctaHref } from "@/lib/blocks";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [testimonialsRes, logosRes, homePageRes] = await Promise.all([
    getTestimonials(),
    getClientLogos(),
    getPage("home"),
  ]);
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
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
    secondary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(blocks, "hero");

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
    cta?: {
      cta?: { label?: string; url?: string; type?: string };
    };
  }>(blocks, "image_text");

  // ── solution_carousel block (WorkEnvironments) ──────────────────────────────
  const solutionBlock = findBlock<{
    heading?: string;
    subheading?: string;
    cards?: Record<string, { title?: string; subheading?: string; description?: string }> | Array<{ title?: string; subheading?: string; description?: string }>;
  }>(blocks, "solution_carousel");

  // Normalise solution cards (CMS sends them as a keyed object)
  const solutionCards = solutionBlock?.cards
    ? normalizeArray<{ title?: string; subheading?: string; description?: string; image?: { url?: string } | string | null }>(solutionBlock.cards).map(c => ({
        title:      stripHtml(c.title),
        subheading: stripHtml(c.subheading),
        description: stripHtml(c.description),
        image:      c.image      ?? null,
      }))
    : undefined;


  // ── tabs_carousel block (OnePlatform) ──────────────────────────────────────
  const tabsCarouselBlock = findBlock<{
    heading?: string;
    subheading?: string;
    tabs?: Record<string, { label?: string; title?: string; description?: string; cta?: { label?: string; url?: string } }> | Array<{ label?: string; title?: string; description?: string; cta?: { label?: string; url?: string } }>;
  }>(blocks, "tabs_carousel");

  const cmsPlatformTabs = tabsCarouselBlock?.tabs
    ? normalizeArray<{ label?: string; title?: string; description?: string; badge?: string | null; image?: string | null; cta?: { label?: string; url?: string } }>(tabsCarouselBlock.tabs).map(t => ({
        label:       t.label       || "",
        title:       t.title       || "",
        description: t.description || "",
        badge:       t.badge       || null,
        cmsImage:    t.image       || null,
        ctaLabel:    t.cta?.label  || "",
        ctaUrl:      t.cta?.url    || "#",
      }))
    : undefined;

  // ── blog_highlights block ───────────────────────────────────────────────────
  const blogBlock = findBlock<{
    heading?: string;
    subheading?: string;
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
    primary_cta?: {
      label?: string; url?: string; type?: string; anchor?: string;
      cta?: { label?: string; url?: string; type?: string; anchor?: string };
    };
    secondary_cta?: {
      label?: string; url?: string; type?: string; anchor?: string;
      cta?: { label?: string; url?: string; type?: string; anchor?: string };
    };
  }>(blocks, "cta_banner");

  // CTA banner uses a nested .cta shape in the API response
  const ctaPrimary   = ctaBlock?.primary_cta?.cta   ?? ctaBlock?.primary_cta;
  const ctaSecondary = ctaBlock?.secondary_cta?.cta  ?? ctaBlock?.secondary_cta;

  return (
    <>
      <Navbar lightHero />
      <main>
        <Hero
          cmsHeadline={heroBlock?.headline || undefined}
          cmsSubheadline={stripHtmlOpt(heroBlock?.subheadline)}
          cmsEyebrow={stripHtmlOpt(heroBlock?.eyebrow)}
          cmsPrimaryCta={
            heroBlock?.primary_cta?.label
              ? { label: heroBlock.primary_cta.label, url: ctaHref(heroBlock.primary_cta) }
              : undefined
          }
          cmsSecondaryCta={
            heroBlock?.secondary_cta?.label
              ? { label: heroBlock.secondary_cta.label, url: ctaHref(heroBlock.secondary_cta) }
              : undefined
          }
        />
        <TrustedLogos cmsLogos={cmsLogos.length > 0 ? cmsLogos : undefined} />
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
          cmsCtaLabel={imageTextBlock?.cta?.cta?.label || undefined}
          cmsCtaUrl={imageTextBlock?.cta?.cta?.url || undefined}
        />
        <WorkEnvironments
          cmsHeading={solutionBlock?.heading || undefined}
          cmsSubheading={solutionBlock?.subheading || undefined}
          cmsCards={solutionCards}
        />
        <Testimonials cmsItems={cmsTestimonials.length > 0 ? cmsTestimonials : undefined} />
        <Blogs
          cmsHeading={blogBlock?.heading || undefined}
          cmsSubheading={blogBlock?.subheading || undefined}
          cmsPosts={cmsBlogPosts}
        />
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
