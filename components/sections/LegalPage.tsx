import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlareButton from "@/components/ui/GlareButton";
import { getPage, getPageList } from "@/lib/api";
import { redirectIfMoved } from "@/lib/redirectMoved";
import { findBlock, findBlocks, buildPageMap, resolveCta, mediaUrl, normalizeArray } from "@/lib/blocks";
import { stripHtml } from "@/lib/text";
import { seoExtras, robotsFrom } from "@/lib/seo";

/**
 * Every field HeroBlock.php's "Background type" select actually offers
 * (image / slider / video_file / video_url / none) -- this generic
 * fallback template previously only read headline/subheadline, so an
 * admin-picked background never showed on any page without one of the
 * hand-designed bespoke templates (about/, pricing/, ...). Those
 * bespoke templates each have their own fixed hero design and don't
 * honour background_type either -- this IS the one place a new page's
 * actual background choice needs to render, since a brand-new page
 * has no bespoke design of its own.
 */
type HeroBlock = {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  background_type?: string;
  desktop_image?: unknown;
  mobile_image?: unknown;
  background_video?: unknown;
  video_poster?: unknown;
  video_url?: string;
  overlay_opacity?: string | number;
  primary_cta?: unknown;
  secondary_cta?: unknown;
  slides?: unknown;
};
type RichTextBlock = { body?: string };

/** Background-video embed (mute/loop/no controls) -- same id-extraction as GlareButton's own youTubeEmbed(), just tuned for an ambient background instead of a popup player. */
function youTubeBackgroundEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host.endsWith("youtube.com")) {
      id = u.searchParams.get("v") || (u.pathname.startsWith("/embed/") ? u.pathname.split("/embed/")[1] : "");
    }
    if (!id) return null;
    const params = new URLSearchParams({
      autoplay: "1", mute: "1", loop: "1", playlist: id, controls: "0", modestbranding: "1", rel: "0",
    });
    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  } catch {
    return null;
  }
}

function overlayAlpha(v: string | number | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.min(n, 100) / 100 : 0.4; // HeroBlock.php's own default('40')
}

export async function legalMetadata(slug: string, fallbackTitle: string): Promise<Metadata> {
  const res = await getPage(slug);
  const attrs = res?.data?.attributes;
  return {
    ...seoExtras(attrs?.meta),
    robots: robotsFrom(attrs?.meta?.robots),
    title: attrs?.meta?.meta_title || `${attrs?.title || fallbackTitle} - EHSWatch`,
    description:
      attrs?.meta?.meta_description ||
      `${attrs?.title || fallbackTitle} for the EHSWatch platform and website.`,
  };
}

