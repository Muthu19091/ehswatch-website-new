import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import ProductHero from "@/components/sections/ProductHero";
import ProductOverview from "@/components/sections/ProductOverview";
import ProductHowItWorks from "@/components/sections/ProductHowItWorks";
import ProductModules from "@/components/sections/ProductModules";
import Stats from "@/components/sections/Stats";
import CTABanner from "@/components/sections/CTABanner";
import { getPage, getProductModules, getPageList } from "@/lib/api";
import { findBlock, normalizeArray, buildPageMap, resolveCta } from "@/lib/blocks";
import { stripHtmlOpt, headingHtmlOpt } from "@/lib/text";
import type { Metadata } from "next";
import { robotsFrom, seoExtras } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("product");
  const meta = pageRes?.data?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "Product — EHSWatch",
    description:
      meta?.meta_description ||
      "One Platform. Every EHSQ Process. From field incidents to board-level dashboards — all connected, all in real time.",
  };
}

export default async function ProductPage() {
  const [pageRes, modulesRes, pageListRes] = await Promise.all([
    getPage("product"),
    getProductModules(),
    getPageList(),
  ]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  const blocks = pageRes?.data?.attributes?.content ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

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
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: { label?: string; url?: string; type?: string; anchor?: string };
  }>(blocks, "hero");

  // ── image_text block (ProductOverview) ────────────────────────────────────
  const imageTextBlock = findBlock<{
    heading?: string;
    subheading?: string;
    body?: string;
    image?: { url?: string; alt?: string } | null;
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
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "cta_banner");

  const ctaPrimary = resolveCta(ctaBlock?.primary_cta, pageMap);
  const ctaSecondary = resolveCta(ctaBlock?.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <ProductHero
          cmsEyebrow={stripHtmlOpt(heroBlock?.eyebrow)}
          cmsHeadline={stripHtmlOpt(heroBlock?.headline)}
          cmsSubheadline={stripHtmlOpt(heroBlock?.subheadline)}
          cmsPrimaryCta={resolveCta(heroBlock?.primary_cta, pageMap) ?? undefined}
        />
        <ProductOverview
          cmsHeading={imageTextBlock?.heading || undefined}
          cmsSubheading={imageTextBlock?.subheading || undefined}
          cmsBody={imageTextBlock?.body || undefined}
          cmsImage={imageTextBlock?.image?.url ? { url: imageTextBlock.image.url, alt: imageTextBlock.image.alt } : undefined}
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
          cmsHeadline={headingHtmlOpt(ctaBlock?.headline)}
          cmsSubhead={stripHtmlOpt(ctaBlock?.subhead)}
          cmsPrimaryCta={ctaPrimary ?? undefined}
          cmsSecondaryCta={ctaSecondary ?? undefined}
        />
      </main>
      <Footer />
    </>
  );
}
