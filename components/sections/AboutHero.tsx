"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import GlareButton from "@/components/ui/GlareButton";
import HeroDotBackground from "@/components/ui/HeroDotBackground";

interface AboutHeroCmsProps {
  cmsEyebrow?: string | undefined;
  cmsHeadline?: string | undefined;
  cmsSubheadline?: string | undefined;
  cmsPrimaryCtaLabel?: string | undefined;
  cmsPrimaryCtaUrl?: string | undefined;
  // When the CMS hero CTA is a "video_popup", its video URL — the button then
  // opens a modal player instead of navigating (same behaviour as the home hero).
  cmsHeroVideoUrl?: string | undefined;
}

// YouTube watch/short URL → privacy-friendly embed URL with autoplay (and start
// time if the URL carried a t=/start= param). Returns null for non-YouTube URLs.
function youTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host.endsWith("youtube.com"))
      id = u.searchParams.get("v") || (u.pathname.startsWith("/embed/") ? u.pathname.split("/embed/")[1] : "");
    if (!id) return null;
    const params = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1" });
    const t = u.searchParams.get("t") || u.searchParams.get("start");
    if (t) {
      const secs = parseInt(String(t).replace(/[^0-9]/g, ""), 10);
      if (secs) params.set("start", String(secs));
    }
    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  } catch {
    return null;
  }
}

export default function AboutHero({
  cmsEyebrow,
  cmsHeadline,
  cmsSubheadline,
  cmsPrimaryCtaLabel,
  cmsPrimaryCtaUrl,
  cmsHeroVideoUrl,
}: AboutHeroCmsProps = {}) {
  // CMS-only: no hardcoded fallback copy.
  const headline = cmsHeadline?.trim() || "";
  const subheadline = cmsSubheadline?.trim() || "";
  const ctaLabel = cmsPrimaryCtaLabel?.trim();
  const ctaHref = cmsPrimaryCtaUrl?.trim();

  // Video popup (CMS "video_popup" CTA): the button opens a modal player rather
  // than navigating. Portaled to <body> so the fixed overlay isn't clipped.
  const isVideoCta = !!cmsHeroVideoUrl;
  const embedUrl = cmsHeroVideoUrl ? youTubeEmbed(cmsHeroVideoUrl) : null;
  const [videoOpen, setVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVideoOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [videoOpen]);

  // Button renders when it has a label AND either opens a video or has a real link.
  const showCta = !!ctaLabel && (isVideoCta || (!!ctaHref && ctaHref !== "#"));

  const ctaClassName =
    "gap-2 px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white animate-hero-rise hover:shadow-lg";
  const ctaStyle = {
    animationDelay: "320ms",
    backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
    boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
  };
  const ctaInner = (
    <>
      {ctaLabel}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  );

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
      style={{
        minHeight: "62vh",
        background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248, 250, 252, 0.5) 100%)",
      }}
    >
      {/* Same dot-grid background as the home hero (soft, faded — not a box) */}
      <HeroDotBackground />

      {/* Hero content */}
      <div className="relative z-20 max-w-[720px] w-full mx-auto text-center flex flex-col items-center gap-5 md:gap-6">
        {cmsEyebrow && (
          <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise">
            {cmsEyebrow}
          </span>
        )}
        {headline && (
          <h1
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[34px] sm:text-[48px] md:text-[58px] leading-[1.08] text-gray-900 tracking-[-0.03em] animate-hero-rise"
            style={{ animationDelay: "80ms" }}
            dangerouslySetInnerHTML={{ __html: headline }}
          />
        )}

        {subheadline && (
          <p
            className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] md:text-[18px] text-gray-700 leading-[1.75] max-w-[460px] animate-hero-rise text-pretty"
            style={{ animationDelay: "200ms" }}
          >
            {subheadline}
          </p>
        )}

        {showCta &&
          (isVideoCta ? (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className={"inline-flex items-center justify-center border-0 cursor-pointer " + ctaClassName}
              style={ctaStyle}
            >
              {ctaInner}
            </button>
          ) : (
            <GlareButton href={ctaHref!} className={ctaClassName} style={ctaStyle}>
              {ctaInner}
            </GlareButton>
          ))}
      </div>

      {/* Watch-a-Demo video modal — portaled to <body> to escape any transformed
          / overflow-hidden ancestors. Matches the home hero popup. */}
      {mounted && videoOpen && cmsHeroVideoUrl && createPortal(
        <div
          onClick={() => setVideoOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(3,7,18,0.85)", backdropFilter: "blur(2px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "min(980px, 100%)", aspectRatio: "16 / 9" }}>
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              aria-label="Close video"
              style={{
                position: "absolute", top: -44, right: 0, width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 22, lineHeight: 1,
                border: "none", cursor: "pointer",
              }}
            >
              ×
            </button>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Demo video"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0, borderRadius: 14, background: "#000" }}
              />
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={cmsHeroVideoUrl} controls autoPlay playsInline style={{ width: "100%", height: "100%", borderRadius: 14, background: "#000", objectFit: "contain" }} />
            )}
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}