export default async function LegalPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const [res, pageListRes] = await Promise.all([getPage(slug), getPageList()]);
  const attrs = res?.data?.attributes;
  if (!attrs) notFound();
  redirectIfMoved(slug, res);
  const pageMap = buildPageMap(pageListRes?.data);

  const blocks = attrs.content ?? [];
  const hero = findBlock<HeroBlock>(blocks, "hero");
  const richBlocks = findBlocks<RichTextBlock>(blocks, "rich_text");

  const headline = hero?.headline?.trim() || attrs.title || fallbackTitle;
  const body = richBlocks.map((b) => b.body || "").join("\n");

  const backgroundType = hero?.background_type || "none";
  const desktopBg = mediaUrl(hero?.desktop_image);
  const mobileBg = mediaUrl(hero?.mobile_image) ?? desktopBg;
  const effectiveDesktopBg = desktopBg ?? mediaUrl(hero?.mobile_image);
  // CardRepeater slides are UUID-keyed objects when edited through
  // Filament, not always a plain array — normalizeArray() (already used
  // elsewhere in this codebase for the same reason) covers both shapes.
  const slides = normalizeArray<{ image?: unknown; mobile_image?: unknown }>(hero?.slides);
  const firstSlideImage = mediaUrl(slides[0]?.image) ?? mediaUrl(slides[0]?.mobile_image);
  const videoFileUrl = mediaUrl(hero?.background_video);
  const videoPosterUrl = mediaUrl(hero?.video_poster);
  const youtubeEmbedUrl = backgroundType === "video_url" && hero?.video_url
    ? youTubeBackgroundEmbed(hero.video_url)
    : null;

  const hasMediaBackground =
    (backgroundType === "image" && Boolean(effectiveDesktopBg)) ||
    (backgroundType === "slider" && Boolean(firstSlideImage)) ||
    (backgroundType === "video_file" && Boolean(videoFileUrl)) ||
    (backgroundType === "video_url" && Boolean(youtubeEmbedUrl));

  const overlay = overlayAlpha(hero?.overlay_opacity);
  const primaryCta = resolveCta(hero?.primary_cta, pageMap);
  const secondaryCta = resolveCta(hero?.secondary_cta, pageMap);

  return (
    <>
      <Navbar lightHero={!hasMediaBackground} />
      <main>
        <style>{`
          .legal-body h2 { font-size: 1.45rem; font-weight: 700; color: #111827; margin: 2.4rem 0 0.9rem; }
          .legal-body h3 { font-size: 1.15rem; font-weight: 600; color: #111827; margin: 1.8rem 0 0.7rem; }
          .legal-body p { margin: 0 0 1.1rem; }
          .legal-body ul, .legal-body ol { margin: 0 0 1.1rem; padding-left: 1.5rem; }
          .legal-body ul { list-style: disc; }
          .legal-body ol { list-style: decimal; }
          .legal-body li { margin: 0.45rem 0; }
          .legal-body a { color: #FF6D00; text-decoration: underline; text-underline-offset: 2px; }
          .legal-body a:hover { color: #e05f00; }
          .legal-body strong { color: #111827; }
          .legal-body img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
          .legal-body table { display: block; overflow-x: auto; width: 100%; border-collapse: collapse; margin: 1.2rem 0; font-size: 0.95em; }
          .legal-body th, .legal-body td { border: 1px solid #e5e7eb; padding: 0.6rem 0.8rem; text-align: left; }
          .legal-body th { background: #f9fafb; font-weight: 600; color: #111827; }
        `}</style>

        {/* Hero — background_type drives which of image/slider/video_file/
            video_url/none actually renders; a brand-new page has no bespoke
            design of its own, so this is the one place that choice matters. */}
        <section
          className={`relative overflow-hidden pt-36 md:pt-44 pb-16 md:pb-20 ${hasMediaBackground ? "" : "bg-white border-b border-gray-100"}`}
        >
          {backgroundType === "image" && effectiveDesktopBg && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(15,23,42,${overlay}), rgba(15,23,42,${overlay})), url(${mobileBg})`,
              }}
            >
              {/* Swap to the desktop crop at sm and above via a scoped style
                  rule rather than duplicating the whole div, since the two
                  images are otherwise identical in every other respect. */}
              <style>{`@media (min-width:640px){.hero-bg-${slug.replace(/[^a-z0-9]/gi, "")}{background-image:linear-gradient(rgba(15,23,42,${overlay}),rgba(15,23,42,${overlay})),url(${effectiveDesktopBg})!important;}}`}</style>
            </div>
          )}
          {backgroundType === "slider" && firstSlideImage && (
            // Static first slide — this generic fallback template renders
            // structure, not the full interactive carousel (autoplay/arrows)
            // the dedicated Slider section component has; a page that needs
            // that should use a real template, not the generic one.
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `linear-gradient(rgba(15,23,42,${overlay}), rgba(15,23,42,${overlay})), url(${firstSlideImage})` }}
            />
          )}
          {backgroundType === "video_file" && videoFileUrl && (
            <div className="absolute inset-0 overflow-hidden">
              <video className="w-full h-full object-cover" src={videoFileUrl} poster={videoPosterUrl} autoPlay muted loop playsInline />
              <div className="absolute inset-0" style={{ background: `rgba(15,23,42,${overlay})` }} />
            </div>
          )}
          {backgroundType === "video_url" && youtubeEmbedUrl && (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
                src={youtubeEmbedUrl}
                title="Background video"
                allow="autoplay; encrypted-media"
                frameBorder={0}
                tabIndex={-1}
              />
              <div className="absolute inset-0" style={{ background: `rgba(15,23,42,${overlay})` }} />
            </div>
          )}

          <div className="relative z-10 max-w-[820px] mx-auto px-6">
            {hero?.eyebrow && (
              <span className={`block mb-3 font-[family-name:var(--font-dm-sans)] font-semibold text-[13px] tracking-[0.08em] uppercase ${hasMediaBackground ? "text-white/80" : "text-[#ff6d00]"}`}>
                {hero.eyebrow}
              </span>
            )}
            <h1 className={`font-[family-name:var(--font-dm-sans)] text-[32px] md:text-[44px] font-bold leading-[1.15] ${hasMediaBackground ? "text-white" : "text-[#111827]"}`}>
              {headline}
            </h1>
            {(() => {
              const sub = stripHtml(hero?.subheadline);
              return sub ? (
              <p className={`mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-relaxed ${hasMediaBackground ? "text-white/85" : "text-[#6b7280]"}`}>
                {sub}
              </p>
              ) : null;
            })()}
            {(primaryCta || secondaryCta) && (
              <div className="flex flex-wrap items-center gap-4 mt-6">
                {primaryCta && (
                  <GlareButton
                    href={primaryCta.url}
                    videoUrl={primaryCta.videoUrl}
                    newTab={primaryCta.newTab}
                    className="px-7 py-[10px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white"
                    style={{ backgroundImage: "linear-gradient(102deg, #ffa964 0%, #ff8e37 34%, #ff7812 50%, #ff6d00 120%)" }}
                  >
                    {primaryCta.label}
                  </GlareButton>
                )}
                {secondaryCta && (
                  <GlareButton
                    href={secondaryCta.url}
                    videoUrl={secondaryCta.videoUrl}
                    newTab={secondaryCta.newTab}
                    className={`px-7 py-[10px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] border ${hasMediaBackground ? "border-white text-white" : "border-[#111827] text-[#111827]"}`}
                    fillColor="transparent"
                  >
                    {secondaryCta.label}
                  </GlareButton>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Body */}
        <section className="py-12 md:py-16 bg-white">
          <div
            className="legal-body max-w-[820px] mx-auto px-6 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.8] text-[#374151]"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
