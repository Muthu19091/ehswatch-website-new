"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlareButton from "@/components/ui/GlareButton";
import { resolveLink, type ResolvedLink } from "@/lib/cmsLink";
import { youtubeBackgroundEmbedUrl } from "@/lib/youtube";

/**
 * Data-driven Hero for CMS-authored pages (content[].type === "hero").
 *
 * Unlike every other Hero* component in this codebase, this one takes
 * no hardcoded copy — everything comes from the Page's stored section
 * data, resolved by BlockDataStripper/BlockContentEnricher on the BE.
 * Covers every option the admin's "Background type" and CTA "Link
 * Type" selects actually offer (HeroBlock.php / LinkPicker.php),
 * rather than only the one shape the "blank" page template seeds.
 *
 * Not covered: the "Play video in popup" CTA type. Resolving it to a
 * working lightbox is a separate, larger UI feature (modal, focus
 * trap) — resolveLink() intentionally falls back to a non-navigating
 * "#" for it rather than a half-built popup.
 */
export interface CmsHeroProps {
  data: Record<string, unknown>;
  pageMap?: Record<number, string>;
}

// Static text — safe to declare once and reuse across every instance.
// Each instance supplies its own image/opacity via CSS custom
// properties set on its own element's style prop (see render below),
// not by editing this string — avoids both a CSS-injection surface
// and a shared-global-class collision between two mounted heroes.
const HERO_BG_STYLE = `
  .cms-hero-bg { background: linear-gradient(to bottom, rgba(15,23,42,var(--cms-hero-overlay)), rgba(15,23,42,var(--cms-hero-overlay))), var(--cms-hero-mobile-bg) center/cover no-repeat; }
  @media (min-width: 640px) {
    .cms-hero-bg { background: linear-gradient(to bottom, rgba(15,23,42,var(--cms-hero-overlay)), rgba(15,23,42,var(--cms-hero-overlay))), var(--cms-hero-desktop-bg) center/cover no-repeat; }
  }
`;

type Slide = {
  image: string | null;
  mobileImage: string | null;
  headline: string;
  subheadline: string;
  cta: ResolvedLink;
};

