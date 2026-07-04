"use client";

import React, { useState } from "react";
import { mediaUrl } from "@/lib/blocks";
import type { CmsCaseStudy } from "@/lib/types";

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
interface Card {
  slug: string;
  title: string;
  body: string;
  img: string | null;
  industry?: string;
  metricValue?: string;
  metricLabel?: string;
}

/* ═══════════════════════════════════════════════════════
   FALLBACK DATA
═══════════════════════════════════════════════════════ */
const UNSPLASH = "https://images.unsplash.com";

const FALLBACK_CARDS: Card[] = [
  {
    slug: "construction",
    title: "42% faster incident reporting across 18 active construction sites.",
    body: "Al Masood Infrastructure replaced paper forms and email chains with EHSWatch. Safety managers now receive incident reports in minutes — not days — across every site, every shift.",
    img: UNSPLASH + "/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=700&h=400&q=75",
  },
  {
    slug: "oil-gas",
    title: "Zero missed permit closures across a multi-rig offshore operation.",
    body: "Gulf Energy Services digitised their entire permit-to-work workflow. Every permit is now issued, tracked, and formally closed in real time — with no slippage, no paper, no gaps.",
    img: UNSPLASH + "/photo-1548337138-e87d889cc369?auto=format&fit=crop&w=700&h=400&q=75",
  },
  {
    slug: "utilities",
    title: "Full site risk visibility achieved in under 8 weeks.",
    body: "National Grid Services deployed EHSWatch enterprise-wide across multiple regions in eight weeks, giving leadership a live risk dashboard across every field team and open action.",
    img: UNSPLASH + "/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&h=400&q=75",
  },
  {
    slug: "manufacturing",
    title: "Audit cycles cut by 60% — and the team is audit-ready every day.",
    body: "Apex Industrial Group moved from weeks of manual prep to on-demand compliance. Inspection checklists, corrective actions, and audit records are all captured digitally and available instantly.",
    img: UNSPLASH + "/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=700&h=400&q=75",
  },
];

function cmsToCard(cs: CmsCaseStudy): Card {
  const r = cs.attributes.results?.[0];
  return {
    slug: cs.attributes.slug,
    title: cs.attributes.title,
    body: cs.attributes.summary || "",
    img: mediaUrl(cs.attributes.cover) ?? null,
    industry: cs.attributes.industry || undefined,
    metricValue: r?.value ?? r?.after ?? undefined,
    metricLabel: r?.label ?? r?.metric ?? undefined,
  };
}

/* Branded cover panel shown when a study has no uploaded image — surfaces the
   industry + headline result so the card still reads as complete. */
