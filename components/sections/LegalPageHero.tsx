import Link from "next/link";
import GlareButton from "@/components/ui/GlareButton";
import LegalPageSlider, { type ResolvedSlide } from "@/components/sections/LegalPageSlider";
import { resolveCta, mediaUrl, normalizeArray, type PageMap } from "@/lib/blocks";
import { stripHtml } from "@/lib/text";

/**
 * Every field HeroBlock.php's "Background type" select actually offers
 * (image / slider / video_file / video_url / none), extracted out of
 * LegalPage so it can render at whatever position the hero block
 * actually holds in content[] (see LegalPage's own comment on why that
 * matters), not hardcoded as "always first".
 */
export type HeroBlockData = {
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
  tertiary_cta?: unknown;
  slides?: unknown;
  slider_autoplay_seconds?: string | number;
  slider_show_arrows?: boolean;
};
type RawSlide = {
  image?: unknown;
  mobile_image?: unknown;
  headline?: string;
  subheadline?: string;
  cta?: unknown;
};

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

/**
 * Whether this hero block actually resolves to a real dark image/video
 * background (vs. falling through to the plain white background) —
 * exported so LegalPage can decide Navbar's lightHero prop when a hero
 * with a real background ends up first in content[] (order is now
 * admin-controlled, not hardcoded), without duplicating every field's
 * full resolution logic just for that one boolean.
 */
export function heroHasMediaBackground(hero: HeroBlockData): boolean {
  const backgroundType = hero.background_type || "none";
  const desktopBg = mediaUrl(hero.desktop_image) ?? mediaUrl(hero.mobile_image);
  const slides = normalizeArray<RawSlide>(hero.slides).filter(
    (s) => mediaUrl(s.image) ?? mediaUrl(s.mobile_image),
  );
  const videoFileUrl = mediaUrl(hero.background_video);
  const videoPosterUrl = mediaUrl(hero.video_poster);
  const youtubeEmbedUrl = backgroundType === "video_url" && hero.video_url
    ? youTubeBackgroundEmbed(hero.video_url)
    : null;
  const usePosterFallback =
    (backgroundType === "video_file" && !videoFileUrl && Boolean(videoPosterUrl)) ||
    (backgroundType === "video_url" && !youtubeEmbedUrl && Boolean(videoPosterUrl));

  return (
    (backgroundType === "image" && Boolean(desktopBg)) ||
    (backgroundType === "slider" && slides.length > 0) ||
    (backgroundType === "video_file" && (Boolean(videoFileUrl) || usePosterFallback)) ||
    (backgroundType === "video_url" && (Boolean(youtubeEmbedUrl) || usePosterFallback))
  );
}

