"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { basePath } from "@/lib/basePath";

const panel = (file: string) =>
  `${basePath}/images/work-environments/panels/${file}`;

interface Card {
  key: string;
  title: string;
  desc: string;
  tx: number;   /* text left % */
  ty: number;   /* text top  % */
  tw: number;   /* text maxWidth % */
  iw: number;   /* image width % */
  il: number;   /* image left % */
  idx?: number; /* image left px offset (construction only) */
  noFade?: boolean;
  imgSrc: string;
  videoSrc?: string; /* CMS card video — takes over the panel when present */
}

interface SolutionCarouselCard {
  title: string;
  subheading?: string;
  description?: string;
  image?: { url?: string } | string | null;
  video?: { url?: string } | string | null;
}

// CMS image/video may arrive as a media object ({url}) or a plain URL string
function cardMediaUrl(media: { url?: string } | string | null | undefined): string | undefined {
  if (!media) return undefined;
  if (typeof media === "string") return media;
  return media.url || undefined;
}

interface WorkEnvironmentsProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsEyebrow?: string;
  cmsCards?: SolutionCarouselCard[];
  cmsCta?: { label: string; url: string };
}


// Layout metadata for up to 6 cards (positional display config)
const CARD_LAYOUT: Omit<Card, "title" | "desc" | "imgSrc">[] = [
  { key: "construction", tx: 4.8, ty: 6,    tw: 50, iw: 93.4, il: 10.1, idx: -5, noFade: true },
  { key: "manufacturing",tx: 7.7, ty: 5.3,  tw: 50, iw: 89.5, il: 13.1, noFade: true },
  { key: "oilgas",       tx: 3.2, ty: 13.4, tw: 49, iw: 90.1, il: 9.9  },
  { key: "logistics",    tx: 7.3, ty: 13.4, tw: 67, iw: 92.2, il: 7.3  },
  { key: "utilities",    tx: 1.3, ty: 10,   tw: 59, iw: 75.3, il: 11.8, noFade: true },
  { key: "facilities",   tx: 4.8, ty: 11.3, tw: 58, iw: 91,   il: 2.7  },
];

// Map title keywords to panel image filenames
function inferPanelImage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("construct")) return panel("Construction%20%26%20Infrastructure%20Projects.png");
  if (t.includes("manufactur") || t.includes("engineer")) return panel("Manufacturing%20%26%20Engineering.png");
  if (t.includes("oil") || t.includes("gas") || t.includes("energy")) return panel("Oil%2C%20Gas%20%26%20Energy.png");
  if (t.includes("logistic") || t.includes("warehouse") || t.includes("transport")) return panel("Logistics%2C%20Warehousing%20%26%20Transport.png");
  if (t.includes("utilit") || t.includes("public")) return panel("Utilities%20and%20Public%20Services.png");
  if (t.includes("facilit") || t.includes("property")) return panel("Facilities%20%26%20Property%20Management.png");
  return panel("Construction%20%26%20Infrastructure%20Projects.png");
}

function buildCards(cmsCards?: SolutionCarouselCard[]): Card[] {
  // CMS-only: no hardcoded fallback cards. Text comes from the CMS; the
  // industry panel illustration is a design asset used when a card has no
  // uploaded image/video.
  if (!cmsCards || cmsCards.length === 0) return [];
  return cmsCards.map((c, i) => {
    const layout = CARD_LAYOUT[i % CARD_LAYOUT.length];
    return {
      ...layout,
      key: `${layout.key}-${i}`,
      title: c.title || "",
      desc:  c.subheading || c.description || "",
      imgSrc: cardMediaUrl(c.image) ?? inferPanelImage(c.title || ""),
      videoSrc: cardMediaUrl(c.video),
    };
  });
}

function IndustryCard({ card }: { card: Card }) {
  return (
    <div className="relative h-full min-h-[340px] sm:min-h-0 overflow-hidden bg-[#f8fbff]">
      {/* Text block — percentage-positioned */}
      <div
        className="absolute z-10 flex flex-col gap-[4px]"
        style={{ top: `${card.ty}%`, left: `${card.tx}%`, maxWidth: `${card.tw}%` }}
      >
        <h3 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] md:text-[17px] lg:text-[20px] text-[#1b1b1b] leading-[1.3] text-balance">
          {card.title}
        </h3>
        <p
          className="font-[family-name:var(--font-dm-sans)] font-normal text-[11px] md:text-[12px] lg:text-[14px] text-[#727272] tracking-[-0.18px] leading-[1.5] text-pretty"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {card.desc}
        </p>
      </div>

      {/* Top gradient fade — hides image behind text (skipped on noFade cards) */}
      {!card.noFade && (
        <div
          className="absolute inset-x-0 top-0 z-[5] pointer-events-none"
          style={{ height: "48%", background: "linear-gradient(to bottom, #f8fbff 42%, rgba(248,251,255,0))" }}
          aria-hidden
        />
      )}

      {/* Panel media — pinned to bottom, percentage width and left. A CMS
          card video takes over the panel when present; otherwise the image. */}
      {(() => {
        const mediaStyle: CSSProperties = {
          position: "absolute",
          bottom: 0,
          left: card.idx != null ? `calc(${card.il}% + ${card.idx}px)` : `${card.il}%`,
          width: `${card.iw}%`,
          height: "auto",
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
        };
        return card.videoSrc ? (
          <video
            src={card.videoSrc}
            poster={card.imgSrc}
            autoPlay
            muted
            loop
            playsInline
            style={mediaStyle}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={card.imgSrc} alt="" draggable={false} style={mediaStyle} />
        );
      })()}
    </div>
  );
}

