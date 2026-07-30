"use client";

import React, { useEffect, useRef, useState } from "react";


function resolveVideoUrl(video: unknown): string | null {
  // CMS sends video either as a media object ({url}) or a plain URL string.
  let v: string | null = null;
  if (typeof video === "string") v = video;
  else if (video && typeof video === "object" && "url" in video) {
    v = (video as { url?: string | null }).url ?? null;
  }
  if (!v) return null;
  if (v.startsWith("/")) return `https://stage.odigma.ooo${v}`;
  return v;
}

interface Solution {
  heading: string;
  body: string;
}
interface Industry {
  label: string;
  subcopy: string;
  video: string | null;
  gif: string | null;
  risks: string[];
  solutions: Solution[];
}

/* ── Placeholder visual ── */
function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-2xl"
      style={{ background: "linear-gradient(135deg, #EEF4FF 0%, #F8FBFF 100%)" }}
    >
      <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center" style={{ boxShadow: "0 6px 20px rgba(21,94,239,0.08)" }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="#155eef" strokeWidth="1.6"/>
          <circle cx="8.5" cy="10" r="1.6" stroke="#155eef" strokeWidth="1.4"/>
          <path d="M5 17l4-4 3 2.5L16 11l3 3" stroke="#155eef" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280]">
        {label} illustration coming soon
      </p>
    </div>
  );
}

