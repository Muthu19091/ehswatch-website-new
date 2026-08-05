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

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("support").catch(() => null);
  const meta = (pageRes?.data as any)?.attributes?.meta;
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "Support — EHSWatch",
    description:
      meta?.meta_description ||
      "Get in touch with the EHSWatch team for demos, onboarding support, or to find out how we can help your organisation.",
  };
}


export default async function SupportPage() {
  /* The Support page reuses the Contact page design (ContactPage), driven by
     the CMS "support" page content. */
  const [pageRes, pageListRes] = await Promise.all([
    getPage("support").catch(() => null),
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

  /* ── form_embed block — contains the form_slug the CMS admin chose ── */
  const formEmbed = findBlock<{
    heading?: string;
    subheading?: string;
    description?: string;
    form_slug?: string;
  }>(blocks, "form_embed");

  /* Fetch the form schema using the CMS-defined slug */
  const formSlug = formEmbed?.form_slug ?? "support";
  /* null means the CMS form is disabled — ContactPage will hide the form */
  const formRes = await getForm(formSlug).catch(() => null);
  const formAttrs = formRes?.data?.attributes ?? null;

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
          heroEyebrow={heroBlock?.eyebrow || undefined}
          heroHeadline={heroBlock?.headline || undefined}
          heroSubheadline={heroBlock?.subheadline || undefined}
          heroPrimaryCtaLabel={heroPrimaryCtaLabel || undefined}
          heroPrimaryCtaHref={heroPrimaryCtaHref || undefined}
          formHeading={formEmbed?.heading || undefined}
          formSubheading={formEmbed?.subheading || undefined}
          formDescription={formEmbed?.description || undefined}
          officesHeading={officesBlock?.heading || undefined}
          officeItems={officeItems}
          sliderData={sliderData}
          galleryData={galleryData}
        />
      </main>
      <Footer />
    </>
  );
}
