import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactPage from "@/components/sections/ContactPage";
import { getForm, getPage } from "@/lib/api";
import { findBlock, normalizeArray, ctaHref } from "@/lib/blocks";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("contact-us").catch(() => null);
  const meta = (pageRes?.data as any)?.attributes?.meta;
  return {
    title: meta?.meta_title || "Contact Us — EHSWatch",
    description:
      meta?.meta_description ||
      "Get in touch with the EHSWatch team for demos, onboarding support, or to find out how we can help your organisation.",
  };
}


export default async function ContactUsPage() {
  /* Step 1: fetch the page to read the CMS-configured form slug */
  const pageRes = await getPage("contact-us").catch(() => null);
  const blocks: any[] = (pageRes?.data as any)?.attributes?.content ?? [];

  /* ── hero block ── */
  const heroBlock = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: unknown;
  }>(blocks, "hero");

  const heroPrimaryCtaLabel = (heroBlock?.primary_cta as any)?.label as string | undefined;
  const heroPrimaryCtaHref  = heroBlock?.primary_cta ? ctaHref(heroBlock.primary_cta) : undefined;

  /* ── form_embed block — contains the form_slug the CMS admin chose ── */
  const formEmbed = findBlock<{
    heading?: string;
    subheading?: string;
    description?: string;
    form_slug?: string;
  }>(blocks, "form_embed");

  /* Step 2: fetch the form schema using the CMS-defined slug */
  const formSlug = formEmbed?.form_slug ?? "contact";
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
    link?: { link?: { label?: string; url?: string; type?: string } };
  }>(officesBlock?.items);

  const officeItems = rawItems.length > 0
    ? rawItems.map((item) => ({
        icon:        item.icon        ?? "building-office",
        title:       item.title       ?? "",
        description: item.description ?? null,
        linkLabel:   item.link?.link?.label ?? null,
        linkUrl:     item.link?.link?.url   ?? null,
        linkType:    item.link?.link?.type  ?? null,
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
      ctaLabel:  s.cta?.cta?.label ?? null,
      ctaUrl:    s.cta?.cta ? ctaHref(s.cta.cta) : null,
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
