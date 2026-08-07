"use client";

import GlareButton from "@/components/ui/GlareButton";
import DotGrid from "@/components/ui/DotGrid";

interface Props {
  cmsEyebrow?: string;
  cmsHeadline?: string;
  cmsSubheadline?: string;
  cmsPrimaryCta?: { label: string; url: string };
  cmsSecondaryCta?: { label: string; url: string };
}

export default function CaseStudiesHero({ cmsEyebrow, cmsHeadline, cmsSubheadline, cmsPrimaryCta, cmsSecondaryCta }: Props) {
  // CMS-only: buttons render only when configured in the CMS.
  const primaryCta = cmsPrimaryCta;
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-6 pt-[148px] pb-[72px]"
      style={{
        background: "linear-gradient(to bottom, white 0%, white 70%, #FFFFFF 100%)",
      }}
    >
      <style>{`
        .cs-grid {
          background-image:
            linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes csBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.5; }
        }
        .cs-box { position: absolute; width: 48px; height: 48px; }
      `}</style>

      <div className="absolute inset-0 z-0"><DotGrid /></div>
      <div className="absolute inset-0 overflow-hidden cs-grid pointer-events-none hidden">
        {Array.from({ length: 200 }, (_, i) => {
          const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
          const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
          return shouldAnimate ? (
            <div
              key={i}
              className="cs-box"
              style={{
                left: `${(i % 20) * 50 + 1}px`,
                top: `${Math.floor(i / 20) * 50 + 1}px`,
                backgroundColor: colors[i % 4],
                animation: `csBoxFill ${4 + ((i * 2) % 6)}s ease-in-out infinite`,
                animationDelay: `${(i * 0.45) % 4}s`,
              }}
            />
          ) : null;
        })}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 60%, #FFFFFF 100%)" }}
        />
      </div>

      <div className="relative z-20 max-w-[720px] w-full mx-auto text-center flex flex-col items-center gap-5">
        {cmsEyebrow?.trim() && (
          <span
            className="font-[family-name:var(--font-dm-sans)] text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise"
          >
            {cmsEyebrow}
          </span>
        )}
        {cmsHeadline?.trim() && (
          <h1
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] sm:text-[46px] md:text-[56px] leading-[1.06] tracking-[-0.03em] animate-hero-rise"
            style={{ color: "#0a1628", animationDelay: "80ms" }}
          >
            {/* CMS headline may carry a <span> for the blue highlight — render it, restyled */}
            <span
              dangerouslySetInnerHTML={{
                __html: cmsHeadline.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">'),
              }}
            />
          </h1>
        )}
        {cmsSubheadline?.trim() && (
          <p
            className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] leading-[1.8] max-w-[580px] animate-hero-rise"
            style={{ color: "#6b7280", animationDelay: "200ms", textWrap: "pretty" } as React.CSSProperties}
          >
            {cmsSubheadline}
          </p>
        )}
        {(primaryCta || cmsSecondaryCta) && (
        <div className="flex flex-wrap gap-3 justify-center animate-hero-rise" style={{ animationDelay: "320ms" }}>
          {primaryCta && (
          <GlareButton
            href={primaryCta.url}
            className="gap-2 px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white"
            style={{
              backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
            }}
          >
            {primaryCta.label}
          </GlareButton>
          )}
          {cmsSecondaryCta && (
            <GlareButton
              href={cmsSecondaryCta.url}
              fillColor="#FFA660"
              hoverTextColor="#ffffff"
              className="gap-2 px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] border"
              style={{ borderColor: "#d1d5db", color: "#374151" }}
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
