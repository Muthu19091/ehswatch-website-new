"use client";

interface SupportHeroProps {
  cmsEyebrow?: string;
  cmsHeadline?: string;
  cmsSubheadline?: string;
}

export default function SupportHero({ cmsEyebrow, cmsHeadline, cmsSubheadline }: SupportHeroProps = {}) {
  // CMS-only: no hardcoded fallback headline.
  const headlineHtml = (cmsHeadline?.trim() || "")
    .replace(/<span\b[^>]*>/gi, '<span style="color:#155eef">');
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
      style={{
        minHeight: "52vh",
        background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",
      }}
    >
      <style>{`
        .sup-grid {
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes supBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.55; }
        }
        .sup-box {
          position: absolute;
          width: 48px;
          height: 48px;
        }
      `}</style>

      {/* Animated grid */}
      <div className="absolute inset-0 overflow-hidden sup-grid pointer-events-none">
        {Array.from({ length: 200 }, (_, i) => {
          const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
          const colorVariant = i % 4;
          const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
          const delay = (i * 0.45) % 4;
          const duration = 4 + ((i * 2) % 6);
          const row = Math.floor(i / 20);
          const col = i % 20;
          return shouldAnimate ? (
            <div
              key={i}
              className="sup-box"
              style={{
                left: `${col * 50 + 1}px`,
                top: `${row * 50 + 1}px`,
                backgroundColor: colors[colorVariant],
                animation: `supBoxFill ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          ) : null;
        })}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-[760px] w-full mx-auto text-center flex flex-col items-center gap-4 md:gap-5">
        {cmsEyebrow?.trim() && (
          <span className="font-[family-name:var(--font-dm-sans)] text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise">
            {cmsEyebrow}
          </span>
        )}
        {headlineHtml && (
          <h1
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[42px] md:text-[52px] leading-[1.1] text-[#0f1728] tracking-[-0.02em] animate-hero-rise"
            style={{ animationDelay: "80ms" }}
            dangerouslySetInnerHTML={{ __html: headlineHtml }}
          />
        )}
        {cmsSubheadline?.trim() && (
          /* CMS rich text — render as HTML so <p>/<br>/<strong>/<a> format
             correctly instead of showing the literal tags. Uses a div (not p)
             so a wrapping <p> from the editor is valid, with inner margins
             reset to keep the single-subheadline look. */
          <div
            className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] md:text-[18px] text-[#6b7280] leading-[1.75] max-w-[560px] animate-hero-rise text-pretty [&_p]:m-0 [&_a]:text-[#155eef] [&_a]:underline [&_strong]:font-semibold"
            style={{ animationDelay: "200ms" }}
            dangerouslySetInnerHTML={{ __html: cmsSubheadline }}
          />
        )}
      </div>
    </section>
  );
}
