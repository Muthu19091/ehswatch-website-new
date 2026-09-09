"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import HeroDashboard from "@/components/sections/HeroDashboard";
import DotGrid from "@/components/ui/DotGrid";
import GlareButton from "@/components/ui/GlareButton";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

interface HeroProps {
  cmsHeadline?: string;
  cmsSubheadline?: string;
  cmsEyebrow?: string;
  cmsPrimaryCta?: { label: string; url: string; videoUrl?: string };
  cmsSecondaryCta?: { label: string; url: string; videoUrl?: string };
  cmsTertiaryCta?: { label: string; url: string; videoUrl?: string };
  // When the CMS secondary CTA is a "video_popup", its video URL — the CTA
  // then opens a modal player instead of navigating.
  cmsHeroVideoUrl?: string;
  // Optional CMS hero image shown inside the framed card in place of the coded
  // dashboard (mobile variant on small screens); falls back to <HeroDashboard/>.
  cmsHeroImage?: string;
  cmsHeroImageMobile?: string;
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

export default function HeroV2({
  cmsHeadline,
  cmsSubheadline,
  cmsEyebrow,
  cmsPrimaryCta,
  cmsSecondaryCta,
  cmsTertiaryCta,
  cmsHeroVideoUrl,
  cmsHeroImage,
  cmsHeroImageMobile,
}: HeroProps) {
  // CMS-only: no hardcoded copy. Empty CMS field → nothing rendered.
  const headline = cmsHeadline ?? "";
  const subheadline = cmsSubheadline ?? "";
  // Buttons render only when configured in the CMS (label + link).
  const primaryCta = cmsPrimaryCta;
  const secondaryCta = cmsSecondaryCta;
  const tertiaryCta = cmsTertiaryCta;

  // Video popup (CMS "video_popup" secondary CTA). Portaled to <body> so the
  // fixed overlay isn't clipped by ContainerScroll's transforms.
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

  return (
    <section className="relative w-full bg-white overflow-hidden">

      {/* DotGrid background */}
      <div className="absolute inset-0 z-0">
        <DotGrid />
      </div>

      {/* White radial mask behind text — covers the whole text column
          (headline → subheadline → CTA) so the animated grid blocks never
          highlight behind the copy, while the grid stays visible at the edges. */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 66% 66% at 50% 42%, rgba(255,255,255,0.96) 26%, rgba(255,255,255,0.6) 56%, rgba(255,255,255,0) 84%)",
        }}
      />

      {/* Bottom fade into next section — md and up only.
          This sits at z-30, above the dashboard card (z-20), and is a fixed 220px
          tall at every width. Below md the card is h-[30rem] (394px rendered), so
          the same 220px whited out ~54% of it — the bar chart and axis labels
          disappeared. From md up the card is h-[40rem] (666px) and 220px covers
          only ~12%, which reads as the intended soft rim, so it stays there. */}
      <div
        className="hidden md:block absolute bottom-0 left-0 right-0 pointer-events-none z-30"
        style={{
          height: "220px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, #ffffff 100%)",
        }}
      />

      <div className="relative z-20">
        {/* Client-caught: home's hero sat right under the nav (0px gap)
            while every other page's hero uses pt-[90px] on mobile
            (About/Product/Pricing/Industries all share it) -- matching
            that here. Scoped to mobile only (no sm:/md: bump) since
            desktop routes through ContainerScroll's own scroll-linked
            positioning, not verified here and outside what was asked. */}
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center text-center gap-3 px-4 pt-[90px] md:pt-0 pb-16 md:pb-8">
              {cmsEyebrow && (
                <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise">
                  {cmsEyebrow}
                </span>
              )}
              {headline && (
              <h1
                className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[48px] md:text-[62px] lg:text-[72px] xl:text-[77px] leading-[1.1] text-[#0f172a] tracking-[0.2px] lg:tracking-[0.5px] animate-hero-rise"
                style={{ animationDelay: "60ms" }}
              >
                {headline.includes("<br") ? (
                  <span dangerouslySetInnerHTML={{ __html: headline }} />
                ) : (
                  <>
                    {headline.includes("Smart Safety") ? (
                      <>
                        {headline.split("Smart Safety")[0]}
                        <br className="hidden sm:block" />
                        {"Smart Safety" + headline.split("Smart Safety")[1]}
                      </>
                    ) : (
                      headline
                    )}
                  </>
                )}
              </h1>
              )}

              {subheadline && (
              <p
                className="font-[family-name:var(--font-dm-sans)] font-medium text-[15px] sm:text-[17px] lg:text-[20px] leading-relaxed text-[#475569] max-w-[580px] animate-hero-rise text-pretty"
                style={{ animationDelay: "180ms" }}
              >
                {subheadline}
              </p>
              )}

              {(primaryCta || secondaryCta) && (
              <div
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center mt-2 animate-hero-rise"
                style={{ animationDelay: "300ms" }}
              >
                {primaryCta && (
                <GlareButton
                  href={primaryCta.url}
                  videoUrl={primaryCta.videoUrl}
                  className="px-7 py-[10px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[16px] sm:text-[18px] text-white whitespace-nowrap"
                  style={{
                    background: "linear-gradient(102deg, #ffa964 0%, #ff8e37 34%, #ff7812 50%, #ff6d00 120%)",
                  }}
                >
                  {primaryCta.label}
                </GlareButton>
                )}

                {secondaryCta && (() => {
                  const inner = (
                    <>
                      <span className="flex items-center justify-center w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] rounded-full border border-[#0f172a]/25 group-hover:bg-[#0f172a]/5 transition-colors">
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <polygon points="3,1 13,7 3,13" fill="#0f172a" />
                        </svg>
                      </span>
                      {secondaryCta.label}
                    </>
                  );
                  const cls =
                    "flex items-center gap-2 font-[family-name:var(--font-dm-sans)] font-medium text-[15px] sm:text-[17px] text-[#0f172a] whitespace-nowrap group";
                  return isVideoCta ? (
                    <button type="button" onClick={() => setVideoOpen(true)} className={cls} style={{ cursor: "pointer" }}>
                      {inner}
                    </button>
                  ) : (
                    <Link href={secondaryCta.url} className={cls}>
                      {inner}
                    </Link>
                  );
                })()}

                {tertiaryCta && (
                <GlareButton
                  href={tertiaryCta.url}
                  videoUrl={tertiaryCta.videoUrl}
                  className="inline-flex items-center justify-center px-7 py-[10px] rounded-full border border-[#0f172a]/20 font-[family-name:var(--font-dm-sans)] font-medium text-[15px] sm:text-[17px] text-[#0f172a] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[#ff6d00]/5 whitespace-nowrap transition-colors"
                >
                  {tertiaryCta.label}
                </GlareButton>
                )}
              </div>
              )}
            </div>
          }
        >
          {cmsHeroImage ? (
            <picture className="block w-full h-full animate-hero-rise" style={{ animationDelay: "450ms" }}>
              {cmsHeroImageMobile ? (
                <source media="(max-width: 640px)" srcSet={cmsHeroImageMobile} />
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cmsHeroImage} alt="" className="w-full h-full object-cover object-top" />
            </picture>
          ) : (
            <HeroDashboard />
          )}
        </ContainerScroll>
      </div>

      {/* Watch-Demo video modal — portaled to <body> to escape the hero's
          transformed/overflow-hidden ancestors. */}
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
