import type { ModuleTemplateProps, ModuleCta } from "@/components/sections/ModuleTemplate";
import type { CmsProductModule, CmsClientLogo } from "@/lib/types";
import { stripHtml, stripHtmlOpt } from "@/lib/text";
import { findBlock, normalizeArray, resolveCta as resolveCtaBlock, type PageMap } from "@/lib/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// Shared parser: CMS product-module content blocks → ModuleTemplate props.
// Used by the public /modules/[slug] route and the draft preview route.
// ─────────────────────────────────────────────────────────────────────────────

// FE-HO-12: curated hero-headline accent word per module (the substring rendered
// blue). Chosen for relevance rather than always the last word, which produced
// filler/punctuation highlights ("Again", "Life.", "Current"). Overridden by the
// CMS `headline_accent` field when an editor sets one; each value must be a
// substring of that module's headline or the FE falls back to the last word.
const HEADLINE_ACCENT: Record<string, string> = {
  "action-tracker": "Results",
  "incident-management": "Prevent",
  "risk-assessment": "Risk",
  "hse-observations": "Earlier",
  "audit-management": "Audit",
  "customer-complaints": "Resolution",
  "emergency-response-drills": "Real",
  "file-management": "Confidence",
  "inspections": "Intelligence",
  "legal-register": "Compliance",
  "management-of-change": "Change",
  "meetings-management": "Actions",
  "non-conformance": "Non-Conformance",
  "permit-to-work": "Permit to Work",
  "training-management": "Qualified",
};

interface CtaShape {
  label?: string | null;
  url?: string | null;
  type?: string | null;
  anchor?: string | null;
  cta?: { label?: string | null; url?: string | null; type?: string | null; anchor?: string | null };
}

function resolveCta(raw?: CtaShape | null, pageMap?: PageMap): ModuleCta | undefined {
  const c = resolveCtaBlock(raw, pageMap);
  return c ? { label: c.label, href: c.url, videoUrl: c.videoUrl } : undefined;
}

