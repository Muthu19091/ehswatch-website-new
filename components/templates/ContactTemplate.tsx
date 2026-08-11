import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import ContactPage from "@/components/sections/ContactPage";
import { getForm, getPage, getPageList } from "@/lib/api";
import { findBlock, normalizeArray, resolveHref, resolveCta, buildPageMap } from "@/lib/blocks";
import { stripHtmlOpt } from "@/lib/text";
import type { Metadata } from "next";
import { robotsFrom, seoExtras } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function contactMetadata(slug: string): Promise<Metadata> {
  const pageRes = await getPage(slug).catch(() => null);
  const meta = (pageRes?.data as any)?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "Contact Us — EHSWatch",
    description:
      meta?.meta_description ||
      "Get in touch with the EHSWatch team for demos, onboarding support, or to find out how we can help your organisation.",
  };
}


export default async function ContactTemplate({ slug }: { slug: string }) {
  /* The Contact-Us page (ContactPage design), driven by the CMS
     "contact-us" page content. /support redirects here. */
  const [pageRes, pageListRes] = await Promise.all([
    getPage(slug).catch(() => null),
    getPageList().catch(() => null),
  ]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  const blocks: any[] = (pageRes?.data as any)?.attributes?.content ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  /* ── hero block ── */
  const heroBlock = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: unknown;
  }>(blocks, "hero");

  const heroCta = resolveCta(heroBlock?.primary_cta, pageMap);
  const heroPrimaryCtaLabel = heroCta?.label;
  const heroPrimaryCtaHref  = heroCta?.url;

  /* ── form_embed block — the CMS admin picks which form(s) drive the tabs:
     form_slug = first/primary tab, form_slug_2 = optional second tab. ── */
  const formEmbed = findBlock<{
    heading?: string;
    subheading?: string;
    description?: string;
    form_slug?: string;
    form_slug_2?: string;
  }>(blocks, "form_embed");

  /* Tab slugs come from the CMS (form_slug, then form_slug_2), de-duped.
     Falls back to the legacy support+contact pair only if the CMS set neither. */
  const cmsTabSlugs = [formEmbed?.form_slug, formEmbed?.form_slug_2]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
  const tabSlugs = cmsTabSlugs.length ? cmsTabSlugs : ["support", "contact"];

  /* Fetch each configured form and build the tab list IN CMS ORDER.
     A slug that 404s (e.g. a soft-deleted form) is simply dropped. */
  const tabForms = await Promise.all(
    tabSlugs.map((slug) =>
      getForm(slug)
        .then((r) => ({ slug, attrs: r?.data?.attributes ?? null }))
        .catch(() => ({ slug, attrs: null })),
    ),
  );
  const tabLabel = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1);
  const formTabs = tabForms
    .filter((t) => t.attrs)
    .map((t) => ({ key: t.slug, label: (((t.attrs as any)?.name || "").trim() || tabLabel(t.slug)), slug: t.slug, formAttrs: t.attrs })) as
      { key: string; label: string; slug: string; formAttrs: any }[];

  /* First tab drives the layout + single-form fallback. */
  const formSlug = formTabs[0]?.slug ?? formEmbed?.form_slug ?? "contact";
  const formAttrs = formTabs[0]?.formAttrs ?? null;

  /* ── icon_features block (offices) ── */
  const officesBlock = findBlock<{
    heading?: string;
    items?: unknown;
  }>(blocks, "icon_features");

  const rawItems = normalizeArray<{
    icon?: string;
    title?: string;
    description?: string | null;
    link?: { label?: string; url?: string; type?: string; link?: { label?: string; url?: string; type?: string } };
  }>(officesBlock?.items);

  const officeItems = rawItems.length > 0
    ? rawItems.map((item) => ({
        icon:        item.icon        ?? "building-office",
        title:       item.title       ?? "",
        description: item.description ?? null,
        // API may serialize the link flat (link.label) or nested (link.link.label)
        linkLabel:   item.link?.link?.label ?? item.link?.label ?? null,
        linkUrl:     item.link?.link?.url   ?? item.link?.url   ?? null,
        linkType:    item.link?.link?.type  ?? item.link?.type  ?? null,
      }))
    : null;

  /* ── pain_points block → hero trust badges (icon + label) ── */
  const trustBlock = findBlock<{ items?: unknown }>(blocks, "pain_points");
  const trustBadges = normalizeArray<{ label?: string | null; icon?: string | null }>(trustBlock?.items)
    .map((b) => ({ label: (b.label ?? "").toString().trim(), icon: b.icon ?? null }))
    .filter((b) => b.label);

  /* ── slider block ── */
  const sliderBlock = findBlock<{
    heading?: string | null;
    subheading?: string | null;
    autoplay?: boolean;
    interval_ms?: number;
    loop?: boolean;
    show_arrows?: boolean;
    show_dots?: boolean;
    slides?: unknown;
  }>(blocks, "slider");

  const rawSlides = normalizeArray<{
    image?: { url?: string } | null;
    title?: string | null;
    caption?: string | null;
    cta?: { cta?: { label?: string | null; url?: string | null; type?: string | null; anchor?: string | null } } | null;
  }>(sliderBlock?.slides);

  const sliderSlides = rawSlides
    .filter((s) => s.image?.url)
    .map((s) => ({
      imageUrl:  s.image!.url!,
      title:     s.title ?? null,
      caption:   s.caption ?? null,
      ctaLabel:  stripHtmlOpt(s.cta?.cta?.label) ?? null,
      ctaUrl:    s.cta?.cta ? resolveHref(s.cta.cta, pageMap) : null,
    }));

  const sliderData = sliderSlides.length > 0
    ? {
        heading:    sliderBlock?.heading    ?? null,
        subheading: sliderBlock?.subheading ?? null,
        autoplay:   sliderBlock?.autoplay   ?? true,
        intervalMs: sliderBlock?.interval_ms ?? 5000,
        loop:       sliderBlock?.loop       ?? true,
        showArrows: sliderBlock?.show_arrows ?? true,
        showDots:   sliderBlock?.show_dots  ?? true,
        slides:     sliderSlides,
      }
    : null;

  /* ── image_gallery block ── */
  const galleryBlock = findBlock<{
    heading?: string | null;
    subheading?: string | null;
    enable_lightbox?: boolean;
    images?: unknown;
  }>(blocks, "image_gallery");

  const rawGalleryImages = normalizeArray<{
    image?: { url?: string } | null;
    caption?: string | null;
  }>(galleryBlock?.images);

  const galleryImages = rawGalleryImages
    .filter((img) => img.image?.url)
    .map((img) => ({
      imageUrl: img.image!.url!,
      caption:  img.caption ?? null,
    }));

  const galleryData = galleryImages.length > 0
    ? {
        heading:         galleryBlock?.heading    ?? null,
        subheading:      galleryBlock?.subheading ?? null,
        enableLightbox:  galleryBlock?.enable_lightbox ?? true,
        images:          galleryImages,
      }
    : null;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <ContactPage
          formAttrs={formAttrs}
          formSlug={formSlug}
          formTabs={formTabs}
          heroEyebrow={heroBlock?.eyebrow || undefined}
          heroHeadline={heroBlock?.headline || undefined}
          heroSubheadline={stripHtmlOpt(heroBlock?.subheadline) || undefined}
          heroPrimaryCtaLabel={heroPrimaryCtaLabel || undefined}
          heroPrimaryCtaHref={heroPrimaryCtaHref || undefined}
          formHeading={formEmbed?.heading || undefined}
          formSubheading={formEmbed?.subheading || undefined}
          formDescription={formEmbed?.description || undefined}
          officesHeading={officesBlock?.heading || undefined}
          officeItems={officeItems}
          trustBadges={trustBadges.length > 0 ? trustBadges : undefined}
          sliderData={sliderData}
          galleryData={galleryData}
        />
      </main>
      <Footer />
    </>
  );
}
