import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import BlogGrid from "@/components/sections/BlogGrid";
import BlogNewsletter from "@/components/sections/BlogNewsletter";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import GlareButton from "@/components/ui/GlareButton";
import { basePath } from "@/lib/basePath";
import type { Metadata } from "next";
import { getBlogPosts, getPage, getForm, getPageList } from "@/lib/api";
import { buildPageMap, resolveCta } from "@/lib/blocks";
import { robotsFrom } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPage("blog").catch(() => null);
  const attrs = (pageData?.data as any)?.attributes ?? {};
  return {
    robots: robotsFrom(attrs.meta?.robots),
    title: attrs.meta?.meta_title || "Blog — EHSWatch",
    description: attrs.meta?.meta_description || "Practical guidance, regulatory updates and operational insights for EHSQ professionals. Written by safety practitioners, for safety practitioners.",
  };
}

interface CtaBannerProps {
  headline?: string;
  subhead?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
}

function BlogCTA({
  headline,
  subhead,
  primaryLabel,
  primaryUrl,
  secondaryLabel,
  secondaryUrl,
}: CtaBannerProps) {
  // CMS-only: no hardcoded copy or CTAs.
  const showPrimary = !!primaryLabel?.trim() && !!primaryUrl && primaryUrl !== "#";
  const showSecondary = !!secondaryLabel?.trim() && !!secondaryUrl && secondaryUrl !== "#";
  // Hide the whole banner when the CMS provides nothing.
  if (!headline?.trim() && !subhead?.trim() && !showPrimary && !showSecondary) return null;
  return (
    <section
      className="relative py-12 md:py-[61px] px-4 md:px-6 overflow-hidden"
      style={{
        background: "#f1f7ff",
        backgroundImage: `url(${basePath}/images/product/cta-background.svg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[800px] mx-auto flex flex-col gap-3 md:gap-[16px] items-center">
        {headline?.trim() && (
          <Reveal variant="slide-right" duration={750}>
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-[#0a0f1e] text-center">
              {headline}
            </h2>
          </Reveal>
        )}
        {subhead?.trim() && (
          <Reveal variant="slide-left" duration={750} delay={120}>
            <p className="font-[family-name:var(--font-inter)] text-[14px] md:text-[17px] leading-relaxed md:leading-[29.75px] text-[#6b7280] text-center max-w-[520px]">
              {subhead}
            </p>
          </Reveal>
        )}
        {(showPrimary || showSecondary) && (
        <Reveal
          variant="fade-up"
          duration={700}
          delay={240}
          className="flex flex-col sm:flex-row gap-3 md:gap-[16px] items-center justify-center pt-4 md:pt-[24px] w-full sm:w-auto"
        >
          {showPrimary && (
          <GlareButton
            href={primaryUrl!}
            className="w-full sm:w-auto px-6 md:px-[26px] py-3 md:py-[10px] rounded-full font-[family-name:var(--font-inter)] font-medium text-[14px] text-white whitespace-nowrap"
            style={{
              backgroundImage:
                "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
            }}
          >
            {primaryLabel}
          </GlareButton>
          )}
          {showSecondary && (
          <GlareButton
            href={secondaryUrl!}
            fillColor="#FFA660"
            hoverTextColor="#ffffff"
            className="w-full sm:w-auto px-7 md:px-[31.5px] py-3 md:py-[15.5px] rounded-full bg-[rgba(255,120,44,0.1)] border border-[rgba(255,120,44,0.2)] font-[family-name:var(--font-inter)] text-[14px] text-[#ff6d00] whitespace-nowrap"
          >
            {secondaryLabel}
          </GlareButton>
          )}
        </Reveal>
        )}
      </div>
    </section>
  );
}

export default async function BlogPage() {
  const [res, pageRes, pageListRes] = await Promise.all([
    getBlogPosts(),
    getPage("blog"),
    getPageList(),
  ]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  const cmsPosts = res?.data ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  const blocks: Array<{ type: string; data: Record<string, unknown> }> =
    (pageRes?.data?.attributes?.content as Array<{ type: string; data: Record<string, unknown> }>) ?? [];

  // Extract hero block
  const heroBlock = blocks.find((b) => b.type === "hero")?.data ?? {};
  const heroHeadline = (heroBlock.headline as string | undefined) || undefined;
  const heroSubheadline = (heroBlock.subheadline as string | undefined) || undefined;
  const heroEyebrow = (heroBlock.eyebrow as string | undefined) || undefined;

  // Extract blog_highlights block — controls the listing's search/filters
  const highlightsBlock = blocks.find((b) => b.type === "blog_highlights")?.data ?? {};
  // Toggles default to ON when the field is absent (older content)
  const asBool = (v: unknown, dflt = true) => (v === undefined || v === null ? dflt : !!v);
  const listingControls = {
    heading:      (highlightsBlock.heading as string | undefined) || undefined,
    subheading:   (highlightsBlock.subheading as string | undefined) || undefined,
    showSearch:   asBool(highlightsBlock.show_search),
    showTimeline: asBool(highlightsBlock.show_timeline_filter),
    showTopic:    asBool(highlightsBlock.show_topic_filter),
    showFormat:   asBool(highlightsBlock.show_format_filter),
  };

  // Extract form_embed block — read form_slug dynamically
  const formEmbedBlock = blocks.find((b) => b.type === "form_embed")?.data ?? {};
  const newsletterFormSlug = (formEmbedBlock.form_slug as string | undefined) || "newsletter";
  const newsletterFormRes = await getForm(newsletterFormSlug).catch(() => null);
  const newsletterFormAttrs = newsletterFormRes?.data?.attributes ?? null;

  // Extract cta_banner block
  const ctaBlock = blocks.find((b) => b.type === "cta_banner")?.data ?? {};
  const ctaHeadline = (ctaBlock.headline as string | undefined) || undefined;
  const ctaSubhead = (ctaBlock.subhead as string | undefined) || undefined;

  // Resolve CTAs via the shared resolver so internal page_id links (e.g. the
  // "View Pricing Plans" secondary → Pricing page) resolve to a real path
  // instead of "#", and bare domains/anchors are handled consistently.
  const primaryCta = resolveCta(ctaBlock.primary_cta, pageMap);
  const secondaryCta = resolveCta(ctaBlock.secondary_cta, pageMap);

  const primaryLabel = primaryCta?.label || undefined;
  const primaryUrl = primaryCta?.url || undefined;
  const secondaryLabel = secondaryCta?.label || undefined;
  const secondaryUrl = secondaryCta?.url || undefined;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <BlogHero
          headline={heroHeadline}
          subheadline={heroSubheadline}
          eyebrow={heroEyebrow}
        />
        <BlogGrid
          cmsPosts={cmsPosts.length > 0 ? cmsPosts : undefined}
          showSearch={listingControls.showSearch}
          showTimeline={listingControls.showTimeline}
          showTopic={listingControls.showTopic}
          showFormat={listingControls.showFormat}
        />
        <BlogNewsletter formAttrs={newsletterFormAttrs} />
        <BlogCTA
          headline={ctaHeadline}
          subhead={ctaSubhead}
          primaryLabel={primaryLabel}
          primaryUrl={primaryUrl}
          secondaryLabel={secondaryLabel}
          secondaryUrl={secondaryUrl}
        />
      </main>
      <Footer />
    </>
  );
}
