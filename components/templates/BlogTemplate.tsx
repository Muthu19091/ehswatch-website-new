import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import BlogGrid from "@/components/sections/BlogGrid";
import BlogNewsletter from "@/components/sections/BlogNewsletter";
import Reveal from "@/components/ui/Reveal";
import GlareButton from "@/components/ui/GlareButton";
import { basePath } from "@/lib/basePath";
import type { Metadata } from "next";
import { getBlogPosts, getPage, getForm, getPageList } from "@/lib/api";
import { buildPageMap, resolveCta } from "@/lib/blocks";
import { robotsFrom, seoExtras } from "@/lib/seo";
import { stripHtmlOpt } from "@/lib/text";
import { redirectIfMoved } from "@/lib/redirectMoved";

export const dynamic = "force-dynamic";

// Slug-parameterised blog listing. Rendered by app/blog/page.tsx (slug="blog")
// and by the catch-all app/[slug] when a page's CMS template === "blog" (i.e.
// after the listing slug was renamed). The canonical slug from the API drives
// the post-card links so /<listingSlug>/<post> stays consistent.
export async function blogMetadata(slug: string): Promise<Metadata> {
  const pageData = await getPage(slug).catch(() => null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attrs = (pageData?.data as any)?.attributes ?? {};
  const meta = attrs.meta as Record<string, string> | undefined;
  return {
    ...seoExtras(meta),
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "Blog - EHSWatch",
    description: meta?.meta_description || "Practical guidance, regulatory updates and operational insights for EHSQ professionals. Written by safety practitioners, for safety practitioners.",
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
  const showPrimary = !!primaryLabel?.trim() && !!primaryUrl && primaryUrl !== "#";
  const showSecondary = !!secondaryLabel?.trim() && !!secondaryUrl && secondaryUrl !== "#";
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
            className="w-full sm:w-auto px-7 md:px-[31.5px] py-3 md:py-[15.5px] rounded-full bg-[rgba(255,120,44,0.1)] border border-[rgba(255,120,44,0.2)] font-[family-name:var(--font-inter)] text-[14px] text-[var(--brand-primary)] whitespace-nowrap"
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

export default async function BlogTemplate({ slug }: { slug: string }) {
  const [res, pageRes, pageListRes] = await Promise.all([
    getBlogPosts(),
    getPage(slug),
    getPageList(),
  ]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();
  // If the slug was renamed, move the browser to the canonical URL.
  redirectIfMoved(slug, pageRes);
  const listingSlug = (pageRes.data.attributes as { slug?: string }).slug || slug;

  const cmsPosts = res?.data ?? [];
  const pageMap = buildPageMap(pageListRes?.data);

  const blocks: Array<{ type: string; data: Record<string, unknown> }> =
    (pageRes?.data?.attributes?.content as Array<{ type: string; data: Record<string, unknown> }>) ?? [];

  const heroBlock = blocks.find((b) => b.type === "hero")?.data ?? {};
  const heroHeadline = (heroBlock.headline as string | undefined) || undefined;
  const heroSubheadline = stripHtmlOpt(heroBlock.subheadline as string | undefined);
  const heroEyebrow = (heroBlock.eyebrow as string | undefined) || undefined;

  const highlightsBlock = blocks.find((b) => b.type === "blog_highlights")?.data ?? {};
  const asBool = (v: unknown, dflt = true) => (v === undefined || v === null ? dflt : !!v);
  const listingControls = {
    showSearch:   asBool(highlightsBlock.show_search),
    showTimeline: asBool(highlightsBlock.show_timeline_filter),
    showTopic:    asBool(highlightsBlock.show_topic_filter),
    showFormat:   asBool(highlightsBlock.show_format_filter),
    perPage:      Number(highlightsBlock.max_count) || undefined,
    pagination:   (highlightsBlock.pagination as string | undefined) || undefined,
    loadMoreLabel: ((highlightsBlock.view_all_cta as { label?: string } | undefined)?.label) || undefined,
  };

  const formEmbedBlock = blocks.find((b) => b.type === "form_embed")?.data ?? {};
  const newsletterFormSlug = (formEmbedBlock.form_slug as string | undefined) || "newsletter";
  const newsletterFormRes = await getForm(newsletterFormSlug).catch(() => null);
  const newsletterFormAttrs = newsletterFormRes?.data?.attributes ?? null;

  const ctaBlock = blocks.find((b) => b.type === "cta_banner")?.data ?? {};
  const ctaHeadline = (ctaBlock.headline as string | undefined) || undefined;
  const ctaSubhead = (ctaBlock.subhead as string | undefined) || undefined;
  const primaryCta = resolveCta(ctaBlock.primary_cta, pageMap);
  const secondaryCta = resolveCta(ctaBlock.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <BlogHero headline={heroHeadline} subheadline={heroSubheadline} eyebrow={heroEyebrow} />
        <BlogGrid
          cmsPosts={cmsPosts.length > 0 ? cmsPosts : undefined}
          listingSlug={listingSlug}
          cmsPageSize={listingControls.perPage}
          showSearch={listingControls.showSearch}
          showTimeline={listingControls.showTimeline}
          showTopic={listingControls.showTopic}
          showFormat={listingControls.showFormat}
          pagination={listingControls.pagination}
          loadMoreLabel={listingControls.loadMoreLabel}
        />
        <BlogNewsletter formAttrs={newsletterFormAttrs} />
        <BlogCTA
          headline={ctaHeadline}
          subhead={ctaSubhead}
          primaryLabel={primaryCta?.label || undefined}
          primaryUrl={primaryCta?.url || undefined}
          secondaryLabel={secondaryCta?.label || undefined}
          secondaryUrl={secondaryCta?.url || undefined}
        />
      </main>
      <Footer />
    </>
  );
}