/* ── Media panel ── */
function MediaBlock({ industry }: { industry: Industry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setVideoReady(false);
    const vid = videoRef.current;
    if (!vid) return;
    vid.load();
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, [industry]);

  if (!industry.video && !industry.gif) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <MediaPlaceholder label={industry.label} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {industry.video && !videoReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#e2e8f0] border-t-[#155eef] animate-spin" />
        </div>
      )}

      {industry.video ? (
        <video
          key={industry.video}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className="w-full h-full"
          style={{
            objectFit: "contain",
            objectPosition: "center",
            transform: "scale(1.4)",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <source src={industry.video} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={industry.gif!}
          alt={industry.label}
          onLoad={() => setVideoReady(true)}
          className="w-full h-full"
          style={{
            objectFit: "contain",
            transform: "scale(0.85)",
            opacity: 1,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
    </div>
  );
}

export interface CmsIndustryCard {
  title: string;
  subheading?: string;
  typical_risks?: string;
  video?: string | { url?: string | null } | null;
  accordion_items?: Record<string, { title?: string; description?: string }>;
}

function cmsCardToIndustry(card: CmsIndustryCard): Industry {
  const solutions: Solution[] = card.accordion_items
    ? Object.values(card.accordion_items)
        .filter((a) => a.title)
        .map((a) => ({ heading: a.title!, body: a.description || "" }))
    : [];
  // A CMS "video" field can actually hold an animated GIF. A <video> element
  // cannot decode a GIF, so its canplay event never fires and the panel spins
  // forever. Route real video files to <video> and everything else (gif/png/
  // jpg/webp) to <img>, which paints progressively and fires onLoad.
  const media = resolveVideoUrl(card.video ?? null);
  const isVideoFile = !!media && /\.(mp4|webm|ogg|mov|m4v)(?:[?#]|$)/i.test(media);
  // typical_risks is a single newline-separated string in the CMS.
  const risks = (card.typical_risks || "")
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter(Boolean);
  return {
    label:     card.title,
    subcopy:   card.subheading || "",
    video:     isVideoFile ? media : null,
    gif:       media && !isVideoFile ? media : null,
    risks,
    solutions: solutions.length > 0 ? solutions : [],
  };
}

/* ── Main ── */
export default function SolutionsZigzag({
  cmsCards,
  cmsHeading,
  cmsSubheading,
  cmsEyebrow,
}: {
  cmsCards?: CmsIndustryCard[];
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsEyebrow?: string;
}) {
  if (!cmsCards || cmsCards.length === 0) return null;

  const ACTIVE = cmsCards.map(cmsCardToIndustry);

  const [activeIdx, setActiveIdx] = useState(0);
  const [openIdx, setOpenIdx] = useState(0);

  const industry = ACTIVE[activeIdx];

  function handleTab(i: number) {
    setActiveIdx(i);
    setOpenIdx(0);
  }

  return (
    <section className="bg-white py-12 md:py-20 px-6">
      <div className="max-w-[1240px] mx-auto">

        {/* Section header (eyebrow / heading / subheading) — from the CMS
            solution_carousel block; renders only when provided. */}
        {(cmsEyebrow || cmsHeading || cmsSubheading) && (
          <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-12">
            {cmsEyebrow?.trim() && (
              <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
                {cmsEyebrow}
              </p>
            )}
            {cmsHeading?.trim() && (
              <h2
                className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[34px] md:text-[40px] leading-[1.18] text-[#1b1b1b] tracking-[-0.02em] text-balance"
                dangerouslySetInnerHTML={{ __html: cmsHeading }}
              />
            )}
            {cmsSubheading?.trim() && (
              <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.7] text-[#6b7280] max-w-[640px] mx-auto text-pretty">
                {cmsSubheading}
              </p>
            )}
          </div>
        )}

        {/* Tab bar — wraps on desktop, scrolls on mobile */}
        <div className="hidden md:flex flex-wrap gap-2 justify-center mb-8">
          {ACTIVE.map((ind, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                onClick={() => handleTab(i)}
                className="px-[15px] py-[7px] rounded-full text-[13px] font-medium transition-all duration-200"
                style={isActive ? {
                  background: "#FFF3EC",
                  color: "#FF6D00",
                  border: "1.5px solid #FF9A5C",
                  fontWeight: 600,
                } : {
                  background: "white",
                  color: "#374151",
                  border: "1.5px solid #e5e7eb",
                }}
              >
                {ind.label}
              </button>
            );
          })}
        </div>

        {/* Mobile — wrapping tab row so every industry is visible (no hidden scroll) */}
        <div className="md:hidden mb-6">
          <div className="flex flex-wrap gap-2">
            {ACTIVE.map((ind, i) => {
              const isActive = activeIdx === i;
              return (
                <button
                  key={i}
                  onClick={() => handleTab(i)}
                  className="flex-shrink-0 px-[14px] py-[7px] rounded-full text-[12.5px] font-medium whitespace-nowrap transition-all duration-200"
                  style={isActive ? {
                    background: "#FFF3EC",
                    color: "#FF6D00",
                    border: "1.5px solid #FF9A5C",
                    fontWeight: 600,
                  } : {
                    background: "white",
                    color: "#374151",
                    border: "1.5px solid #e5e7eb",
                  }}
                >
                  {ind.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left — media */}
          <div className="order-2 lg:order-1" style={{ aspectRatio: "4/3" }}>
            <MediaBlock key={industry.label} industry={industry} />
          </div>

          {/* Right — copy */}
          <div className="order-1 lg:order-2 flex flex-col">
            <h3
              className="font-[family-name:var(--font-gothic-a1)] font-bold leading-[1.15] text-[#0a0f1e]"
              style={{ fontSize: "clamp(20px, 1.9vw, 27px)" }}
            >
              {/* Number is derived from tab position (activeIdx), so reordering
                  cards in the CMS auto-renumbers — not baked into the title. */}
              {activeIdx + 1}. {industry.label}
            </h3>
            <p
              className="font-[family-name:var(--font-dm-sans)] mt-3 mb-7 text-[15px] md:text-[16px] leading-[1.7] text-[#6b7280] text-pretty"
              style={{ maxWidth: 520 }}
            >
              {industry.subcopy}
            </p>

            {/* Typical Risks — newline-separated list from the CMS card */}
            {industry.risks.length > 0 && (
              <div className="mb-7" style={{ maxWidth: 520 }}>
                <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[12px] uppercase tracking-[0.14em] text-[#1d4ed8] mb-3">
                  Typical Risks
                </p>
                <ul className="flex flex-col gap-2">
                  {industry.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 rounded-full mt-[8px]"
                        style={{ width: 6, height: 6, background: "#FF6D00" }}
                      />
                      <span className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.6] text-[#6b7280] text-pretty">
                        {risk}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {industry.solutions.length > 0 && (
              <p className="font-[family-name:var(--font-dm-sans)] font-semibold text-[12px] uppercase tracking-[0.14em] text-[#1d4ed8] mb-2">
                How EHSWatch Solves Them
              </p>
            )}

            <div className="flex flex-col">
              {industry.solutions.map((sol, i) => {
                const open = openIdx === i;
                return (
                  <div key={i} style={{ borderTop: i > 0 ? "1px solid #F0F0F0" : "none" }}>
                    <button
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      className="w-full flex items-start gap-3 py-[14px] text-left"
                    >
                      <span
                        className="flex-shrink-0 rounded-full mt-[7px]"
                        style={{ width: 7, height: 7, background: "#FF6D00", opacity: open ? 1 : 0.55 }}
                      />
                      <span
                        className="font-[family-name:var(--font-gothic-a1)] font-bold text-[15px] flex-1"
                        style={{ color: open ? "#0a0f1e" : "#374151", transition: "color 0.2s" }}
                      >
                        {sol.heading}
                      </span>
                    </button>

                    <div
                      style={{
                        maxHeight: open ? 280 : 0,
                        opacity: open ? 1 : 0,
                        overflow: "hidden",
                        transition: "max-height 0.4s ease, opacity 0.35s ease",
                      }}
                    >
                      <p className="font-[family-name:var(--font-dm-sans)] text-[13.5px] leading-[1.7] text-[#6b7280] pl-[19px] pb-[14px] text-pretty">
                        {sol.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
