import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductHero from "@/components/sections/ProductHero";
import ProductOverview from "@/components/sections/ProductOverview";
import ProductHowItWorks from "@/components/sections/ProductHowItWorks";
import ProductModules from "@/components/sections/ProductModules";
import Stats from "@/components/sections/Stats";
import CTABanner from "@/components/sections/CTABanner";
import { getPage, getProductModules } from "@/lib/api";
import { findBlock, normalizeArray, ctaHref } from "@/lib/blocks";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("product");
  const meta = pageRes?.data?.attributes?.meta;
  return {
    title: meta?.meta_title || "Product — EHSWatch",
    description:
      meta?.meta_description ||
      "One Platform. Every EHSQ Process. From field incidents to board-level dashboards — all connected, all in real time.",
  };
}

export default async function ProductPage() {
  const [pageRes, modulesRes] = await Promise.all([
    getPage("product"),
    getProductModules(),
  ]);
  const blocks = pageRes?.data?.attributes?.content ?? [];

  // ── product modules from the dedicated CMS collection ─────────────────────
  const cmsModules = (modulesRes?.data ?? [])
    .filter((m) => m.attributes.status === "active")
    .map((m) => ({
      name: (m.attributes.name || "").trim(),
      slug: m.attributes.slug,
      desc: m.attributes.description || m.attributes.tagline || "",
      icon: m.attributes.icon ?? null,
    }));

  // ── hero block ─────────────────────────────────────────────────────────────
  const heroBlock = findBlock<{
    headline?: string;
    subheadline?: string;
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(blocks, "hero");

  // ── image_text block (ProductOverview) ────────────────────────────────────
  const imageTextBlock = findBlock<{
    heading?: string;
    subheading?: string;
    body?: string;
  }>(blocks, "image_text");

  // ── number_steps block (ProductHowItWorks) ────────────────────────────────
  const numberStepsBlock = findBlock<{
    heading?: string;
    subheading?: string;
    steps?: unknown;
  }>(blocks, "number_steps");

  const rawSteps = normalizeArray<{
    eyebrow?: string;
    title?: string;
    description?: string;
    icon?: string;
    image?: { url?: string } | null;
    sub_items?: Array<{ icon?: string; title?: string; description?: string }>;
  }>(numberStepsBlock?.steps);

  // ── product_modules block ─────────────────────────────────────────────────
  const productModulesBlock = findBlock<{
    heading?: string;
    subheading?: string;
    visible_count?: number;
  }>(blocks, "product_modules");

  // ── stats_row block ───────────────────────────────────────────────────────
  const statsBlock = findBlock<{
    items?: unknown;
  }>(blocks, "stats_row");

  const statsRawItems = normalizeArray<{
    value?: string | null;
    suffix?: string | null;
    label?: string | null;
  }>(statsBlock?.items);
  const statsItems =
    statsRawItems.length > 0
      ? statsRawItems.map((item) => ({
          value: item.value || "0",
          suffix: item.suffix || null,
          label: item.label || "",
        }))
      : undefined;

  // ── cta_banner block ──────────────────────────────────────────────────────
  const ctaBlock = findBlock<{
    headline?: string;
    subhead?: string;
    primary_cta?: Record<string, unknown>;
    secondary_cta?: Record<string, unknown>;
  }>(blocks, "cta_banner");

  // Resolve nested CTA structure from CMS (primary_cta.cta or primary_cta directly)
  const ctaPrimaryRaw = ctaBlock?.primary_cta as Record<string, unknown> | undefined;
  const ctaPrimaryResolved =
    (ctaPrimaryRaw?.cta as Record<string, unknown> | undefined) || ctaPrimaryRaw;

  const ctaSecondaryRaw = ctaBlock?.secondary_cta as Record<string, unknown> | undefined;
  const ctaSecondaryResolved =
    (ctaSecondaryRaw?.secondary_cta as Record<string, unknown> | undefined) || ctaSecondaryRaw;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <ProductHero
          cmsHeadline={heroBlock?.headline || undefined}
          cmsSubheadline={heroBlock?.subheadline || undefined}
          cmsPrimaryCta={
            heroBlock?.primary_cta?.label
              ? { label: heroBlock.primary_cta.label, url: ctaHref(heroBlock.primary_cta) }
              : undefined
          }
        />
        <ProductOverview
          cmsHeading={imageTextBlock?.heading || undefined}
          cmsSubheading={imageTextBlock?.subheading || undefined}
          cmsBody={imageTextBlock?.body || undefined}
        />
        <Stats cmsItems={statsItems} />
        <ProductHowItWorks
          cmsHeading={numberStepsBlock?.heading || undefined}
          cmsSubheading={numberStepsBlock?.subheading || undefined}
          cmsSteps={rawSteps.length > 0 ? rawSteps : undefined}
        />
        <ProductModules
          cmsHeading={productModulesBlock?.heading || undefined}
          cmsSubheading={productModulesBlock?.subheading || undefined}
          cmsModules={cmsModules.length > 0 ? cmsModules : undefined}
        />
        <CTABanner
          cmsHeadline={ctaBlock?.headline || undefined}
          cmsSubhead={ctaBlock?.subhead || undefined}
          cmsPrimaryCta={
            ctaPrimaryResolved && (ctaPrimaryResolved.label as string)
              ? { label: ctaPrimaryResolved.label as string, url: ctaHref(ctaPrimaryResolved) }
              : undefined
          }
          cmsSecondaryCta={
            ctaSecondaryResolved && (ctaSecondaryResolved.label as string)
              ? { label: ctaSecondaryResolved.label as string, url: ctaHref(ctaSecondaryResolved) }
              : undefined
          }
        />
      </main>
      <Footer />
    </>
  );
}
