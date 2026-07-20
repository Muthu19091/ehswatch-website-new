"use client";

import Reveal from "@/components/ui/Reveal";
import CmsIcon from "@/components/ui/CmsIcon";

interface DriveItem {
  title: string;
  description: string;
  icon?: string | null;
}

interface AboutDrivesCmsProps {
  cmsHeading?: string | undefined;
  cmsSubheading?: string | undefined;
  cmsItems?: DriveItem[] | undefined;
}

const CARD_ICONS = [
  (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="9" stroke="#155eef" strokeWidth="1.6" />
      <circle cx="14" cy="14" r="4" fill="#155eef" opacity="0.2" />
      <circle cx="14" cy="14" r="1.8" fill="#155eef" />
      <path d="M14 2v3M14 23v3M2 14h3M23 14h3" stroke="#155eef" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M3 14s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" stroke="#155eef" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="14" cy="14" r="3" fill="#155eef" opacity="0.2" stroke="#155eef" strokeWidth="1.6" />
      <circle cx="14" cy="14" r="1.2" fill="#155eef" />
    </svg>
  ),
];

// The distinctive tab notch shape from the original design
function TabShape({ label, color }: { label: string; color: string }) {
  return (
    <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 z-10 w-[156px] h-[64px]">
      <svg viewBox="0 0 163 67" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
        <path
          d="M159.809 0C161.504 0 162.879 1.37488 162.879 3.07031V30.9293C162.879 33.7298 160.609 36 157.808 36H37C34.2386 36 32 38.2386 32 41V63.3002C32 64.1917 31.8106 65.1215 31.1368 65.7052C30.4235 66.3232 29.4935 66.6972 28.4756 66.6973H4.07031C1.82256 66.6973 7.03265e-05 64.8747 0 62.627V38.2217C2.32389e-05 37.6754 0.107858 37.1545 0.303293 36.6787C0.768235 35.5469 2.07433 35.1514 3.29792 35.1514H27.4746C30.2749 35.1514 32.5457 32.8813 32.5459 30.0811V5.07071C32.5459 2.27023 34.8161 0 37.6166 0H159.809Z"
          fill={color}
        />
      </svg>
      <span
        className="absolute font-[family-name:var(--font-dm-sans)] text-[13px] leading-[1.15] font-medium text-white"
        style={{ top: 0, left: "32px", right: "6px", height: "36px", display: "flex", alignItems: "center", paddingLeft: "8px" }}
      >
        {/* CMS labels can be long — clamp to two lines so they never spill out of the tab shape */}
        <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {label}
        </span>
      </span>
    </div>
  );
}

export default function AboutDrives({
  cmsHeading,
  cmsSubheading,
  cmsItems,
}: AboutDrivesCmsProps = {}) {
  // CMS-only: no hardcoded fallback heading or cards.
  const heading = cmsHeading?.trim() || "";
  const cards =
    cmsItems && cmsItems.length > 0
      ? cmsItems.map((item) => ({
          label: item.title || "",
          color: "#155eef",
          body: item.description || "",
          icon: item.icon ?? null,
        }))
      : [];

  // Nothing configured → hide the whole section.
  if (cards.length === 0) return null;

  return (
    <section className="bg-[#f1f7ff] py-[50px] md:py-[90px] lg:py-[110px] px-4 md:px-6">
      <div className="max-w-[1000px] mx-auto">

        {/* Heading */}
        <Reveal variant="fade-up" duration={700}>
          <div className="text-center mb-[60px] md:mb-[72px]">
            {heading && (
              <h2
                className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#1b1b1b] tracking-[-0.025em]"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
            {cmsSubheading && (
              <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[17px] text-[#6b7280] leading-relaxed max-w-[560px] mx-auto">
                {cmsSubheading}
              </p>
            )}
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[72px]">
          {cards.map((card, i) => (
            <Reveal key={`${card.label}-${i}`} variant={i === 0 ? "slide-right" : "slide-left"} duration={750} delay={i * 100}>
              <div className="relative pt-[44px]">
                <TabShape label={card.label} color={card.color} />

                {/* Card body */}
                <div
                  className="relative bg-white rounded-[24px] px-8 md:px-10 pt-10 pb-10 overflow-hidden"
                  style={{
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* Icon — CMS Lucide icon when set, original SVGs otherwise */}
                  <div className="mb-5 w-11 h-11 rounded-[12px] bg-[#eff6ff] flex items-center justify-center">
                    {card.icon ? (
                      <CmsIcon icon={card.icon} size={26} strokeWidth={1.8} color="#155eef" />
                    ) : (
                      CARD_ICONS[i % CARD_ICONS.length]
                    )}
                  </div>

                  {/* Text */}
                  <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.72] text-[#4b5563] tracking-[-0.01em]">
                    {card.body}
                  </p>

                  {/* Bottom-right blue glow */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      right: "-80px",
                      bottom: "-80px",
                      width: "280px",
                      height: "280px",
                      background: "radial-gradient(circle at center, rgba(21,94,239,0.1) 0%, rgba(21,94,239,0.04) 45%, transparent 72%)",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
