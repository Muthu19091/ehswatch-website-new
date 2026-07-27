"use client";

import GlareButton from "@/components/ui/GlareButton";
import DotGrid from "@/components/ui/DotGrid";

interface AboutHeroCmsProps {
  cmsEyebrow?: string | undefined;
  cmsHeadline?: string | undefined;
  cmsSubheadline?: string | undefined;
  cmsPrimaryCtaLabel?: string | undefined;
  cmsPrimaryCtaUrl?: string | undefined;
}

export default function AboutHero({
  cmsEyebrow,
  cmsHeadline,
  cmsSubheadline,
  cmsPrimaryCtaLabel,
  cmsPrimaryCtaUrl,
}: AboutHeroCmsProps = {}) {
  // CMS-only: no hardcoded fallback copy.
  const headline = cmsHeadline?.trim() || "";
  const subheadline = cmsSubheadline?.trim() || "";
  // Button renders only when configured in the CMS (label + real link).
  const ctaLabel = cmsPrimaryCtaLabel?.trim();
  const ctaHref = cmsPrimaryCtaUrl?.trim();
  const showCta = !!ctaLabel && !!ctaHref && ctaHref !== "#";

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
      style={{
        minHeight: "62vh",
        background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248, 250, 252, 0.5) 100%)",
      }}
    >
      {/* DotGrid background — same interactive dot grid as the home hero */}
      <div className="absolute inset-0 z-0">
        <DotGrid />
      </div>

      {/* White radial mask behind the text so the dots never highlight behind
          the copy, while the grid stays visible toward the edges. */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 62% at 50% 50%, rgba(255,255,255,0.96) 28%, rgba(255,255,255,0.6) 56%, rgba(255,255,255,0) 84%)",
        }}
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%)",
        }}
      />

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

        {showCta && (
        <GlareButton
          href={ctaHref}
          className="gap-2 px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white animate-hero-rise hover:shadow-lg"
          style={{
            animationDelay: "320ms",
            backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
            boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
          }}
        >
          {ctaLabel}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </GlareButton>
        )}
      </div>
    </section>
  );
}