export default function LegalPageHero({
  hero,
  slug,
  pageMap,
  fallbackHeadline,
}: {
  hero: HeroBlockData;
  slug: string;
  pageMap: PageMap;
  fallbackHeadline: string;
}) {
  const headline = hero.headline?.trim() || fallbackHeadline;
  const backgroundType = hero.background_type || "none";
  // Scoped class for the mobile→desktop background-image swap below —
  // computed once so the div's className and the media-query rule that
  // targets it can never drift apart again.
  const heroBgClass = `hero-bg-${slug.replace(/[^a-z0-9]/gi, "")}`;
  const desktopBg = mediaUrl(hero.desktop_image);
  const mobileBg = mediaUrl(hero.mobile_image) ?? desktopBg;
  const effectiveDesktopBg = desktopBg ?? mediaUrl(hero.mobile_image);
  // CardRepeater slides are UUID-keyed objects when edited through
  // Filament, not always a plain array — normalizeArray() (already used
  // elsewhere in this codebase for the same reason) covers both shapes.
  const rawSlides = normalizeArray<RawSlide>(hero.slides);
  const slides: ResolvedSlide[] = [];
  for (const s of rawSlides) {
    const desktopImage = mediaUrl(s.image) ?? mediaUrl(s.mobile_image);
    if (!desktopImage) continue; // a slide with no image at all can't render as a background
    const mobileImage = mediaUrl(s.mobile_image) ?? desktopImage;
    slides.push({
      desktopImage,
      mobileImage,
      headline: s.headline,
      subheadline: stripHtml(s.subheadline) || undefined,
      cta: resolveCta(s.cta, pageMap),
    });
  }
  const sliderAutoplaySeconds = Number(hero.slider_autoplay_seconds) || 0;
  const sliderShowArrows = hero.slider_show_arrows !== false; // HeroBlock.php's own default(true)
  const videoFileUrl = mediaUrl(hero.background_video);
  const videoPosterUrl = mediaUrl(hero.video_poster);
  const youtubeEmbedUrl = backgroundType === "video_url" && hero.video_url
    ? youTubeBackgroundEmbed(hero.video_url)
    : null;

  // video_poster is uploaded independently of the video itself (an admin
  // can set it before entering a Video URL, or before a video file
  // finishes uploading) -- it's a real fallback background in its own
  // right for video_file/video_url, not just the <video poster> attribute
  // for when a video IS configured.
  const usePosterFallback =
    (backgroundType === "video_file" && !videoFileUrl && Boolean(videoPosterUrl)) ||
    (backgroundType === "video_url" && !youtubeEmbedUrl && Boolean(videoPosterUrl));

  const hasMediaBackground = heroHasMediaBackground(hero);

  const overlay = overlayAlpha(hero.overlay_opacity);
  const primaryCta = resolveCta(hero.primary_cta, pageMap);
  const secondaryCta = resolveCta(hero.secondary_cta, pageMap);
  const tertiaryCta = resolveCta(hero.tertiary_cta, pageMap);

  return (
    <section className={`relative overflow-hidden pt-36 md:pt-44 pb-16 md:pb-20 ${hasMediaBackground ? "" : "bg-white border-b border-gray-100"}`}>
      {backgroundType === "image" && effectiveDesktopBg && (
        <div
          className={`absolute inset-0 bg-cover bg-center ${heroBgClass}`}
          style={{
            backgroundImage: `linear-gradient(rgba(15,23,42,${overlay}), rgba(15,23,42,${overlay})), url(${mobileBg})`,
          }}
        >
          {/* Swap to the desktop crop at sm and above via a scoped style
              rule rather than duplicating the whole div, since the two
              images are otherwise identical in every other respect. */}
          <style>{`@media (min-width:640px){.${heroBgClass}{background-image:linear-gradient(rgba(15,23,42,${overlay}),rgba(15,23,42,${overlay})),url(${effectiveDesktopBg})!important;}}`}</style>
        </div>
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
      {usePosterFallback && videoPosterUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(15,23,42,${overlay}), rgba(15,23,42,${overlay})), url(${videoPosterUrl})` }}
        />
      )}

      {backgroundType === "slider" && slides.length > 0 ? (
        // Slides carry their own headline/subheadline/CTA overrides —
        // LegalPageSlider renders the whole text-overlay block itself,
        // not just the background layer, so it doesn't duplicate the
        // shared block below.
        <LegalPageSlider
          slides={slides}
          fallbackHeadline={headline}
          fallbackSubheadlineHtml={hero.subheadline ?? ""}
          autoplaySeconds={sliderAutoplaySeconds}
          showArrows={sliderShowArrows}
          overlay={overlay}
          hasMediaBackground={hasMediaBackground}
        />
      ) : (
        <div className="relative z-10 max-w-[820px] mx-auto px-6">
          {hero.eyebrow && (
            <span className={`block mb-3 font-[family-name:var(--font-dm-sans)] font-semibold text-[13px] tracking-[0.08em] uppercase ${hasMediaBackground ? "text-white/80" : "text-[#ff6d00]"}`}>
              {hero.eyebrow}
            </span>
          )}
          <h1 className={`font-[family-name:var(--font-dm-sans)] text-[32px] md:text-[44px] font-bold leading-[1.15] ${hasMediaBackground ? "text-white" : "text-[#111827]"}`}>
            {headline}
          </h1>
          {(() => {
            const sub = stripHtml(hero.subheadline);
            return sub ? (
            <p className={`mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-relaxed ${hasMediaBackground ? "text-white/85" : "text-[#6b7280]"}`}>
              {sub}
            </p>
            ) : null;
          })()}
          {(primaryCta || secondaryCta || tertiaryCta) && (
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
              {tertiaryCta && (
                <Link
                  href={tertiaryCta.url}
                  target={tertiaryCta.newTab ? "_blank" : undefined}
                  rel={tertiaryCta.newTab ? "noopener noreferrer" : undefined}
                  className={`font-[family-name:var(--font-dm-sans)] font-medium text-[15px] underline underline-offset-2 ${hasMediaBackground ? "text-white" : "text-[#ff6d00]"}`}
                >
                  {tertiaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

