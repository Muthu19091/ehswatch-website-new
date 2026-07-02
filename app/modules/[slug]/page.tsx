export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ModuleTemplate, { type ModuleTemplateProps, type ModuleCta } from "@/components/sections/ModuleTemplate";
import { getProductModule, getProductModules } from "@/lib/api";
import { findBlock, normalizeArray, ctaHref } from "@/lib/blocks";

interface CtaShape {
  label?: string | null;
  url?: string | null;
  type?: string | null;
  anchor?: string | null;
  cta?: { label?: string | null; url?: string | null; type?: string | null; anchor?: string | null };
}

function resolveCta(raw?: CtaShape | null): ModuleCta | undefined {
  const cta = raw?.cta?.label ? raw.cta : raw;
  if (!cta?.label) return undefined;
  return { label: cta.label, href: ctaHref(cta) };
}

// Pull the text of each <li> out of a rich_text body
function parseListItems(html: string): string[] {
  const items: string[] = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) items.push(text);
  }
  return items;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductModule(slug);
  const mod = res?.data?.attributes;
  if (!mod) return { title: "Module | EHSWatch" };
  return {
    title: mod.meta?.meta_title || `${mod.name.trim()} | EHSWatch`,
    description: mod.meta?.meta_description || mod.tagline || mod.description || undefined,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [res, allRes] = await Promise.all([
    getProductModule(slug),
    getProductModules(),
  ]);

  const mod = res?.data?.attributes;
  if (!mod || mod.status !== "active") notFound();

  const blocks = mod.content ?? [];
  const name = mod.name.trim();

  // ── hero ───────────────────────────────────────────────────────────────────
  const heroBlock = findBlock<{
    headline?: string;
    subheadline?: string;
    primary_cta?: CtaShape;
    secondary_cta?: CtaShape;
  }>(blocks, "hero");

  const hero: ModuleTemplateProps["hero"] = {
    headline: heroBlock?.headline?.trim() || name,
    subheadline: heroBlock?.subheadline?.trim() || mod.tagline || undefined,
    primaryCta: resolveCta(heroBlock?.primary_cta) ?? { label: "Book a Demo", href: "/contact-us" },
    secondaryCta: resolveCta(heroBlock?.secondary_cta),
  };

  // ── why (image_text) ───────────────────────────────────────────────────────
  const imageTextBlock = findBlock<{
    heading?: string;
    body?: string;
    image?: { url?: string } | null;
    cta?: CtaShape;
  }>(blocks, "image_text");

  const why: ModuleTemplateProps["why"] | undefined =
    imageTextBlock?.heading && imageTextBlock?.body
      ? {
          heading: imageTextBlock.heading.trim(),
          bodyHtml: imageTextBlock.body,
          imageUrl: imageTextBlock.image?.url || undefined,
          cta: resolveCta(imageTextBlock.cta),
        }
      : undefined;

  // ── key features (icon_features) ───────────────────────────────────────────
  const iconFeaturesBlock = findBlock<{
    heading?: string;
    subheading?: string;
    items?: unknown;
  }>(blocks, "icon_features");

  const featureItems = normalizeArray<{
    icon?: string | null;
    title?: string;
    description?: string;
  }>(iconFeaturesBlock?.items)
    .filter((i) => !!i.title)
    .map((i) => ({
      icon: i.icon ?? null,
      title: i.title!,
      description: i.description || "",
    }));

  const features: ModuleTemplateProps["features"] | undefined =
    featureItems.length > 0
      ? {
          heading: iconFeaturesBlock?.heading?.trim() || `Key Features of ${name}`,
          subheading: iconFeaturesBlock?.subheading?.trim() || undefined,
          items: featureItems,
        }
      : undefined;

  // ── what sets it apart (rich_text) ─────────────────────────────────────────
  const richTextBlock = findBlock<{
    heading?: string;
    body?: string;
  }>(blocks, "rich_text");

  const apartItems = richTextBlock?.body ? parseListItems(richTextBlock.body) : [];
  const apart: ModuleTemplateProps["apart"] | undefined =
    apartItems.length > 0
      ? {
          heading: richTextBlock?.heading?.trim() || `What Sets EHSWatch ${name} Apart`,
          items: apartItems,
        }
      : undefined;

  // ── faq_accordion ──────────────────────────────────────────────────────────
  const faqBlock = findBlock<{
    heading?: string;
    items?: unknown;
  }>(blocks, "faq_accordion");

  const faqItems = normalizeArray<{ question?: string; answer?: string }>(faqBlock?.items)
    .filter((f) => !!f.question && !!f.answer)
    .map((f) => ({ question: f.question!, answer: f.answer! }));

  const faqs: ModuleTemplateProps["faqs"] | undefined =
    faqItems.length > 0
      ? { heading: faqBlock?.heading?.trim() || "Frequently Asked Questions", items: faqItems }
      : undefined;

  // ── final cta_banner ───────────────────────────────────────────────────────
  const ctaBlock = findBlock<{
    headline?: string;
    subhead?: string;
    primary_cta?: CtaShape;
  }>(blocks, "cta_banner");

  const finalCta: ModuleTemplateProps["finalCta"] | undefined = ctaBlock?.headline
    ? {
        headline: ctaBlock.headline.trim(),
        subhead: ctaBlock.subhead?.trim() || undefined,
        cta: resolveCta(ctaBlock.primary_cta) ?? { label: "Book a Demo", href: "/contact-us" },
      }
    : undefined;

  // ── explore more modules (product_modules) ─────────────────────────────────
  const modulesBlock = findBlock<{
    heading?: string;
    visible_count?: number;
  }>(blocks, "product_modules");

  const otherModules = (allRes?.data ?? [])
    .filter((m) => m.attributes.status === "active" && m.attributes.slug !== slug)
    .slice(0, modulesBlock?.visible_count || 5)
    .map((m) => ({
      name: m.attributes.name.trim(),
      slug: m.attributes.slug,
      desc: m.attributes.description || m.attributes.tagline || "",
      icon: m.attributes.icon ?? null,
    }));

  const moreModules: ModuleTemplateProps["moreModules"] | undefined =
    otherModules.length > 0
      ? {
          heading: modulesBlock?.heading?.trim() || "Explore More EHSWatch Modules",
          modules: otherModules,
        }
      : undefined;

  return (
    <>
      <Navbar lightHero />
      <main>
        <ModuleTemplate
          moduleName={name}
          hero={hero}
          why={why}
          features={features}
          apart={apart}
          faqs={faqs}
          finalCta={finalCta}
          moreModules={moreModules}
        />
      </main>
      <Footer />
    </>
  );
}
