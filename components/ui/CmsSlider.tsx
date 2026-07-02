"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface CmsSlideItem {
  imageUrl: string;
  title?: string | null;
  caption?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}

interface CmsSliderProps {
  heading?: string | null;
  subheading?: string | null;
  slides: CmsSlideItem[];
  autoplay?: boolean;
  intervalMs?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
}

export default function CmsSlider({
  heading,
  subheading,
  slides,
  autoplay = true,
  intervalMs = 5000,
  loop = true,
  showArrows = true,
  showDots = true,
}: CmsSliderProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => {
      if (c === slides.length - 1) return loop ? 0 : c;
      return c + 1;
    });
  }, [slides.length, loop]);

  const prev = useCallback(() => {
    setCurrent((c) => {
      if (c === 0) return loop ? slides.length - 1 : c;
      return c - 1;
    });
  }, [slides.length, loop]);

  useEffect(() => {
    if (autoplay && slides.length > 1) {
      timerRef.current = setInterval(next, intervalMs);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [autoplay, intervalMs, next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section translate="no" className="py-[60px] md:py-[80px] px-6 bg-[#f8fafc]">
      {(heading || subheading) && (
        <div className="max-w-[1180px] mx-auto text-center mb-10">
          {heading && (
            <h2
              className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] md:text-[38px] leading-tight tracking-[-0.02em] text-[#0a0f1e] mb-3"
              dangerouslySetInnerHTML={{
                __html: heading.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">'),
              }}
            />
          )}
          {subheading && (
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.75] text-[#6b7280]">
              {subheading}
            </p>
          )}
        </div>
      )}

      <div className="max-w-[1180px] mx-auto relative">
        {/* Slide viewport */}
        <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: "16/6", minHeight: "240px" }}>
          {slides.map((slide, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.imageUrl} alt={slide.title || ""} className="w-full h-full object-cover" />

              {/* Text overlay */}
              {(slide.title || slide.caption || slide.ctaLabel) && (
                <div
                  className="absolute inset-0 flex flex-col justify-end p-6 md:p-10"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 60%)" }}
                >
                  {slide.title && (
                    <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[28px] text-white mb-1.5">
                      {slide.title}
                    </h3>
                  )}
                  {slide.caption && (
                    <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-white/80 mb-4">
                      {slide.caption}
                    </p>
                  )}
                  {slide.ctaLabel && slide.ctaUrl && (
                    <a
                      href={slide.ctaUrl}
                      className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[13px] text-white"
                      style={{ background: "linear-gradient(102.8deg, #ffa964 0.12%, #ff6d00 119.92%)" }}
                    >
                      {slide.ctaLabel}
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105"
              style={{ background: "rgba(255,255,255,0.88)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="#0a0f1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105"
              style={{ background: "rgba(255,255,255,0.88)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="#0a0f1e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Dot nav */}
        {showDots && slides.length > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "24px" : "8px",
                  height: "8px",
                  background: i === current ? "#1d4ed8" : "#d1d5db",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
