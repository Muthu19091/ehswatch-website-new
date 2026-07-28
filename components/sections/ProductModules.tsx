"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import CmsIcon from "@/components/ui/CmsIcon";
import type { CmsProductModule } from "@/lib/types";

// ── SVG Icons ──────────────────────────────────────────────────────────────

const Icons: Record<string, ReactElement> = {
  "check-circle": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "clipboard": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="4" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 4V3.5A1.5 1.5 0 0 1 8.5 2h3A1.5 1.5 0 0 1 13 3.5V4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "chat-warning": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6l-3 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 7v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="12" r="0.8" fill="currentColor"/>
    </svg>
  ),
  "alarm": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 4a6 6 0 1 0 0 12A6 6 0 0 0 10 4z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 7v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.5 4.5L5 3M16.5 4.5L15 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "folder": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 6a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59L9.41 5.4A2 2 0 0 0 10.83 6H16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  "eye": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  "search": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "warning": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L18 17H2L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 9v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="14.5" r="0.8" fill="currentColor"/>
    </svg>
  ),
  "book": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 3h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 7h5M7 10h5M7 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "arrows-cycle": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 10a6 6 0 0 1 10.9-3.4L16 5v4h-4l1.8-1.8A4 4 0 0 0 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10a6 6 0 0 1-10.9 3.4L4 15v-4h4L6.2 12.8A4 4 0 0 0 14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "calendar": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="13" r="1" fill="currentColor"/>
      <circle cx="10" cy="13" r="1" fill="currentColor"/>
      <circle cx="13" cy="13" r="1" fill="currentColor"/>
    </svg>
  ),
  "x-circle": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "lock": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="13.5" r="1.2" fill="currentColor"/>
    </svg>
  ),
  "shield": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L3 5.5v5C3 14.1 6 17.4 10 18c4-0.6 7-3.9 7-7.5v-5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  "graduation": (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3L2 7.5l8 4.5 8-4.5L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M5 9.5V14c0 1.7 2.2 3 5 3s5-1.3 5-3V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 7.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

// ── Module data ────────────────────────────────────────────────────────────

interface Module {
  name: string;
  href: string;
  desc: string;
  color: string;
  icon: string;
  cmsIcon?: string | null;
}

const INITIAL_ROWS = 2;
const COLS = 3;
const STEP = COLS;

// ── Module cell ────────────────────────────────────────────────────────────

function ModuleCell({ mod }: { mod: Module }) {
  const [linkHovered, setLinkHovered] = useState(false);

  return (
    <div className="flex flex-col gap-3 px-5 sm:px-7 py-6 sm:py-8 bg-white">

      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: mod.color + "14", color: mod.color }}
      >
        {mod.cmsIcon ? (
          <CmsIcon icon={mod.cmsIcon} size={20} strokeWidth={1.5} color={mod.color} fallback="square-check" />
        ) : (
          Icons[mod.icon] ?? Icons["check-circle"]
        )}
      </div>

      <h3 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug">
        {mod.name}
      </h3>

      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.65] flex-1">
        {mod.desc}
      </p>

      <Link
        href={mod.href}
        onMouseEnter={() => setLinkHovered(true)}
        onMouseLeave={() => setLinkHovered(false)}
        className="mt-1 self-start flex items-center gap-1 font-[family-name:var(--font-dm-sans)] font-medium text-[13px] transition-all duration-200 no-underline"
        style={{
          color: linkHovered ? "#cc5700" : "#FF6D00",
          transform: linkHovered ? "translateX(3px)" : "translateX(0)",
        }}
      >
        <span>Explore</span>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────

interface ProductModulesProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsModules?: Array<{
    name: string;
    slug: string;
    desc: string;
    icon?: string | null;
  }>;
}

// Palette cycled across CMS modules (mirrors the hardcoded design colours)
const MODULE_COLORS = ["#155eef", "#6366f1", "#0891b2", "#ef4444", "#059669", "#f59e0b", "#7c3aed", "#f97316"];


// ── Main component ─────────────────────────────────────────────────────────

export default function ProductModules({
  cmsHeading,
  cmsSubheading,
  cmsModules,
}: ProductModulesProps = {}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS * COLS);
  const [sectionEl, setSectionEl] = useState<HTMLElement | null>(null);

  // CMS-only: modules come solely from the CMS product-modules collection.
  const modules: Module[] =
    cmsModules && cmsModules.length > 0
      ? cmsModules.map((m, i) => ({
          name: m.name,
          href: `/modules/${m.slug}`,
          desc: m.desc,
          color: MODULE_COLORS[i % MODULE_COLORS.length],
          icon: "check-circle",
          cmsIcon: m.icon ?? null,
        }))
      : [];

  // Nothing configured → hide the whole section.
  if (modules.length === 0) return null;

  const visibleModules = modules.slice(0, visibleCount);
  const hasMore = visibleCount < modules.length;

  const handleViewMore = () => {
    setVisibleCount(Math.min(visibleCount + STEP, modules.length));
  };

  const handleViewLess = () => {
    setVisibleCount(INITIAL_ROWS * COLS);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Resolve heading — CMS-only, strip HTML tags and split on <span> for styled portion
  const rawHeading = cmsHeading?.trim() || "";
  const spanMatch = rawHeading.match(/<span>([\s\S]*?)<\/span>/);
  const spanText = spanMatch ? spanMatch[1] : "";
  const plainHeading = rawHeading.replace(/<[^>]+>/g, "");
  const spanIdx = plainHeading.indexOf(spanText);
  const headingBefore = spanIdx >= 0 ? plainHeading.slice(0, spanIdx) : plainHeading;
  const headingAfter = spanIdx >= 0 ? plainHeading.slice(spanIdx + spanText.length) : "";

  return (
    <section ref={(el) => setSectionEl(el)} className="bg-white py-[50px] md:py-[90px] lg:py-[110px] px-4 md:px-6">
      <div className="max-w-[1160px] mx-auto">

        {/* Section title — CMS-only */}
        {(plainHeading || cmsSubheading) && (
        <div className="text-center mb-10 md:mb-14">
          {plainHeading && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#1b1b1b]">
              {headingBefore}
              {spanText && <span style={{ color: "#0060F9" }}>{spanText}</span>}
              {headingAfter}
            </h2>
          )}
          {cmsSubheading && (
            <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] text-[#6b7280] leading-relaxed mx-auto max-w-[600px]">
              {cmsSubheading}
            </p>
          )}
        </div>
        )}

        {/* Grid — one responsive grid with 1px gaps over a grey background so
            the dividers render correctly at 1 / 2 / 3 columns (was a per-row
            grid whose borders broke on iPad/mobile). */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e7eb] border border-[#e5e7eb] rounded-[12px] overflow-hidden">
            {visibleModules.map((mod) => (
              <ModuleCell key={mod.name} mod={mod} />
            ))}
          </div>
        </div>

        {/* View more / View less */}
        <div className="flex justify-center mt-8">
          {hasMore ? (
            <button
              onClick={handleViewMore}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5e7eb] font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#4b5563] hover:border-[#FF6D00] hover:text-[#FF6D00] transition-colors duration-200"
            >
              View more
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleViewLess}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5e7eb] font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#4b5563] hover:border-[#FF6D00] hover:text-[#FF6D00] transition-colors duration-200"
            >
              View less
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 12V2M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
