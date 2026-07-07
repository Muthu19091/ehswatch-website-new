"use client";

import GlareButton from "@/components/ui/GlareButton";

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
  const headline = cmsHeadline || "Built to Simplify EHSQ. Designed to Protect.";
  const subheadline =
    cmsSubheadline ||
    "The intelligent EHSQ platform trusted by 25K+ teams — making safety faster, simpler and more visible.";
  const ctaLabel = cmsPrimaryCtaLabel || "Book a Free Demo";
  const ctaHref = cmsPrimaryCtaUrl || "#";

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
      style={{
        minHeight: "62vh",
        background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248, 250, 252, 0.5) 100%)",
      }}
    >
      {/* Animated grid background */}
      <style>{`
        .about-grid-container {
          background-image:
            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        @keyframes aboutGridBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.6; }
        }

        .about-grid-box {
          position: absolute;
          width: 48px;
          height: 48px;
        }
      `}</style>

      {/* Grid + animated squares */}
      <div className="absolute inset-0 overflow-hidden about-grid-container pointer-events-none">
        {Array.from({ length: 200 }, (_, i) => {
          const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
          const colorVariant = i % 4;
          const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
          const animationDelay = (i * 0.3) % 12;
          const animationDuration = 4 + ((i * 2) % 6);
          const row = Math.floor(i / 20);
          const col = i % 20;

          return shouldAnimate ? (
            <div
              key={`about-grid-box-${i}`}
              className="about-grid-box"
              style={{
                left: `${col * 50 + 1}px`,
                top: `${row * 50 + 1}px`,
                backgroundColor: colors[colorVariant],
                animation: `aboutGridBoxFill ${animationDuration}s ease-in-out infinite`,
                animationDelay: `${animationDelay}s`,
              }}
            />
          ) : null;
        })}

        {/* Bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%)",
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-20 max-w-[720px] w-full mx-auto text-center flex flex-col items-center gap-5 md:gap-6">
        {cmsEyebrow && (
          <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise">
            {cmsEyebrow}
          </span>
        )}
        <h1
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[34px] sm:text-[48px] md:text-[58px] leading-[1.08] text-gray-900 tracking-[-0.03em] animate-hero-rise"
          style={{ animationDelay: "80ms" }}
          dangerouslySetInnerHTML={{ __html: headline }}
        />

        <p
          className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] md:text-[18px] text-gray-700 leading-[1.75] max-w-[460px] animate-hero-rise text-pretty"
          style={{ animationDelay: "200ms" }}
        >
          {subheadline}
        </p>

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
      </div>
    </section>
  );
}
