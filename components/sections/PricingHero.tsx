"use client";

import GlareButton from "@/components/ui/GlareButton";

interface PricingHeroProps {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

export default function PricingHero({
  eyebrow,
  headline = "Simple, Flexible Pricing for Enterprise EHS",
  subheadline = "Pay only for the modules you need. No hidden fees, no bundled features you won’t use — just the capabilities that match your EHS requirements.",
  primaryCtaLabel = "Build Your Package",
  primaryCtaHref = "#calculator",
  secondaryCtaLabel = "Book a Demo",
  secondaryCtaHref = "#",
}: PricingHeroProps = {}) {
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
      style={{
        minHeight: "52vh",
        background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",
      }}
    >
      <style>{`
        .pricing-grid-container {
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes pricingGridBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.6; }
        }
        .pricing-grid-box {
          position: absolute;
          width: 48px;
          height: 48px;
        }
      `}</style>

      {/* Animated grid */}
      <div className="absolute inset-0 overflow-hidden pricing-grid-container pointer-events-none">
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
              key={`pg-${i}`}
              className="pricing-grid-box"
              style={{
                left: `${col * 50 + 1}px`,
                top: `${row * 50 + 1}px`,
                backgroundColor: colors[colorVariant],
                animation: `pricingGridBoxFill ${animationDuration}s ease-in-out infinite`,
                animationDelay: `${animationDelay}s`,
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
      <div className="relative z-20 max-w-[760px] w-full mx-auto text-center flex flex-col items-center gap-5 md:gap-6">
        {eyebrow && (
          <span className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold uppercase tracking-[0.12em] text-[#1d4ed8]">
            {eyebrow}
          </span>
        )}
        <h1
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[34px] sm:text-[48px] md:text-[56px] leading-[1.08] text-gray-900 tracking-[-0.03em] animate-hero-rise"
          style={{ animationDelay: "80ms" }}
          dangerouslySetInnerHTML={{ __html: headline }}
        />

        <p
          className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] md:text-[18px] text-gray-600 leading-[1.75] max-w-[560px] animate-hero-rise text-pretty"
          style={{ animationDelay: "180ms" }}
        >
          {subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 animate-hero-rise" style={{ animationDelay: "280ms" }}>
          <GlareButton
            href={primaryCtaHref}
            className="inline-flex items-center gap-2 px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
            }}
          >
            {primaryCtaLabel}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </GlareButton>
          <GlareButton
            href={secondaryCtaHref}
            fillColor="#FFA660"
            hoverTextColor="#ffffff"
            className="px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] border"
            style={{ borderColor: "#d1d5db", color: "#374151" }}
          >
            {secondaryCtaLabel}
          </GlareButton>
        </div>
      </div>
    </section>
  );
}
