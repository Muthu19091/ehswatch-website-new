"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WideCard({ card, index }: { card: Card; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
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
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   SQUARE CARD
═══════════════════════════════════════════════════════ */
function SquareCard({ card, index }: { card: Card; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
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
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION
═══════════════════════════════════════════════════════ */
interface CaseStudiesGridProps {
  cmsStudies?: CmsCaseStudy[];
  pagination?: string;   // CMS post_listing: "load_more" | "pagination"
  limit?: number;        // CMS post_listing: max items to show
}

// Case studies per page: a uniform 3-col grid of equal cards.
const PAGE_SIZE = 6;

// Windowed pager list: 1 … (cur-1) cur (cur+1) … N (same pattern as the blog).
function pageItems(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) out.push(i);
    else if (out[out.length - 1] !== "…") out.push("…");
  }
  return out;
}

export default function CaseStudiesGrid({ cmsStudies, pagination, limit }: CaseStudiesGridProps) {
  // CMS-only: no hardcoded fallback studies.
  const allCards: Card[] =
    cmsStudies && cmsStudies.length > 0
      ? cmsStudies.map(cmsToCard)
      : [];
  // Honour the CMS post_listing block: cap by `limit`, and switch the pager to
  // a "Load More" button when pagination is set to load_more.
  const cards: Card[] = limit && limit > 0 ? allCards.slice(0, limit) : allCards;
  const loadMore = (pagination ?? "").toLowerCase() === "load_more";

  const [page, setPage] = useState(1);
  const [shownCount, setShownCount] = useState(PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);

  // Nothing configured → hide the whole section.
  if (cards.length === 0) return null;

  const totalPages  = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // guard against a stale page
  const pageStart   = (currentPage - 1) * PAGE_SIZE;
  const pageCards   = loadMore ? cards.slice(0, shownCount) : cards.slice(pageStart, pageStart + PAGE_SIZE);

  const goToPage = (n: number) => {
    const target = Math.min(Math.max(1, n), totalPages);
    if (target === currentPage) return;
    setPage(target);
    if (gridRef.current) {
      const y = gridRef.current.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="case-studies" className="pt-10 pb-16 px-5 md:px-8 lg:px-12" style={{ background: "#FFFFFF" }}>
      <div ref={gridRef} className="max-w-[1200px] mx-auto flex flex-col gap-4 scroll-mt-24">

        {pageCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageCards.map((card, i) => (
              <SquareCard key={card.slug} card={card} index={i} />
            ))}
          </div>
        )}

        {/* Pagination — numbered pager (Prev · 1 … N · Next) */}
        {!loadMore && totalPages > 1 && (
          <nav className="flex justify-center items-center gap-1.5 mt-6" aria-label="Case studies pagination">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e5e7eb] text-[#4b5563] transition-colors disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-[var(--brand-primary)] enabled:hover:text-[var(--brand-primary)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L5 7l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {pageItems(currentPage, totalPages).map((it, i) =>
              it === "…" ? (
                <span key={`e${i}`} className="inline-flex items-center justify-center w-9 h-9 text-[#9ca3af] text-[14px] select-none">…</span>
              ) : (
                <button
                  key={it}
                  type="button"
                  onClick={() => goToPage(it)}
                  aria-current={it === currentPage ? "page" : undefined}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-[14px] font-[family-name:var(--font-dm-sans)] font-medium border transition-colors ${
                    it === currentPage
                      ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white"
                      : "border-[#e5e7eb] text-[#4b5563] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                  }`}
                >
                  {it}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e5e7eb] text-[#4b5563] transition-colors disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-[var(--brand-primary)] enabled:hover:text-[var(--brand-primary)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3L9 7l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </nav>
        )}

        {loadMore && cards.length > shownCount && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setShownCount((v) => v + PAGE_SIZE)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5e7eb] text-[#4b5563] font-[family-name:var(--font-dm-sans)] font-medium text-[14px] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
