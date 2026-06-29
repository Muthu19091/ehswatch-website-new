"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import GlareButton from "@/components/ui/GlareButton";
import { basePath } from "@/lib/basePath";
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

const MODULES = [
  { name: "Action Tracker",           href: "/modules/action-tracker", desc: "Track corrective and preventive actions to closure with owners, due dates, reminders, and full accountability.", color: "#155eef", icon: "check-circle" },
  { name: "Audit Management",         href: "#", desc: "Plan and run audits with configurable checklists, structured findings, and follow-up workflows that close compliance gaps faster.", color: "#6366f1", icon: "clipboard" },
  { name: "Customer Complaints",      href: "#", desc: "Capture, assign, investigate and resolve customer complaints through a structured workflow with full audit trail.", color: "#0891b2", icon: "chat-warning" },
  { name: "Emergency Response Drills",href: "#", desc: "Schedule, record, and review emergency drills so teams can test readiness and turn lessons learned into tracked actions.", color: "#ef4444", icon: "alarm" },
  { name: "File Management",          href: "#", desc: "Centralise EHSQ documents with version control, access permissions and expiry alerts — always the right version at the point of need.", color: "#059669", icon: "folder" },
  { name: "HSE Observations",         href: "#", desc: "Report unsafe acts, unsafe conditions, and positive behaviours in real time to strengthen proactive safety reporting across sites.", color: "#f59e0b", icon: "eye" },
  { name: "Inspections",              href: "#", desc: "Conduct digital inspections with custom forms, instant findings capture, and reporting that helps teams act on issues sooner.", color: "#155eef", icon: "search" },
  { name: "Incident Management",      href: "#", desc: "Manage incidents, accidents, and near misses through reporting, investigation, root cause analysis, and corrective action workflows.", color: "#ef4444", icon: "warning" },
  { name: "Legal Register",           href: "#", desc: "Maintain a central record of legal and regulatory obligations so your teams can monitor updates and stay audit-ready.", color: "#7c3aed", icon: "book" },
  { name: "Management of Change",     href: "#", desc: "Control operational and process changes with structured reviews, risk assessments, approvals, and full implementation traceability.", color: "#0891b2", icon: "arrows-cycle" },
  { name: "Meetings Management",      href: "#", desc: "Capture meeting decisions, assign actions live, and track follow-through so safety commitments do not get lost.", color: "#059669", icon: "calendar" },
  { name: "Non-conformance",          href: "#", desc: "Record non-conformances, investigate root causes, assign corrective actions, and monitor closure to prevent recurrence.", color: "#f97316", icon: "x-circle" },
  { name: "Permit to Work",           href: "#", desc: "Digitise high-risk work permits with configurable approvals, linked controls, expiry tracking, and live permit visibility.", color: "#155eef", icon: "lock" },
  { name: "Risk Assessment",          href: "#", desc: "Identify hazards, assess risk levels, and document controls in a consistent workflow that supports safer operational decisions.", color: "#6366f1", icon: "shield" },
  { name: "Training Management",      href: "#", desc: "Manage training records, competency requirements, certification expiries, and gap analysis to keep every worker current.", color: "#f59e0b", icon: "graduation" },
];

const INITIAL_ROWS = 2;
const COLS = 3;
const STEP = COLS;

// ── Module cell ────────────────────────────────────────────────────────────

