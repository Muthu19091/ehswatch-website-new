"use client";

import GlareButton from "@/components/ui/GlareButton";

interface SolutionsHeroProps {
  cmsEyebrow?: string;
  cmsHeadline?: string;
  cmsSubheadline?: string;
  cmsPrimaryCta?: { label: string; url: string };
  cmsSecondaryCta?: { label: string; url: string };
}

export default function SolutionsHero({
  cmsEyebrow,
  cmsHeadline,
  cmsSubheadline,
  cmsPrimaryCta,
  cmsSecondaryCta,
}: SolutionsHeroProps = {}) {
  if (!cmsHeadline) return null;

  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
      style={{
        minHeight: "60vh",
        background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",
      }}
    >
      <style>{`
        .sol-grid {
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes solBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.55; }
        }
        .sol-box {
          position: absolute;
          width: 48px;
          height: 48px;
        }
      `}</style>

      {/* Animated grid */}
      <div className="absolute inset-0 overflow-hidden sol-grid pointer-events-none">
        {Array.from({ length: 200 }, (_, i) => {
          const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
          const colorVariant = i % 4;
          const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
          const delay = (i * 0.3) % 12;
          const duration = 4 + ((i * 2) % 6);
          const row = Math.floor(i / 20);
          const col = i % 20;
          return shouldAnimate ? (
            <div
              key={i}
              className="sol-box"
              style={{
                left: `${col * 50 + 1}px`,
                top: `${row * 50 + 1}px`,
                backgroundColor: colors[colorVariant],
                animation: `solBoxFill ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          ) : null;
        })}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 75% 75% at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 50%, transparent 100%)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-[900px] w-full mx-auto text-center flex flex-col items-center gap-5 md:gap-6">
        {cmsEyebrow && (
          <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise">
            {cmsEyebrow}
          </span>
        )}
        <h1
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[42px] md:text-[54px] leading-[1.08] text-gray-900 tracking-[-0.03em] animate-hero-rise"
          style={{ animationDelay: "80ms" }}
          dangerouslySetInnerHTML={{
            __html: cmsHeadline.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">'),
          }}
        />

        {cmsSubheadline && (
          <p
            className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] leading-[1.8] text-[#6b7280] max-w-[540px] text-pretty animate-hero-rise"
            style={{ animationDelay: "180ms" }}
          >
            {cmsSubheadline}
          </p>
        )}
        {(cmsPrimaryCta || cmsSecondaryCta) && (
          <div className="flex flex-wrap gap-3 justify-center animate-hero-rise" style={{ animationDelay: "320ms" }}>
            {cmsPrimaryCta && (
              <GlareButton
                href={cmsPrimaryCta.url}
                className="px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                  boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
                }}
              >
                {cmsPrimaryCta.label}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </GlareButton>
            )}
            {cmsSecondaryCta && (
              <GlareButton
                href={cmsSecondaryCta.url}
                fillColor="#FFA660"
                hoverTextColor="#ffffff"
                className="px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-[#1b1b1b] border border-[#d1d5db] hover:border-[#9ca3af]"
              >
                {cmsSecondaryCta.label}
              </GlareButton>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