export default function CmsHero({ data, pageMap }: CmsHeroProps) {
  const eyebrow = str(data.eyebrow);
  const headline = str(data.headline);
  // CKEditor field (bold/italic/lists/links only per its toolbar
  // config on the BE) — real HTML, not plain text, so it's rendered
  // via dangerouslySetInnerHTML like CmsRichText's body, not as a
  // plain string (which would leak literal <strong> tags the moment
  // an editor used any formatting).
  const subheadlineHtml = str(data.subheadline);
  const boldTagline = str(data.bold_tagline);
  const textAlign = toTextAlign(data.text_alignment);
  const overlay = toOverlayAlpha(data.overlay_opacity);

  const primaryCta = resolveLink(data.primary_cta, "primary_cta", pageMap);
  const secondaryCta = resolveLink(data.secondary_cta, "secondary_cta", pageMap);
  const tertiaryCta = resolveLink(data.tertiary_cta, "tertiary_cta", pageMap);

  const backgroundType = str(data.background_type) || "image";

  const desktopImage = imageUrl(data.desktop_image);
  const mobileImage = imageUrl(data.mobile_image);
  const desktopBg = desktopImage ?? mobileImage;
  const mobileBg = mobileImage ?? desktopImage;

  const videoUrl = imageUrl(data.background_video);
  const posterUrl = imageUrl(data.video_poster);
  const youtubeEmbed = backgroundType === "video_url" && typeof data.video_url === "string"
    ? youtubeBackgroundEmbedUrl(data.video_url)
    : null;

  const slides = backgroundType === "slider" ? parseSlides(data.slides, pageMap) : [];
  const autoplaySeconds = Number(str(data.slider_autoplay_seconds)) || 0;
  const showArrows = data.slider_show_arrows !== false; // BE default true
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (backgroundType !== "slider" || slides.length < 2 || autoplaySeconds <= 0) return;
    const id = setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), autoplaySeconds * 1000);
    return () => clearInterval(id);
  }, [backgroundType, slides.length, autoplaySeconds]);

  if (!headline && backgroundType !== "slider") return null;
  if (backgroundType === "slider" && slides.length === 0) return null;

  // In slider mode the CURRENT slide's own headline/subheadline/cta
  // override the section-level ones when set (HeroBlock.php: "Optional
  // per-slide override of the section headline above"); every other
  // background type always shows the fixed section-level content.
  const activeSlide = backgroundType === "slider" ? slides[Math.min(slideIndex, slides.length - 1)] : null;
  const shownHeadline = activeSlide?.headline || headline;
  const shownSubheadlineHtml = activeSlide ? activeSlide.subheadline : subheadlineHtml; // slide subheadline is plain text, not CKEditor
  const shownCtas: Array<ResolvedLink> = activeSlide ? [activeSlide.cta] : [primaryCta, secondaryCta, tertiaryCta];

  const bgImageForContrast =
    (backgroundType === "image" && Boolean(desktopBg)) ||
    (backgroundType === "slider" && Boolean(activeSlide?.image)) ||
    backgroundType === "video_file" ||
    backgroundType === "video_url";

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
      style={{ minHeight: "56vh" }}
    >
      {/* ── Background layer — exactly one of these five per the admin's Background type select ── */}

      {backgroundType === "image" && desktopBg && (
        <>
          <style>{HERO_BG_STYLE}</style>
          <div
            className="absolute inset-0 cms-hero-bg"
            style={
              {
                "--cms-hero-mobile-bg": `url(${mobileBg})`,
                "--cms-hero-desktop-bg": `url(${desktopBg})`,
                "--cms-hero-overlay": overlay,
              } as React.CSSProperties
            }
          />
        </>
      )}

      {backgroundType === "slider" && activeSlide && (
        <>
          <style>{HERO_BG_STYLE}</style>
          {slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 cms-hero-bg transition-opacity duration-700 ${i === slideIndex ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              style={
                {
                  "--cms-hero-mobile-bg": `url(${slide.mobileImage ?? slide.image})`,
                  "--cms-hero-desktop-bg": `url(${slide.image ?? slide.mobileImage})`,
                  "--cms-hero-overlay": overlay,
                } as React.CSSProperties
              }
            />
          ))}
          {showArrows && slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setSlideIndex((i) => (i - 1 + slides.length) % slides.length)}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setSlideIndex((i) => (i + 1) % slides.length)}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
              >
                ›
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setSlideIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === slideIndex ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {backgroundType === "video_file" && videoUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src={videoUrl}
            poster={posterUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0" style={{ background: `rgba(15,23,42,${overlay})` }} />
        </div>
      )}

      {backgroundType === "video_url" && youtubeEmbed && (
        <div className="absolute inset-0 overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
            src={youtubeEmbed}
            title="Background video"
            allow="autoplay; encrypted-media"
            frameBorder={0}
            tabIndex={-1}
          />
          <div className="absolute inset-0" style={{ background: `rgba(15,23,42,${overlay})` }} />
        </div>
      )}

      {!hasMediaBgFallback(backgroundType, desktopBg, videoUrl, youtubeEmbed) && (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248, 250, 252, 0.5) 100%)" }}
        />
      )}

      {/* ── Overlaid content ── */}
      <div
        className={`relative z-10 max-w-[760px] w-full mx-auto flex flex-col gap-5 md:gap-6 ${
          textAlign === "center" ? "items-center text-center" : textAlign === "right" ? "items-end text-right" : "items-start text-left"
        }`}
      >
        {eyebrow && (
          <span
            className={`font-[family-name:var(--font-dm-sans)] font-semibold text-[13px] tracking-[0.08em] uppercase ${
              bgImageForContrast ? "text-white/80" : "text-[#ff6d00]"
            }`}
          >
            {eyebrow}
          </span>
        )}

        {boldTagline && (
          <span
            className={`font-[family-name:var(--font-dm-sans)] font-bold text-[14px] sm:text-[16px] ${
              bgImageForContrast ? "text-white" : "text-gray-900"
            }`}
          >
            {boldTagline}
          </span>
        )}

        {shownHeadline && (
          <h1
            className={`font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] sm:text-[46px] md:text-[56px] leading-[1.12] tracking-[-0.02em] ${
              bgImageForContrast ? "text-white" : "text-gray-900"
            }`}
          >
            {shownHeadline}
          </h1>
        )}

        {shownSubheadlineHtml && (
          // HeroBlock.php's own toolbar config for this field disables
          // fontSize/fontFamily/fontColor/highlight/insertImage/
          // insertTable/codeBlock/alignment/style (no heading dropdown)
          // — only bold/italic/underline/link/blockquote/basic lists
          // are actually reachable, so that's all that needs a style.
          <div
            className={`font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] md:text-[18px] leading-[1.7] max-w-[560px] text-pretty
              [&_a]:underline [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-left [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-left [&_li]:mb-1
              [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic
              ${
                bgImageForContrast
                  ? "text-white/85 [&_a]:text-white [&_blockquote]:border-white/40"
                  : "text-gray-700 [&_a]:text-[#ff6d00] [&_blockquote]:border-[#ff6d00]/40"
              }`}
            dangerouslySetInnerHTML={{ __html: shownSubheadlineHtml }}
          />
        )}

        {shownCtas.some(Boolean) && (
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center mt-2">
            {shownCtas.map(
              (cta, i) =>
                cta &&
                (i === 0 ? (
                  <GlareButton
                    key={i}
                    href={cta.href}
                    className="gap-2 px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white hover:shadow-lg"
                    style={{
                      backgroundImage:
                        "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                      boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
                    }}
                  >
                    {cta.label}
                  </GlareButton>
                ) : (
                  <Link
                    key={i}
                    href={cta.href}
                    className={`font-[family-name:var(--font-dm-sans)] font-medium text-[15px] ${
                      bgImageForContrast ? "text-white" : "text-[#0f172a]"
                    } underline underline-offset-4`}
                  >
                    {cta.label}
                  </Link>
                )),
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function imageUrl(v: unknown): string | null {
  if (v && typeof v === "object" && "url" in v && typeof (v as { url: unknown }).url === "string") {
    return (v as { url: string }).url;
  }
  return null;
}

function toTextAlign(v: unknown): "left" | "center" | "right" {
  const s = str(v);
  return s === "center" || s === "right" ? s : "left"; // HeroBlock.php's own default is 'left'
}

/** overlay_opacity is a "0"-"100" string (percentage); default matches HeroBlock.php's default('40'). */
function toOverlayAlpha(v: unknown): number {
  const n = Number(str(v));
  if (!Number.isFinite(n) || n < 0) return 0.4;
  return Math.min(n, 100) / 100;
}

function hasMediaBgFallback(
  backgroundType: string,
  desktopBg: string | null,
  videoUrl: string | null,
  youtubeEmbed: string | null,
): boolean {
  if (backgroundType === "image") return Boolean(desktopBg);
  if (backgroundType === "slider") return true; // emptiness already handled by the early return above
  if (backgroundType === "video_file") return Boolean(videoUrl);
  if (backgroundType === "video_url") return Boolean(youtubeEmbed);
  return false; // 'none', or a configured type whose asset never actually got uploaded
}

/**
 * CardRepeater items are UUID-keyed objects when edited through
 * Filament, not necessarily a plain array (confirmed pattern
 * elsewhere in this codebase's own BE — BlockContentEnricher's own
 * comment: "Filament Builder stores blocks UUID-keyed on edit"). Only
 * the top-level content[] array is normalized to a list by the BE;
 * this repeater is not, so it's normalized here instead.
 */
function parseSlides(raw: unknown, pageMap?: Record<number, string>): Slide[] {
  const list: unknown[] = Array.isArray(raw) ? raw : raw && typeof raw === "object" ? Object.values(raw) : [];

  return list
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      image: imageUrl(item.image),
      mobileImage: imageUrl(item.mobile_image),
      headline: str(item.headline),
      subheadline: str(item.subheadline),
      cta: resolveLink(item.cta, "cta", pageMap),
    }))
    .filter((slide) => slide.image || slide.mobileImage); // a slide with no image at all can't render as a background
}