function ModuleCell({ mod, isLastRow, colIndex }: {
  mod: typeof MODULES[number];
  isLastRow: boolean;
  colIndex: number;
}) {
  const [linkHovered, setLinkHovered] = useState(false);

  return (
    <div
      className="flex flex-col gap-3 px-5 sm:px-7 py-6 sm:py-8"
      style={{
        borderBottom: !isLastRow ? "1px solid #e5e7eb" : "none",
        borderRight: colIndex < COLS - 1 ? "1px solid #e5e7eb" : "none",
        borderLeft: "none",
        borderTop: "none",
      }}
    >
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: mod.color + "14", color: mod.color }}
      >
        {Icons[mod.icon]}
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
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ProductModules({
  cmsHeading,
  cmsSubheading,
}: ProductModulesProps = {}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_ROWS * COLS);
  const [animatedRows, setAnimatedRows] = useState<Set<number>>(
    () => new Set(Array.from({ length: INITIAL_ROWS }, (_, i) => i))
  );
  const [sectionEl, setSectionEl] = useState<HTMLElement | null>(null);

  const visibleModules = MODULES.slice(0, visibleCount);
  const hasMore = visibleCount < MODULES.length;

  const handleViewMore = () => {
    const nextCount = Math.min(visibleCount + STEP, MODULES.length);
    setVisibleCount(nextCount);
    const newRowIdx = Math.ceil(visibleCount / COLS);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimatedRows((prev) => new Set([...prev, newRowIdx]));
      });
    });
  };

  const handleViewLess = () => {
    setVisibleCount(INITIAL_ROWS * COLS);
    setAnimatedRows(new Set(Array.from({ length: INITIAL_ROWS }, (_, i) => i)));
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const rows: typeof MODULES[] = [];
  for (let i = 0; i < visibleModules.length; i += COLS) {
    rows.push(visibleModules.slice(i, i + COLS));
  }

  // Resolve heading — strip HTML tags and split on <span> for styled portion
  const rawHeading = cmsHeading || "Our <span>Modules</span>";
  const spanMatch = rawHeading.match(/<span>([\s\S]*?)<\/span>/);
  const spanText = spanMatch ? spanMatch[1] : "Modules";
  const plainHeading = rawHeading.replace(/<[^>]+>/g, "");
  const spanIdx = plainHeading.indexOf(spanText);
  const headingBefore = spanIdx >= 0 ? plainHeading.slice(0, spanIdx) : plainHeading;
  const headingAfter = spanIdx >= 0 ? plainHeading.slice(spanIdx + spanText.length) : "";

  return (
    <section ref={(el) => setSectionEl(el)} className="bg-white py-[50px] md:py-[90px] lg:py-[110px] px-4 md:px-6">
      <style>{`
        @media (min-width: 640px) and (max-width: 1023px) {
          .modules-row > *:nth-child(2n) { border-right: none !important; }
        }
      `}</style>
      <div className="max-w-[1160px] mx-auto">

        {/* Section title */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#1b1b1b]">
            {headingBefore}
            <span style={{ color: "#0060F9" }}>{spanText}</span>
            {headingAfter}
          </h2>
          {cmsSubheading && (
            <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] text-[#6b7280] leading-relaxed mx-auto max-w-[600px]">
              {cmsSubheading}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="w-full">
          {rows.map((row, rowIdx) => {
            const isLastVisibleRow = rowIdx === rows.length - 1;
            const isVisible = animatedRows.has(rowIdx);
            return (
              <div
                key={rowIdx}
                className="modules-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.4s ease, transform 0.4s ease",
                }}
              >
                {row.map((mod, colIdx) => (
                  <ModuleCell
                    key={mod.name}
                    mod={mod}
                    isLastRow={isLastVisibleRow}
                    colIndex={colIdx}
                  />
                ))}
              </div>
            );
          })}
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

        {/* Callout strip */}
        <div
          className="mt-16 rounded-[24px] px-8 md:px-14 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
          style={{
            background: "#f1f7ff",
            backgroundImage: `url(${basePath}/images/product/cta-background.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[17px] text-[#0a0f1e] leading-[1.72] max-w-[580px] text-center md:text-left">
            Book a personalised walkthrough and see exactly how EHSWatch maps to your{" "}
            <strong className="font-semibold">industry&rsquo;s workflows</strong> and compliance requirements.
          </p>
          <GlareButton
            href="#"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3 rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white whitespace-nowrap"
            style={{
              backgroundImage:
                "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
            }}
          >
            Book a Demo
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </GlareButton>
        </div>

      </div>
    </section>
  );
}
