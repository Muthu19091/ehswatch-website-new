import type { ModuleTemplateProps, ModuleCta } from "@/components/sections/ModuleTemplate";
import type { CmsProductModule } from "@/lib/types";
import { stripHtml, stripHtmlOpt } from "@/lib/text";
import { findBlock, normalizeArray, resolveCta as resolveCtaBlock, type PageMap } from "@/lib/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// Shared parser: CMS product-module content blocks → ModuleTemplate props.
// Used by the public /modules/[slug] route and the draft preview route.
// ─────────────────────────────────────────────────────────────────────────────

interface CtaShape {
  label?: string | null;
  url?: string | null;
  type?: string | null;
  anchor?: string | null;
  cta?: { label?: string | null; url?: string | null; type?: string | null; anchor?: string | null };
}

function resolveCta(raw?: CtaShape | null, pageMap?: PageMap): ModuleCta | undefined {
  const c = resolveCtaBlock(raw, pageMap);
  return c ? { label: c.label, href: c.url } : undefined;
}

// Pull each <li> out of a rich_text body, keeping inline formatting
// (links, bold, emphasis) so hyperlinks entered in the CMS survive.
// Block-level wrappers (Tiptap nests <p> inside <li>) are unwrapped so
// the item renders correctly inside a <p>.
function parseListItems(html: string): string[] {
  const items: string[] = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const inner = m[1]
      .replace(/<\/?(p|div|h[1-6])[^>]*>/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Only keep items that carry actual visible text
    if (inner.replace(/<[^>]+>/g, "").trim()) items.push(inner);
  }
  return items;
}

export function buildModuleTemplateProps(
  mod: CmsProductModule["attributes"],
  slug: string,
  allModules: CmsProductModule[],
  pageMap?: PageMap,
): ModuleTemplateProps {
  const blocks = mod.content ?? [];
  const name = stripHtml(mod.name);

  const heroBlock = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: CtaShape;
    secondary_cta?: CtaShape;
  }>(blocks, "hero");

  const hero: ModuleTemplateProps["hero"] = {
    eyebrow: stripHtmlOpt(heroBlock?.eyebrow),
    headline: stripHtml(heroBlock?.headline) || name,
    subheadline: stripHtmlOpt(heroBlock?.subheadline) || stripHtmlOpt(mod.tagline),
    // CMS-only: no hardcoded default — the banner button appears only when the
    // CMS hero block has a configured CTA (label + link).
    primaryCta: resolveCta(heroBlock?.primary_cta, pageMap),
    secondaryCta: resolveCta(heroBlock?.secondary_cta, pageMap),
  };

  const imageTextBlock = findBlock<{
    heading?: string;
    body?: string;
    image?: { url?: string } | null;
    cta?: CtaShape;
  }>(blocks, "image_text");

  const why: ModuleTemplateProps["why"] | undefined =
    imageTextBlock?.heading && imageTextBlock?.body
      ? {
          heading: stripHtml(imageTextBlock.heading),
          bodyHtml: imageTextBlock.body,
          imageUrl: imageTextBlock.image?.url || undefined,
          cta: resolveCta(imageTextBlock.cta, pageMap),
        }
      : undefined;

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
      title: stripHtml(i.title),
      description: stripHtml(i.description),
    }));

  const features: ModuleTemplateProps["features"] | undefined =
    featureItems.length > 0
      ? {
          heading: stripHtml(iconFeaturesBlock?.heading) || "",
          subheading: stripHtmlOpt(iconFeaturesBlock?.subheading),
          items: featureItems,
        }
      : undefined;

  const richTextBlock = findBlock<{
    heading?: string;
    body?: string;
  }>(blocks, "rich_text");

  // The rich_text block feeds the "What Sets … Apart" section. A bullet
  // list renders as the check-marked grid (preserving inline links); any
  // other rich content (paragraphs, headings, links) is rendered as HTML
  // instead of being dropped.
  const richBody = (richTextBlock?.body ?? "").trim();
  const apartItems = richBody ? parseListItems(richBody) : [];
  // If the body is essentially just a bullet list, keep the designed
  // check-marked grid. If it also carries paragraphs/headings/other text,
  // render the full HTML so nothing is dropped.
  const nonListText = richBody
    .replace(/<[uo]l[\s\S]*?<\/[uo]l>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
  const useGrid = apartItems.length > 0 && nonListText.length === 0;
  const apart: ModuleTemplateProps["apart"] | undefined = richBody
    ? {
        heading: stripHtml(richTextBlock?.heading) || "",
        items: useGrid ? apartItems : [],
        bodyHtml: richBody,
      }
    : undefined;

  const faqBlock = findBlock<{
    heading?: string;
    items?: unknown;
  }>(blocks, "faq_accordion");

  const faqItems = normalizeArray<{ question?: string; answer?: string }>(faqBlock?.items)
    .filter((f) => !!f.question && !!f.answer)
    .map((f) => ({ question: stripHtml(f.question), answer: f.answer! }));

  const faqs: ModuleTemplateProps["faqs"] | undefined =
    faqItems.length > 0
      ? { heading: stripHtml(faqBlock?.heading) || "", items: faqItems }
      : undefined;

  const ctaBlock = findBlock<{
    headline?: string;
    subhead?: string;
    primary_cta?: CtaShape;
  }>(blocks, "cta_banner");

  const finalCta: ModuleTemplateProps["finalCta"] | undefined = ctaBlock?.headline
    ? {
        headline: stripHtml(ctaBlock.headline),
        subhead: stripHtmlOpt(ctaBlock.subhead),
        // No hardcoded fallback — the CTA button only appears when the CMS
        // cta_banner actually has a configured CTA (label + link).
        cta: resolveCta(ctaBlock.primary_cta, pageMap),
      }
    : undefined;

  const modulesBlock = findBlock<{
    heading?: string;
    visible_count?: number;
    items?: unknown;
  }>(blocks, "product_modules");

  // Curated related-modules: when the block's items carry per-page custom
  // descriptions, render exactly those (order, copy and links from the CMS).
  // Otherwise fall back to auto-listing other active modules with their global
  // description. A slug of "iris" links to the IRIS page, not a module page.
  const curatedItems = normalizeArray<{
    slug?: string;
    name?: string;
    tagline?: string;
    description?: string;
    icon?: string;
  }>(modulesBlock?.items).filter((it) => it?.name && stripHtmlOpt(it.description));

  const hrefForModule = (s?: string) => (s === "iris" ? "/iris" : `/modules/${s ?? ""}`);

  const otherModules = curatedItems.length > 0
    ? curatedItems.map((it) => ({
        name: stripHtml(it.name),
        slug: it.slug ?? "",
        desc: stripHtml(it.description),
        icon: it.icon ?? null,
        href: hrefForModule(it.slug),
      }))
    : allModules
        .filter((m) => m.attributes.status === "active" && m.attributes.slug !== slug)
        .slice(0, modulesBlock?.visible_count || 5)
        .map((m) => ({
          name: stripHtml(m.attributes.name),
          slug: m.attributes.slug,
          desc: stripHtml(m.attributes.description) || stripHtml(m.attributes.tagline),
          icon: m.attributes.icon ?? null,
          href: hrefForModule(m.attributes.slug),
        }));

  const moreModules: ModuleTemplateProps["moreModules"] | undefined =
    otherModules.length > 0
      ? {
          heading: stripHtml(modulesBlock?.heading) || "",
          modules: otherModules,
        }
      : undefined;

  return { moduleName: name, hero, why, features, apart, faqs, finalCta, moreModules };
}