// BUG-199: normalize a CMS block `anchor` field into a bare DOM id (strip a
// leading "#", trim). Empty/absent → undefined so React omits the id attr.
const anchorId = (a?: string | null) => a ? (a.replace(/^#/, "").trim() || undefined) : undefined;

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
  poolLogos: CmsClientLogo[] = [],
): ModuleTemplateProps {
  const blocks = mod.content ?? [];
  const name = stripHtml(mod.name);

  const heroBlock = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    bold_tagline?: string;
    headline_accent?: string;
    primary_cta?: CtaShape;
    secondary_cta?: CtaShape;
    anchor?: string;
  }>(blocks, "hero");

  const hero: ModuleTemplateProps["hero"] = {
    eyebrow: stripHtmlOpt(heroBlock?.eyebrow),
    headline: stripHtml(heroBlock?.headline) || name,
    subheadline: stripHtmlOpt(heroBlock?.subheadline) || stripHtmlOpt(mod.tagline),
    boldTagline: stripHtmlOpt(heroBlock?.bold_tagline),
    // FE-HO-12: which word in the hero headline is highlighted blue. Prefer the
    // CMS `headline_accent` field (editor-chosen); otherwise use a curated,
    // meaning-based default per module so the highlight is purposeful rather
    // than always the (sometimes filler/punctuation) last word. Substring must
    // appear in the headline — the FE falls back to last-word if it doesn't.
    headlineAccent: stripHtmlOpt(heroBlock?.headline_accent) || HEADLINE_ACCENT[slug],
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
    anchor?: string;
  }>(blocks, "image_text");

  // "See … in Action" CTA. Always shown on the Why section: the label defaults
  // to "See {module} in Action" when the CMS has none (BUG-029), and the link
  // defaults to the contact page when the CMS has none or "#" (BUG-028) — so it
  // never renders as a dead link and every module's Why section gets a CTA.
  const whyCta = (() => {
    const c = resolveCta(imageTextBlock?.cta, pageMap);
    const label = (c?.label || "").trim() || `See ${name} in Action`;
    const href = c?.href && c.href !== "#" ? c.href : "/contact-us";
    return { label, href };
  })();

  const why: ModuleTemplateProps["why"] | undefined =
    imageTextBlock?.heading && imageTextBlock?.body
      ? {
          heading: stripHtml(imageTextBlock.heading),
          bodyHtml: imageTextBlock.body,
          imageUrl: imageTextBlock.image?.url || undefined,
          cta: whyCta,
        }
      : undefined;

  const iconFeaturesBlock = findBlock<{
    heading?: string;
    subheading?: string;
    items?: unknown;
    anchor?: string;
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
    anchor?: string;
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
    anchor?: string;
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
    secondary_cta?: CtaShape;
    anchor?: string;
  }>(blocks, "cta_banner");

  const finalCta: ModuleTemplateProps["finalCta"] | undefined = ctaBlock?.headline
    ? {
        headline: stripHtml(ctaBlock.headline),
        subhead: stripHtmlOpt(ctaBlock.subhead),
        // No hardcoded fallback — each CTA button only appears when the CMS
        // cta_banner actually has that CTA configured (label + link).
        cta: resolveCta(ctaBlock.primary_cta, pageMap),
        secondaryCta: resolveCta(ctaBlock.secondary_cta, pageMap),
      }
    : undefined;

  const modulesBlock = findBlock<{
    heading?: string;
    visible_count?: number;
    source?: string;
    curated_ids?: unknown;
    items?: unknown;
  }>(blocks, "product_modules");

  const hrefForModule = (s?: string) => (s === "iris" ? "/iris" : `/modules/${s ?? ""}`);

  // Curated related-modules: the CMS product_modules block stores the modules
  // chosen for THIS page in `curated_ids` (an ordered list of module ids).
  // Render exactly those — mapped to the active module records, in order,
  // excluding the current module. Any per-page custom copy in `items` (matched
  // by slug) overrides the module's own description. Only when the block has no
  // curated_ids do we fall back to auto-listing other active modules.
  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");

  type MoreCard = { name: string; slug: string; desc: string; icon: string | null; href: string };
  let otherModules: MoreCard[];

  if ((modulesBlock?.source ?? "").toLowerCase() === "inline") {
    // Inline source — each card's copy/icon/link is authored directly on this
    // page's block (includes a per-page contextual IRIS AI card). Self-contained,
    // so no lookup against the global module pool.
    otherModules = normalizeArray<{
      name?: string;
      tagline?: string;
      icon?: string | null;
      cta?: Parameters<typeof resolveCta>[0];
    }>(modulesBlock?.items)
      .filter((it) => stripHtmlOpt(it?.name))
      .map((it) => {
        const nm = stripHtml(it.name as string);
        // Resolve the card's CTA (url, or page_id→pageMap, e.g. IRIS AI → /iris).
        const resolved = resolveCta(it.cta, pageMap);
        const url = resolved?.href && resolved.href !== "#" ? resolved.href : undefined;
        return {
          name: nm,
          slug: slugify(nm),
          desc: stripHtml(it.tagline ?? ""),
          icon: it.icon ?? null,
          href: url || hrefForModule(slugify(nm)),
        };
      });
  } else {
    // Curated source — the block stores an ordered list of module ids in
    // `curated_ids`; render exactly those (excluding the current module), with
    // optional per-page description overrides from `items` (matched by slug).
    // No curated_ids → fall back to auto-listing other active modules.
    const curatedIds = normalizeArray<number | string>(modulesBlock?.curated_ids)
      .map((v) => Number(v))
      .filter((n) => Number.isFinite(n));

    const activeById = new Map(
      allModules
        .filter((m) => m.attributes.status === "active")
        .map((m) => [Number(m.id), m] as const),
    );

    const customDescBySlug = new Map(
      normalizeArray<{ slug?: string; description?: string }>(modulesBlock?.items)
        .filter((it) => it?.slug && stripHtmlOpt(it.description))
        .map((it) => [it.slug as string, stripHtml(it.description)] as const),
    );

    const toCard = (m: CmsProductModule): MoreCard => ({
      name: stripHtml(m.attributes.name),
      slug: m.attributes.slug,
      desc:
        customDescBySlug.get(m.attributes.slug) ||
        stripHtml(m.attributes.description) ||
        stripHtml(m.attributes.tagline),
      icon: m.attributes.icon ?? null,
      href: hrefForModule(m.attributes.slug),
    });

    const curatedModules = curatedIds
      .map((id) => activeById.get(id))
      .filter((m): m is CmsProductModule => !!m && m.attributes.slug !== slug)
      .map(toCard);

    otherModules = curatedModules.length > 0
      ? curatedModules
      : allModules
          .filter((m) => m.attributes.status === "active" && m.attributes.slug !== slug)
          .slice(0, typeof modulesBlock?.visible_count === "number" ? modulesBlock.visible_count : 5)
          .map(toCard);
  }

  // Respect the editor's visible_count on BOTH the curated and auto-listed sets
  // (curated was uncapped before, so "show 4" still rendered all 5).
  if (typeof modulesBlock?.visible_count === "number" && modulesBlock.visible_count > 0) {
    otherModules = otherModules.slice(0, modulesBlock.visible_count);
  }

  const moreModules: ModuleTemplateProps["moreModules"] | undefined =
    otherModules.length > 0
      ? {
          heading: stripHtml(modulesBlock?.heading) || "",
          linkText: stripHtmlOpt((modulesBlock as { link_text?: string })?.link_text) || undefined,
          modules: otherModules,
        }
      : undefined;

  // Client Strip (logo marquee) — sits above the FAQ on every module page.
  const clientStripBlock = findBlock<{ heading?: string; subheading?: string; items?: unknown }>(
    blocks,
    "trusted_logos",
  );
  const inlineLogos = normalizeArray<{ name?: string; logo_url?: string }>(clientStripBlock?.items)
    .filter((l) => stripHtmlOpt(l?.logo_url))
    .map((l) => ({ name: stripHtml(l.name ?? ""), url: l.logo_url as string }));
  // The CMS block uses source "pool_all": logos are not stored inline, they come
  // from the shared client-logo pool (the same one the home page renders). Fall
  // back to that pool whenever the block carries no inline items.
  const poolMapped = poolLogos
    .map((l) => ({ name: l.attributes.name, url: l.attributes.logo?.attributes?.url }))
    .filter((l): l is { name: string; url: string } => Boolean(l.url));
  // When the block's source is "pool_all" always render the LIVE shared pool so
  // new client-logo uploads reflect on EVERY module page. Some blocks also store
  // an inline SNAPSHOT of the pool — ignore it for pool_all (otherwise the page
  // shows a stale static copy). Only genuinely-inline blocks use their items.
  const logoSource = ((clientStripBlock as { source?: string })?.source ?? "").toLowerCase();
  const clientLogos = logoSource === "pool_all"
    ? poolMapped
    : (inlineLogos.length > 0 ? inlineLogos : poolMapped);
  const clientStrip: ModuleTemplateProps["clientStrip"] | undefined =
    clientStripBlock && clientLogos.length > 0
      ? {
          heading: stripHtml(clientStripBlock.heading) || "",
          subheading: stripHtmlOpt(clientStripBlock.subheading),
          logos: clientLogos,
        }
      : undefined;

  return {
    moduleName: name, hero, why, features, apart, faqs, clientStrip, finalCta, moreModules,
    // BUG-199: normalized section ids from each block's CMS `anchor` field so
    // anchor-type CTAs (#calculator, #faqs, #why, …) scroll to the right section.
    heroAnchor: anchorId(heroBlock?.anchor),
    whyAnchor: anchorId(imageTextBlock?.anchor),
    featuresAnchor: anchorId(iconFeaturesBlock?.anchor),
    apartAnchor: anchorId(richTextBlock?.anchor),
    faqsAnchor: anchorId(faqBlock?.anchor),
    finalCtaAnchor: anchorId(ctaBlock?.anchor),
  };
}
