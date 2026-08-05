import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import PricingHero from "@/components/sections/PricingHero";
import PricingOverview from "@/components/sections/PricingOverview";
import PricingCalculator from "@/components/sections/PricingCalculator";
import PricingFAQ from "@/components/sections/PricingFAQ";
import CTABanner from "@/components/sections/CTABanner";
import { getPage, getForm, getPageList } from "@/lib/api";
import { stripHtml, stripHtmlOpt, headingHtmlOpt } from "@/lib/text";
import { findBlock, normalizeArray, buildPageMap, resolveCta } from "@/lib/blocks";
import type { Metadata } from "next";
import { robotsFrom, seoExtras } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage("pricing").catch(() => null);
  const attrs = (pageData?.data as any)?.attributes ?? {};
  // CMS page record must be published — drafts and missing records 404
  if (!pageData?.data) notFound();
  return {
    ...seoExtras(attrs.meta),
    robots: robotsFrom(attrs.meta?.robots),
    title: attrs.meta?.meta_title || "Pricing — EHSWatch",
    description: attrs.meta?.meta_description || "Simple, flexible pricing for enterprise-grade EHS management. Pay only for the modules you need.",
  };
}

export default async function PricingPage() {
  const [pageData, pageListRes] = await Promise.all([getPage("pricing"), getPageList()]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageData?.data) notFound();
  const blocks: any[] = pageData?.data?.attributes?.content ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  // ── hero block ──────────────────────────────────────────────────────────────
  const heroBlock = findBlock<{
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: { label?: string; anchor?: string; url?: string };
    secondary_cta?: { label?: string; url?: string };
  }>(blocks, "hero");

  // CMS-only: labels come solely from the CMS (buttons hide when absent). The
  // hrefs keep functional defaults so a CMS-configured button still targets the
  // calculator when no explicit link is set.
  const heroEyebrow       = heroBlock?.eyebrow || undefined;
  const heroHeadline      = heroBlock?.headline || undefined;
  const heroSubheadline   = heroBlock?.subheadline || undefined;
  // Resolve hero CTAs through resolveCta so Page (page_id) links work — the
  // old url/anchor-only reads dropped internal Page links (e.g. the secondary
  // "Book a Demo" → button hidden). Primary still defaults to the on-page
  // calculator anchor when no link is configured.
  const primaryCtaResolved   = resolveCta(heroBlock?.primary_cta, pageMap);
  const secondaryCtaResolved = resolveCta(heroBlock?.secondary_cta, pageMap);
  const primaryCtaLabel   = primaryCtaResolved?.label || undefined;
  const primaryCtaHref    = primaryCtaResolved && primaryCtaResolved.url !== "#" ? primaryCtaResolved.url : "#calculator";
  const secondaryCtaLabel = secondaryCtaResolved?.label || undefined;
  const secondaryCtaHref  = secondaryCtaResolved?.url || undefined;

  // ── text_checklist block ────────────────────────────────────────────────────
  const overviewBlock = findBlock<{
    heading?: string;
    body?: string;
    checklist_heading?: string;
    checklist_items?: Record<string, { text?: string }> | Array<{ text?: string }>;
  }>(blocks, "text_checklist");

  const overviewHeading          = headingHtmlOpt(overviewBlock?.heading);
  const overviewBody             = overviewBlock?.body || undefined;
  const overviewChecklistHeading = overviewBlock?.checklist_heading || undefined;
  const rawChecklistItems        = overviewBlock?.checklist_items;
  const overviewChecklistItems: Array<{ icon?: string; text: string }> = rawChecklistItems
    ? normalizeArray<{ icon?: string; text?: string }>(rawChecklistItems)
        .filter((item) => item?.text)
        .map((item) => ({ icon: item.icon || undefined, text: item.text! }))
    : [];

  // ── faq_accordion block ─────────────────────────────────────────────────────
  const faqBlock = findBlock<{
    heading?: string;
    items?: Record<string, { question?: string; answer?: string }> | Array<{ question?: string; answer?: string }>;
  }>(blocks, "faq_accordion");

  const faqHeading  = headingHtmlOpt(faqBlock?.heading);
  const rawFaqItems = faqBlock?.items;
  const faqItems: Array<{ question: string; answer: string }> = rawFaqItems
    ? normalizeArray<{ question?: string; answer?: string }>(rawFaqItems)
        .filter((item) => item?.question)
        .map((item) => ({ question: stripHtml(item.question), answer: item.answer || "" }))
    : [];

  // ── form_embed block (pricing wizard) ────────────────────────────────────────
  const formEmbedBlock = findBlock<{
    heading?: string;
    description?: string;
    form_slug?: string;
  }>(blocks, "form_embed");

  const calcFormSlug = formEmbedBlock?.form_slug ?? "build-ehswatch-package";

  // Fetch the multi-step form schema for step titles, org options, and success messaging
  const calcFormRes = await getForm(calcFormSlug).catch(() => null);
  const calcFormAttrs = (calcFormRes?.data as any)?.attributes as {
    steps?: Array<{
      key: string;
      title: string;
      description: string;
      fields: Array<{
        key: string;
        label: string;
        field_type: string;
        options?: string[] | null;
        required?: boolean;
        placeholder?: string | null;
        help_text?: string | null;
        full_width?: boolean;
      }>;
    }>;
    submit_label?: string;
    success_heading?: string;
    success_message?: string;
    picker_catalogues?: {
      applications?: Array<{ slug: string; name: string; icon?: string; description?: string; category?: string }>;
      addons?: Array<{ slug: string; name: string; icon?: string; description?: string }>;
    };
    captcha?: { provider?: string; site_key?: string };
  } | undefined;

  // ── picker_catalogues — apps and addons from the dedicated CMS admin sections
  // Admin manages these at /admin/pricing-applications and /admin/pricing-addons.
  // These are the primary source for apps/addons; pricing_calculator block overrides.
  const formApplications = calcFormAttrs?.picker_catalogues?.applications
    ?.filter((a) => a.slug && a.name)
    .map((a) => ({ id: a.slug, name: a.name, description: a.description || "", icon: a.icon, color: undefined as string | undefined }));

  const formAddons = calcFormAttrs?.picker_catalogues?.addons
    ?.filter((a) => a.slug && a.name)
    .map((a) => ({ id: a.slug, name: a.name, description: a.description || "", icon: a.icon, color: undefined as string | undefined }));

  // ── pricing_calculator block — applications, addons, step labels, industries ─
  // This block must be added to the pricing page in the CMS admin to activate.
  // When present, its data overrides the frontend hardcoded lists.
  const calcBlock = findBlock<{
    heading?: string;
    subheading?: string;
    step_labels?: unknown;
    applications?: unknown;
    addons?: unknown;
    industries?: unknown;
    submit_label?: string;
    success_heading?: string;
    success_body?: string;
  }>(blocks, "pricing_calculator");

  const cmsCalcApplications = calcBlock?.applications
    ? normalizeArray<{ id?: string; name?: string; description?: string; icon?: string; color?: string }>(calcBlock.applications)
        .filter((a) => a.id && a.name)
        .map((a) => ({ id: a.id!, name: a.name!, description: a.description || "", icon: a.icon, color: a.color }))
    : undefined;

  const cmsCalcAddons = calcBlock?.addons
    ? normalizeArray<{ id?: string; name?: string; description?: string; icon?: string; color?: string }>(calcBlock.addons)
        .filter((a) => a.id && a.name)
        .map((a) => ({ id: a.id!, name: a.name!, description: a.description || "", icon: a.icon, color: a.color }))
    : undefined;

  const cmsCalcIndustries = calcBlock?.industries
    ? normalizeArray<{ label?: string }>(calcBlock.industries).map((i) => i.label || "").filter(Boolean)
    : undefined;

  const cmsCalcStepLabels = calcBlock?.step_labels
    ? normalizeArray<{ label?: string }>(calcBlock.step_labels).map((s) => s.label || "").filter(Boolean)
    : undefined;

  // ── cta_banner block ────────────────────────────────────────────────────────
  const ctaBlock = findBlock<{
    headline?: string;
    subhead?: string;
    primary_cta?: unknown;
    secondary_cta?: unknown;
  }>(blocks, "cta_banner");

  const ctaHeadline  = headingHtmlOpt(ctaBlock?.headline);
  const ctaSubhead   = stripHtmlOpt(ctaBlock?.subhead);
  const ctaPrimary   = resolveCta(ctaBlock?.primary_cta, pageMap);
  const ctaSecondary = resolveCta(ctaBlock?.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <PricingHero
          eyebrow={heroEyebrow}
          headline={heroHeadline}
          subheadline={heroSubheadline}
          primaryCtaLabel={primaryCtaLabel}
          primaryCtaHref={primaryCtaHref}
          secondaryCtaLabel={secondaryCtaLabel}
          secondaryCtaHref={secondaryCtaHref}
        />
        <PricingOverview
          heading={overviewHeading}
          body={overviewBody}
          checklistHeading={overviewChecklistHeading}
          checklistItems={overviewChecklistItems.length > 0 ? overviewChecklistItems : undefined}
        />
        {/* Calculator renders only while the CMS form is active — toggling
            "Is active" off in the form admin hides the whole section. */}
        {calcFormAttrs && (
        <PricingCalculator
          cmsHeading={calcBlock?.heading || formEmbedBlock?.heading || undefined}
          cmsSubheading={calcBlock?.subheading || formEmbedBlock?.description || undefined}
          cmsFormSlug={calcFormSlug}
          cmsFormSteps={calcFormAttrs?.steps}
          cmsStepLabels={cmsCalcStepLabels && cmsCalcStepLabels.length > 0 ? cmsCalcStepLabels : undefined}
          cmsApplications={
            (cmsCalcApplications && cmsCalcApplications.length > 0)
              ? cmsCalcApplications
              : (formApplications && formApplications.length > 0)
              ? formApplications
              : undefined
          }
          cmsAddons={
            (cmsCalcAddons && cmsCalcAddons.length > 0)
              ? cmsCalcAddons
              : (formAddons && formAddons.length > 0)
              ? formAddons
              : undefined
          }
          cmsIndustries={cmsCalcIndustries && cmsCalcIndustries.length > 0 ? cmsCalcIndustries : undefined}
          cmsSubmitLabel={calcBlock?.submit_label || calcFormAttrs?.submit_label || undefined}
          cmsSuccessHeading={calcBlock?.success_heading || calcFormAttrs?.success_heading || undefined}
          cmsSuccessBody={calcBlock?.success_body || calcFormAttrs?.success_message || undefined}
          cmsCaptchaSiteKey={calcFormAttrs?.captcha?.site_key || undefined}
        />
        )}
        <PricingFAQ
          heading={faqHeading}
          items={faqItems.length > 0 ? faqItems : undefined}
        />
        <CTABanner
          cmsHeadline={ctaHeadline}
          cmsSubhead={ctaSubhead}
          cmsPrimaryCta={ctaPrimary ?? undefined}
          cmsSecondaryCta={ctaSecondary ?? undefined}
        />
      </main>
      <Footer />
    </>
  );
}
