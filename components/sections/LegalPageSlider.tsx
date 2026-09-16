"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlareButton from "@/components/ui/GlareButton";

export type ResolvedSlide = {
  desktopImage: string;
  mobileImage: string;
  headline?: string;
  subheadline?: string;
  cta?: { label: string; url: string; videoUrl?: string; newTab?: boolean } | null;
};

/**
 * Full interactive carousel for the CMS "Image slider (multiple
 * banners)" background type — autoplay, prev/next arrows, dot nav, and
 * (HeroBlock.php's own field comment: "Optional per-slide override of
 * the section headline above") each slide's own headline/subheadline/
 * CTA overriding the section-level ones while it's showing.
 *
 * A client component because autoplay/nav need real state; LegalPage
 * itself (the server component) resolves every image/CTA up front and
 * passes plain, render-ready data down — no CMS shapes leak in here.
 */
export default function LegalPageSlider({
  slides,
  fallbackHeadline,
  fallbackSubheadlineHtml,
  autoplaySeconds,
  showArrows,
  overlay,
  hasMediaBackground,
}: {
  slides: ResolvedSlide[];
  fallbackHeadline: string;
  fallbackSubheadlineHtml: string;
  autoplaySeconds: number;
  showArrows: boolean;
  overlay: number;
  hasMediaBackground: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2 || autoplaySeconds <= 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoplaySeconds * 1000);
    return () => clearInterval(id);
  }, [slides.length, autoplaySeconds]);

  if (slides.length === 0) return null;
  const active = slides[Math.min(index, slides.length - 1)];
  const shownHeadline = active.headline?.trim() || fallbackHeadline;
  const shownSubheadline = active.subheadline?.trim() || fallbackSubheadlineHtml;

  return (
    <>
      {/* QC-caught: this always used slide.desktopImage regardless of
          viewport — the (typically much larger) desktop crop was being
          forced onto every mobile visitor, same mobile-first bug the
          single-image background type had before it was fixed. Each
          slide gets its own scoped class + media-query swap, same
          mechanism as the "image" background type above. */}
      <style>{`
        ${slides.map((_, i) => `.legal-slide-bg-${i}{background-image:linear-gradient(rgba(15,23,42,${overlay}),rgba(15,23,42,${overlay})),url(${slides[i].mobileImage})}`).join("\n")}
        @media (min-width:640px){${slides.map((_, i) => `.legal-slide-bg-${i}{background-image:linear-gradient(rgba(15,23,42,${overlay}),rgba(15,23,42,${overlay})),url(${slides[i].desktopImage})!important}`).join("\n")}}
      `}</style>
      {slides.map((_, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 legal-slide-bg-${i} ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
      ))}

      {showArrows && slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
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
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative z-10 max-w-[820px] mx-auto px-6">
        <h1 className={`font-[family-name:var(--font-dm-sans)] text-[32px] md:text-[44px] font-bold leading-[1.15] ${hasMediaBackground ? "text-white" : "text-[#111827]"}`}>
          {shownHeadline}
        </h1>
        {shownSubheadline && (
          <div
            className={`mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-relaxed [&_a]:underline [&_strong]:font-bold ${hasMediaBackground ? "text-white/85 [&_a]:text-white" : "text-[#6b7280] [&_a]:text-[#ff6d00]"}`}
            dangerouslySetInnerHTML={{ __html: shownSubheadline }}
          />
        )}
        {active.cta && (
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {active.cta.videoUrl || active.cta.url !== "#" ? (
              <GlareButton
                href={active.cta.url}
                videoUrl={active.cta.videoUrl}
                newTab={active.cta.newTab}
                className="px-7 py-[10px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white"
                style={{ backgroundImage: "linear-gradient(102deg, #ffa964 0%, #ff8e37 34%, #ff7812 50%, #ff6d00 120%)" }}
              >
                {active.cta.label}
              </GlareButton>
            ) : (
              <Link href={active.cta.url} className={hasMediaBackground ? "text-white underline" : "text-[#111827] underline"}>
                {active.cta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