function CoverPanel({ card, index }: { card: Card; index: number }) {
  const grads = [
    "linear-gradient(135deg,#0a1628 0%,#12325f 100%)",
    "linear-gradient(135deg,#064e3b 0%,#059669 100%)",
    "linear-gradient(135deg,#0c4a6e 0%,#0284c7 100%)",
    "linear-gradient(135deg,#1e293b 0%,#334155 100%)",
  ];
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2 px-6 text-center"
      style={{ background: grads[index % grads.length], minHeight: 180 }}
    >
      {card.industry && (
        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
          {card.industry}
        </span>
      )}
      {card.metricValue && (
        <span
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[46px] leading-none tracking-[-0.03em] text-white"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {card.metricValue}
        </span>
      )}
      {card.metricLabel && (
        <span className="font-[family-name:var(--font-dm-sans)] text-[12px] text-white/60 max-w-[220px] leading-[1.4]">
          {card.metricLabel}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CTA
═══════════════════════════════════════════════════════ */
function KnowMore({ hovered }: { hovered: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold"
      style={{ color: hovered ? "#ea6c00" : "#F97316", transition: "color 0.2s" }}
    >
      Know more
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   WIDE CARD
═══════════════════════════════════════════════════════ */
const PLACEHOLDER_COLORS = ["#EFF6FF", "#DBEAFE", "#E0F2FE", "#F0FDF4"];

function WideCard({ card, index }: { card: Card; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`/case-studies/${card.slug}`}
      className="flex flex-col md:flex-row bg-white overflow-hidden w-full"
      style={{
        border: "1px solid #F0F0F0",
        borderRadius: 16,
        boxShadow: hovered ? "0 6px 32px rgba(0,0,0,0.06)" : "none",
        transition: "box-shadow 0.25s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Text */}
      <div className="flex flex-col justify-center px-8 py-10 md:px-12 md:py-12" style={{ flex: "0 0 50%" }}>
        <h3
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[21px] leading-[1.3] mb-4"
          style={{ color: "#111827", textWrap: "pretty" } as React.CSSProperties}
        >
          {card.title}
        </h3>
        <p
          className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.7]"
          style={{ color: "#6B7280", textWrap: "pretty" } as React.CSSProperties}
        >
          {card.body}
        </p>
        <div className="my-6" style={{ height: 1, background: "#F0F0F0" }} />
        <KnowMore hovered={hovered} />
      </div>

      {/* Image */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          minHeight: 220,
          maxHeight: 280,
          background: card.img ? undefined : PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length],
        }}
      >
        {card.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.img}
            alt={card.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
        ) : (
          <CoverPanel card={card} index={index} />
        )}
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════
   SQUARE CARD
═══════════════════════════════════════════════════════ */
function SquareCard({ card, index }: { card: Card; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={`/case-studies/${card.slug}`}
      className="flex flex-col bg-white overflow-hidden"
      style={{
        border: "1px solid #F0F0F0",
        borderRadius: 16,
        boxShadow: hovered ? "0 6px 32px rgba(0,0,0,0.06)" : "none",
        transition: "box-shadow 0.25s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="overflow-hidden flex-shrink-0"
        style={{
          height: 180,
          background: card.img ? undefined : PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length],
        }}
      >
        {card.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.img}
            alt={card.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
        ) : (
          <CoverPanel card={card} index={index} />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col px-7 py-7 flex-1">
        <h3
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[18px] leading-[1.35] mb-3"
          style={{ color: "#111827", textWrap: "pretty" } as React.CSSProperties}
        >
          {card.title}
        </h3>
        <p
          className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[1.7] flex-1"
          style={{ color: "#6B7280", textWrap: "pretty" } as React.CSSProperties}
        >
          {card.body}
        </p>
        <div className="my-5" style={{ height: 1, background: "#F0F0F0" }} />
        <KnowMore hovered={hovered} />
      </div>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION
═══════════════════════════════════════════════════════ */
interface CaseStudiesGridProps {
  cmsStudies?: CmsCaseStudy[];
}

export default function CaseStudiesGrid({ cmsStudies }: CaseStudiesGridProps) {
  const cards: Card[] =
    cmsStudies && cmsStudies.length > 0
      ? cmsStudies.map(cmsToCard)
      : FALLBACK_CARDS;

  // Layout: first card wide, middle pair square, rest wide; last 2 in another pair
  const [first, second, third, ...rest] = cards;

  return (
    <section id="case-studies" className="pt-10 pb-16 px-5 md:px-8 lg:px-12" style={{ background: "#FFFFFF" }}>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4">

        {first && <WideCard card={first} index={0} />}

        {(second || third) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {second && <SquareCard card={second} index={1} />}
            {third && <SquareCard card={third} index={2} />}
          </div>
        )}

        {rest.map((card, i) =>
          i % 3 === 0 ? (
            <WideCard key={card.slug} card={card} index={i + 3} />
          ) : (
            <div key={card.slug} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SquareCard card={card} index={i + 3} />
              {rest[i + 1] && <SquareCard card={rest[i + 1]} index={i + 4} />}
            </div>
          )
        )}

        {/* View more */}
        <div className="flex justify-center pt-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold px-7 py-[11px] rounded-full border transition-colors"
            style={{ color: "#111827", borderColor: "#E5E7EB" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#111827"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; }}
          >
            View more case studies
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