export default function WorkEnvironments({ cmsHeading, cmsSubheading, cmsEyebrow, cmsCards, cmsCta }: WorkEnvironmentsProps) {
  const cards = buildCards(cmsCards);
  const [expanded, setExpanded] = useState(false);

  // CMS-only: hide the whole section when there are no cards.
  if (cards.length === 0) return null;

  const INITIAL_COUNT = 6;
  const hasMore = cards.length > INITIAL_COUNT;
  const visibleCards = expanded ? cards : cards.slice(0, INITIAL_COUNT);

  // Pair cards into rows; column widths alternate to keep the mosaic rhythm
  const rows: Card[][] = [];
  for (let i = 0; i < visibleCards.length; i += 2) {
    rows.push(visibleCards.slice(i, i + 2));
  }

  // CMS-only: no hardcoded heading.
  const heading    = cmsHeading?.trim()    || "";
  const subheading = cmsSubheading?.trim() || "";

  // Split heading to apply blue highlight to last two words
  const headingWords = heading.split(" ");
  const highlightCount = 2;
  const headingMain  = headingWords.slice(0, -highlightCount).join(" ");
  const headingBlue  = headingWords.slice(-highlightCount).join(" ");

  return (
    <section className="bg-[#f8fbff] pt-[60px] md:pt-[80px] lg:pt-[106px] pb-[60px] md:pb-[80px]">
      <div className="max-w-[1180px] mx-auto px-4 md:px-6">

        <div className="text-center max-w-[820px] mx-auto">
          {cmsEyebrow?.trim() && (
            <p className="mb-3 font-[family-name:var(--font-dm-sans)] text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8]">
              {cmsEyebrow}
            </p>
          )}
          {heading && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] leading-[1.18] text-[#1b1b1b] text-balance">
              {headingMain}{" "}
              <span className="text-[#155eef]">{headingBlue}</span>
            </h2>
          )}
          {subheading && (
            <p
              className="mt-[16px] font-[family-name:var(--font-dm-sans)] font-medium text-[13px] md:text-[15px] lg:text-[16px] text-[#727272] leading-[1.64] tracking-[-0.18px] max-w-[640px] mx-auto text-pretty"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {subheading}
            </p>
          )}
        </div>

        {/* Grid — border-t closes top, each row has border-b.
            Column widths alternate 603/665 per row to keep the mosaic rhythm. */}
        <div className="mt-[44px] md:mt-[56px] lg:mt-[68px] border-t border-[#e2e8f0]">
          {rows.map((row, rowIdx) => {
            const widths = rowIdx % 2 === 0 ? ([603, 665] as const) : ([665, 603] as const);
            // Static class strings so Tailwind compiles the arbitrary aspect-ratios
            const ASPECT: Record<number, string> = {
              603: "sm:[aspect-ratio:603/470]",
              665: "sm:[aspect-ratio:665/470]",
              1268: "sm:[aspect-ratio:1268/470]",
            };
            const [left, right] = row;
            return (
              <div key={rowIdx} className="flex flex-col sm:flex-row border-b border-[#e2e8f0]">
                <div
                  className={`${right ? "sm:border-r border-[#e2e8f0] " + ASPECT[widths[0]] : ASPECT[1268]}`}
                  style={{ flex: right ? `${widths[0]} ${widths[0]} 0%` : "1 1 100%" }}
                >
                  {left && <IndustryCard card={left} />}
                </div>
                {right && (
                  <div className={ASPECT[widths[1]]} style={{ flex: `${widths[1]} ${widths[1]} 0%` }}>
                    <IndustryCard card={right} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View more / less — reveals the remaining industry cards */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setExpanded((e) => !e)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#d3ddeb] bg-white font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#4b5563] hover:border-[#FF6D00] hover:text-[#FF6D00] transition-colors duration-200 cursor-pointer"
            >
              {expanded ? "View less" : "View more"}
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
              >
                <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}

        {/* Section CTA — links to the industries/solutions page (from CMS) */}
        {cmsCta?.label && cmsCta.url && (
          <div className="flex justify-center mt-8">
            <Link
              href={cmsCta.url}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-white whitespace-nowrap transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(102deg, #ffa964 0%, #ff8e37 34%, #ff7812 50%, #ff6d00 120%)" }}
            >
              {cmsCta.label}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
