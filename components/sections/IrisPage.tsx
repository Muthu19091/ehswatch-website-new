"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
// basePath is imported for future image assets; unused in this file but kept per project conventions.
import { basePath } from "@/lib/basePath";
import IRISChatShowcase from "@/components/sections/IRISChatShowcase";
import Orb from "@/components/ui/Orb";
import GlareButton from "@/components/ui/GlareButton";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Capability {
  num: string;
  color: string;
  bg: string;
  title: string;
  desc: string;
  features: string[];
  benefits: string[];
  icon: React.ReactNode;
}

interface ProblemCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS Props — all optional; hardcoded fallbacks are used when absent
// ─────────────────────────────────────────────────────────────────────────────

interface IrisCmsProps {
  cmsHero?: {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    primary_cta?: any;
  };
  cmsTextCta?: {
    heading?: string;
    subheading?: string;
    title?: string;
    description?: string;
    cta?: any;
  };
  cmsProblems?: Array<{ title?: string; description?: string; icon?: string }>;
  cmsCapabilities?: Array<{
    title?: string;
    description?: string;
    eyebrow?: string;
    sub_items?: any[];
  }>;
  cmsCtaBanner?: { headline?: string; subhead?: string; primary_cta?: any; button?: { button?: { label?: string; url?: string } } };
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline SVG Icons — one per capability
// ─────────────────────────────────────────────────────────────────────────────

const IconMicrophone = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M5 11a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 18v4M9 22h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconLightbulb = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2a7 7 0 0 1 4 12.65V16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1.35A7 7 0 0 1 12 2z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M9 17h6M10 20h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 6v2M9.5 8.5l1.5 1.5M14.5 8.5l-1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconSearchTree = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.6" />
    <path d="M14.5 14.5l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10 7v3M8 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconNetwork = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="4" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="20" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="4" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="20" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6 6.5l4.5 4.5M18 6.5l-4.5 4.5M6 17.5l4.5-4.5M18 17.5l-4.5-4.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconChartLightning = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 17l4-5 4 3 3-6 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 3l-2 4h3l-2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCameraEye = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M2 8.5A2.5 2.5 0 0 1 4.5 6h1.09a2 2 0 0 0 1.7-.95l.62-1.1A2 2 0 0 1 9.6 3h4.8a2 2 0 0 1 1.7.95l.62 1.1A2 2 0 0 0 18.4 6h1.1A2.5 2.5 0 0 1 22 8.5v9A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-9z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="13" r="1.2" fill="currentColor" />
  </svg>
);

const IconWarning = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L18 17H2L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="14.5" r="0.9" fill="currentColor" />
  </svg>
);

// ── Problem icons ──
const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2 12C2 12 5 5 12 5s10 7 10 7-3 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const IconClipboardX = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9.5 14.5l5-5M14.5 14.5l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconLayers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconScatter = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="5"  cy="5"  r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="19" cy="7"  r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8"  cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 5.5l10 1M6.5 15.5l10 0" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" strokeLinecap="round" opacity="0.4" />
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 2 12 2 12a17.8 17.8 0 0 1 5.06-6.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const PROBLEMS: ProblemCard[] = [
  {
    title: "Attention Constraints",
    desc: "Human attention misses hazards and hidden patterns buried in large volumes of safety data.",
    icon: <IconEye />, color: "#155eef", bg: "#eff4ff",
  },
  {
    title: "Manual Reporting Friction",
    desc: "Forms-based reporting discourages timely incident submissions, creating data gaps at the source.",
    icon: <IconClipboardX />, color: "#ef4444", bg: "#fff5f5",
  },
  {
    title: "Surface-Level Investigations",
    desc: "Investigations that stop at symptoms fail to uncover true root causes — letting repeat incidents happen.",
    icon: <IconLayers />, color: "#7c3aed", bg: "#f7f0ff",
  },
  {
    title: "Scattered Incident Records",
    desc: "Isolated records make it impossible to detect patterns or similarities across sites and time periods.",
    icon: <IconScatter />, color: "#4f46e5", bg: "#eff0ff",
  },
  {
    title: "Manual Insight Compilation",
    desc: "Aggregating data into meaningful EHS insights is time-intensive and often done too late to act.",
    icon: <IconClock />, color: "#f97316", bg: "#fff7ed",
  },
  {
    title: "Reviewer Fatigue",
    desc: "Visual hazards in field photos are overlooked when reviewers are overwhelmed or fatigued.",
    icon: <IconEyeOff />, color: "#0891b2", bg: "#ecfeff",
  },
];

const CAPABILITIES: Capability[] = [
  {
    num: "01",
    color: "#155eef",
    bg: "#eff4ff",
    title: "Text / Voice-to-Report",
    desc: "Converts spoken notes or free-form text into a complete, structured incident report instantly.",
    features: ["Natural language AI", "Multilingual", "Auto-fills forms"],
    benefits: ["3× reporting rates", "Zero form friction"],
    icon: <IconMicrophone />,
  },
  {
    num: "02",
    color: "#1d4ed8",
    bg: "#eef2ff",
    title: "Action Recommendation Engine",
    desc: "AI recommends prioritised corrective actions based on historical incident patterns across your sites.",
    features: ["Pattern matching", "Prioritised tasks", "Historical data"],
    benefits: ["50% faster closure", "Cuts repeat incidents"],
    icon: <IconLightbulb />,
  },
  {
    num: "03",
    color: "#2563eb",
    bg: "#dbeafe",
    title: "AI Root Cause Analysis",
    desc: "Uncovers systemic causes beyond surface symptoms using guided methodologies and AI-assisted logic.",
    features: ["5-Why / Fishbone guidance", "Methodology support", "ISO 45001 aligned"],
    benefits: ["Reduces recurrence rate", "Auto-generates investigation reports"],
    icon: <IconSearchTree />,
  },
  {
    num: "04",
    color: "#3b82f6",
    bg: "#dbeafe",
    title: "Event Similarity Detector",
    desc: "Detects hidden patterns and connections across all recorded safety events using real-time NLP clustering.",
    features: ["Real-time NLP clustering", "Trend alerts", "Cross-site analysis"],
    benefits: ["Identifies repeat-pattern risks", "Supports leading-indicator reporting"],
    icon: <IconNetwork />,
  },
  {
    num: "05",
    color: "#0ea5e9",
    bg: "#e0f2fe",
    title: "AI Insights Generator",
    desc: "Turns raw EHS data into executive-ready narratives and board-level summaries in seconds.",
    features: ["Auto-aggregates EHS data", "Plain-language summaries", "Board-ready"],
    benefits: ["Saves 15+ hours/month", "Auto-generates EHS summaries"],
    icon: <IconChartLightning />,
  },
  {
    num: "06",
    color: "#0891b2",
    bg: "#ecfeff",
    title: "Image Recognition",
    desc: "Detects hazards and PPE failures in field photos with auto-annotations and real-time supervisor alerts.",
    features: ["Auto-annotations", "Real-time alerts", "Audit-ready evidence"],
    benefits: ["4× more hazard detections", "Supervisor alerts"],
    icon: <IconCameraEye />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-animation hook
// Observes a container ref and toggles a CSS class when it enters the viewport.
// ─────────────────────────────────────────────────────────────────────────────

function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("iris-revealed");
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS keyframes — injected once on mount
// ─────────────────────────────────────────────────────────────────────────────

const IRIS_STYLES = `
  /* Scroll-reveal base state */
  .iris-reveal-target {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
  }
  .iris-revealed .iris-reveal-target,
  .iris-reveal-target.iris-revealed {
    opacity: 1;
    transform: translateY(0);
  }
  /* Staggered children */
  .iris-stagger > .iris-reveal-target:nth-child(1) { transition-delay: 0ms; }
  .iris-stagger > .iris-reveal-target:nth-child(2) { transition-delay: 80ms; }
  .iris-stagger > .iris-reveal-target:nth-child(3) { transition-delay: 160ms; }
  .iris-stagger > .iris-reveal-target:nth-child(4) { transition-delay: 240ms; }
  .iris-stagger > .iris-reveal-target:nth-child(5) { transition-delay: 320ms; }
  .iris-stagger > .iris-reveal-target:nth-child(6) { transition-delay: 400ms; }

  /* Light AI thinking card — one-shot keyframes (driven by inline styles when active) */
  @keyframes lightBarGrow  { from{width:4%} to{width:82%} }
  @keyframes lightBarGrow2 { from{width:4%} to{width:54%} }
  @keyframes lightBarGrow3 { from{width:4%} to{width:70%} }
  @keyframes lightDotBounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-5px);opacity:1} }
  @keyframes lightRingPulse { 0%,100%{box-shadow:0 0 0 3px rgba(21,94,239,0.10)} 50%{box-shadow:0 0 0 7px rgba(21,94,239,0.20)} }

  /* Timeline capabilities */
  .tl-card-left  { opacity: 0; transform: translateX(-28px); transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1); }
  .tl-card-right { opacity: 0; transform: translateX(28px);  transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1); }
  .tl-node { opacity: 0; transform: scale(0.5); transition: opacity 0.35s ease 0.08s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.08s; }
  .tl-item.tl-visible .tl-card-left  { opacity: 1; transform: translateX(0); transition-delay: 0.1s; }
  .tl-item.tl-visible .tl-card-right { opacity: 1; transform: translateX(0); transition-delay: 0.1s; }
  .tl-item.tl-visible .tl-node { opacity: 1; transform: scale(1); }

  /* Zazu-style scattered problem cards */
  .zazu-card {
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
  }
  .zazu-card.zz-visible { opacity: 1; }

  /* Each card has a unique from-direction baked in via inline style */
  /* Desktop scattered layout */
  @media (min-width: 900px) {
    .zazu-scene { position: relative; min-height: 720px; }
    .zazu-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; width: 380px; z-index: 1; }
    .zazu-card { position: absolute; width: 260px; }
  }
  @media (max-width: 899px) {
    .zazu-scene { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
    .zazu-center { position: static; transform: none; width: 100%; text-align: center; padding: 0 0 24px 0; }
    .zazu-card { position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: none !important; width: 100% !important; opacity: 1 !important; transition: none !important; }
  }

  /* Grid animated background */
  .iris-grid-container {
    background-image:
      linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
    background-size: 50px 50px;
  }
  @keyframes gridBoxFill {
    0%, 100% { opacity: 0; }
    50%       { opacity: 0.6; }
  }
  .iris-grid-box {
    position: absolute;
    width: 48px;
    height: 48px;
  }

`;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Light AI thinking card — animations fire once when `active` becomes true */
function AIThinkingCardLight({ active }: { active: boolean }) {
  // Bar definitions: keyframe name, fill colour, track colour, staggered delay
  const bars = [
    { label: "Incident patterns", kf: "lightBarGrow",  color: "#155eef", bg: "#eff4ff", delay: "0.1s"  },
    { label: "Risk correlation",  kf: "lightBarGrow2", color: "#4f46e5", bg: "#eff0ff", delay: "0.35s" },
    { label: "Root cause depth",  kf: "lightBarGrow3", color: "#0891b2", bg: "#ecfeff", delay: "0.6s"  },
  ];

  return (
    <div
      className="w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden border border-[#dde6f5]"
      style={{ background: "white", boxShadow: "0 8px 32px rgba(21,94,239,0.08), 0 2px 8px rgba(21,94,239,0.04)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#edf2fb]" style={{ background: "#f8faff" }}>
        <div className="flex items-center gap-2.5">
          {/* Ring — pulses 3 times then stops */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg,#155eef,#4f46e5)",
              animation: active ? "lightRingPulse 2.4s ease-in-out 3" : "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="white" strokeWidth="1.4" />
              <path d="M4.5 7h5M7 4.5v5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#1b1b1b]">IRIS</p>
            <p className="font-[family-name:var(--font-dm-sans)] text-[10px] text-[#6b7280] tracking-[0.2px]">
              EHSQ AI AGENT · <span className="text-[#22c55e] font-medium">ONLINE</span>
            </p>
          </div>
        </div>
        {/* Dots — bounce 4 times then stop */}
        <div className="flex items-center gap-1">
          {[0, 0.15, 0.3].map((d, i) => (
            <span
              key={i}
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#155eef]"
              style={{ animation: active ? `lightDotBounce 1.3s ease-in-out ${d}s 4` : "none" }}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5 flex flex-col gap-4">
        <p className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.15em] font-semibold text-[#9ca3af]">
          Analysing safety data
        </p>

        {/* Bars — grow once to final width, stay there */}
        <div className="flex flex-col gap-3">
          {bars.map(({ label, kf, color, bg, delay }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--font-dm-sans)] text-[11.5px] text-[#374151]">{label}</span>
              <div className="relative h-1.5 w-full rounded-full overflow-hidden" style={{ background: bg }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: color,
                    width: "4%",
                    animation: active ? `${kf} 1.6s cubic-bezier(0.4,0,0.2,1) ${delay} 1 forwards` : "none",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#edf2fb]" />

        <div className="flex flex-col gap-1.5">
          <p className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-[0.15em] font-semibold text-[#9ca3af]">Insight ready</p>
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[1.6] text-[#1b1b1b]">
            &ldquo;3 incidents share a common root cause at Site B — recommend immediate process review.&rdquo;
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: "Root cause found", color: "#155eef", bg: "#eff4ff" },
            { label: "Action drafted",   color: "#059669", bg: "#ecfdf5" },
            { label: "Report ready",     color: "#4f46e5", bg: "#eff0ff" },
          ].map(({ label, color, bg }) => (
            <span key={label} className="font-[family-name:var(--font-dm-sans)] text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: bg, color }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Scroll-animated problem card */
function ProblemCard({ card }: { card: ProblemCard }) {
  return (
    <div
      className="flex flex-col gap-4 p-7 rounded-2xl h-full"
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03)",
      }}
    >
      <div
        className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
        style={{ background: card.bg, color: card.color }}
      >
        {card.icon}
      </div>
      <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[17px] leading-snug text-[#1b1b1b]">
        {card.title}
      </h3>
      <p
        className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.65] text-[#727272] flex-1"
        style={{ textWrap: "pretty" } as React.CSSProperties}
      >
        {card.desc}
      </p>
    </div>
  );
}

// ─── Dummy visual mockups — one per capability ───────────────────────────────

function MockupVoice({ color, bg }: { color: string; bg: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]" style={{ background: bg }}>
      <div className="px-5 py-4 flex items-center gap-2 border-b border-[#e5e7eb] bg-white">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>Recording…</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        {/* Waveform bars */}
        <div className="flex items-end gap-[3px] h-10">
          {[4,7,12,9,16,11,8,14,6,10,13,7,9,15,5,11,8,12,6,9].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 2.4}px`, background: color, opacity: 0.55 + (i % 3) * 0.15 }} />
          ))}
        </div>
        {/* Auto-filled form lines */}
        <div className="flex flex-col gap-2 mt-1">
          {["Incident type: Working at height", "Location: Site A", "Date: Auto-detected", "Severity: High"].map((line) => (
            <div key={line} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
              <span className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#374151]">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MockupAction({ color, bg }: { color: string; bg: string }) {
  const items = [
    { label: "Review isolation procedure", priority: "HIGH",   done: true  },
    { label: "Retrain 3 operators",        priority: "HIGH",   done: false },
    { label: "Update risk register",       priority: "MED",    done: false },
    { label: "Schedule site audit",        priority: "LOW",    done: false },
  ];
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]" style={{ background: bg }}>
      <div className="px-5 py-4 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
        <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#1b1b1b]">Recommended Actions</span>
        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: bg, color }}>AI sorted</span>
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        {items.map(({ label, priority, done }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white border border-[#f0f0f0]">
            <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0`} style={{ background: done ? color : "#f3f4f6", border: done ? "none" : "1.5px solid #d1d5db" }}>
              {done && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <span className="font-[family-name:var(--font-dm-sans)] text-[12px] flex-1 text-[#374151]" style={{ textDecoration: done ? "line-through" : "none", opacity: done ? 0.5 : 1 }}>{label}</span>
            <span className="font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: priority === "HIGH" ? "#fee2e2" : priority === "MED" ? "#fff7ed" : "#f0fdf4", color: priority === "HIGH" ? "#ef4444" : priority === "MED" ? "#f97316" : "#16a34a" }}>{priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupRootCause({ color, bg }: { color: string; bg: string }) {
  const nodes = [
    { label: "Incident: Worker injury",   level: 0 },
    { label: "Why? → Unsafe surface",     level: 1 },
    { label: "Why? → No inspection done", level: 2 },
    { label: "Why? → No schedule set",    level: 3 },
    { label: "Root cause: Process gap",   level: 4, isRoot: true },
  ];
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]" style={{ background: bg }}>
      <div className="px-5 py-4 border-b border-[#e5e7eb] bg-white flex items-center gap-2">
        <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#1b1b1b]">5-Why Analysis</span>
        <span className="font-[family-name:var(--font-dm-sans)] text-[10px] uppercase tracking-wider font-semibold" style={{ color }}>AI assisted</span>
      </div>
      <div className="p-5 flex flex-col gap-2">
        {nodes.map(({ label, level, isRoot }) => (
          <div key={label} className="flex items-center gap-2" style={{ paddingLeft: `${level * 16}px` }}>
            {level > 0 && <div className="w-3 h-px shrink-0" style={{ background: color, opacity: 0.4 }} />}
            <div className={`flex-1 rounded-lg px-3 py-2 text-[12px] font-[family-name:var(--font-dm-sans)]`}
              style={{ background: isRoot ? color : "white", color: isRoot ? "white" : "#374151", border: `1px solid ${isRoot ? color : "#e5e7eb"}`, fontWeight: isRoot ? 600 : 400 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupSimilarity({ color, bg }: { color: string; bg: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]" style={{ background: bg }}>
      <div className="px-5 py-4 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
        <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#1b1b1b]">Pattern Detected</span>
        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>3 matches</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {[["INC-0412 · Site A · Apr 10", "INC-0398 · Site B · Mar 28", "92% similar"], ["INC-0412 · Site A · Apr 10", "INC-0371 · Site C · Feb 14", "87% similar"]].map(([a, b, pct], i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-xl p-3 bg-white border border-[#e5e7eb]">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-[family-name:var(--font-dm-sans)] text-[#374151]" style={{ background: "#f8fafc" }}>{a}</div>
              <div className="text-[10px] font-semibold font-[family-name:var(--font-dm-sans)] px-2 py-1 rounded-full text-white shrink-0" style={{ background: color }}>{pct}</div>
              <div className="flex-1 rounded-lg px-2.5 py-1.5 text-[11px] font-[family-name:var(--font-dm-sans)] text-[#374151]" style={{ background: "#f8fafc" }}>{b}</div>
            </div>
          </div>
        ))}
        <p className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#727272] text-center pt-1">Common factor: electrical isolation protocol</p>
      </div>
    </div>
  );
}

function MockupInsights({ color, bg }: { color: string; bg: string }) {
  const bars = [
    { label: "Site A", val: 78 },
    { label: "Site B", val: 52 },
    { label: "Site C", val: 34 },
    { label: "Site D", val: 61 },
  ];
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]" style={{ background: bg }}>
      <div className="px-5 py-4 border-b border-[#e5e7eb] bg-white flex items-center justify-between">
        <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#1b1b1b]">EHS Insights Summary</span>
        <span className="font-[family-name:var(--font-dm-sans)] text-[11px]" style={{ color }}>Auto-generated</span>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          {bars.map(({ label, val }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#727272] w-12 shrink-0">{label}</span>
              <div className="flex-1 h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${val}%`, background: color }} />
              </div>
              <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold w-8 text-right" style={{ color }}>{val}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 border border-[#e5e7eb] bg-white">
          <p className="font-[family-name:var(--font-dm-sans)] text-[12px] leading-[1.6] text-[#374151]">
            "Site A incident rate increased 30% this quarter. Recommend immediate review of working-at-height procedures."
          </p>
        </div>
      </div>
    </div>
  );
}

function MockupImageRec({ color, bg }: { color: string; bg: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]" style={{ background: bg }}>
      <div className="px-5 py-4 border-b border-[#e5e7eb] bg-white flex items-center gap-2">
        <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#1b1b1b]">Hazard Detection</span>
        <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: color }}>2 found</span>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {/* Fake photo with annotation boxes */}
        <div className="relative rounded-xl overflow-hidden bg-[#e2e8f0]" style={{ height: 120 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.2"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#374151" strokeWidth="1.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#374151" strokeWidth="1.5"/><circle cx="12" cy="13" r="3" stroke="#374151" strokeWidth="1.5"/></svg>
          </div>
          {/* Annotation boxes */}
          <div className="absolute top-3 left-4 px-1.5 py-0.5 rounded text-[9px] font-semibold font-[family-name:var(--font-dm-sans)] text-white" style={{ border: `2px solid ${color}`, background: `${color}22` }}>No PPE</div>
          <div className="absolute bottom-4 right-8 px-1.5 py-0.5 rounded text-[9px] font-semibold font-[family-name:var(--font-dm-sans)] text-white" style={{ border: "2px solid #ef4444", background: "#ef444422" }}>Hazard zone</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {[{ lbl: "PPE non-compliance", c: color }, { lbl: "Unsafe proximity detected", c: "#ef4444" }].map(({ lbl, c }) => (
            <div key={lbl} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white border border-[#f0f0f0]">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
              <span className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#374151]">{lbl}</span>
              <span className="ml-auto font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold" style={{ color: c }}>Alert sent</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Maps capability number to its visual mockup */
function CapabilityMockup({ cap }: { cap: Capability }) {
  if (cap.num === "01") return <MockupVoice     color={cap.color} bg={cap.bg} />;
  if (cap.num === "02") return <MockupAction    color={cap.color} bg={cap.bg} />;
  if (cap.num === "03") return <MockupRootCause color={cap.color} bg={cap.bg} />;
  if (cap.num === "04") return <MockupSimilarity color={cap.color} bg={cap.bg} />;
  if (cap.num === "05") return <MockupInsights  color={cap.color} bg={cap.bg} />;
  return                       <MockupImageRec  color={cap.color} bg={cap.bg} />;
}

/** Sticky-scroll capabilities section: left text changes on scroll, right visual is sticky */
function CapabilitiesScrollSection({ capabilities }: { capabilities: Capability[] }) {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [visIdx,    setVisIdx]      = useState(0);
  const [visualOpacity, setVisualOpacity] = useState(1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track which capability is in view
  useEffect(() => {
    const observers = itemRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(i); },
        { threshold: 0.45 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  // Cross-fade the visual when active capability changes
  useEffect(() => {
    if (activeIdx === visIdx) return;
    setVisualOpacity(0);
    const t = setTimeout(() => {
      setVisIdx(activeIdx);
      setVisualOpacity(1);
    }, 180);
    return () => clearTimeout(t);
  }, [activeIdx, visIdx]);

  const activeCap = capabilities[visIdx];

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-20">

      {/* ── Left: scrollable list ── */}
      <div className="flex-1 min-w-0">
        {capabilities.map((cap, i) => (
          <div
            key={cap.num}
            ref={el => { itemRefs.current[i] = el; }}
            className="py-12 border-b border-[#f0f0f0] last:border-0 transition-all duration-400"
            style={{ opacity: activeIdx === i ? 1 : 0.28 }}
          >
            {/* Colour accent bar */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="h-5 rounded-full transition-all duration-300"
                style={{
                  width: activeIdx === i ? 28 : 4,
                  background: activeIdx === i ? cap.color : "#e5e7eb",
                }}
              />
              <span
                className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300"
                style={{ color: activeIdx === i ? cap.color : "#9ca3af" }}
              >
                {cap.num}
              </span>
            </div>

            <div className="flex flex-col gap-4 max-w-[520px]">
              <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] md:text-[24px] leading-snug text-[#1b1b1b]">
                {cap.title}
              </h3>
              <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.75] text-[#727272]">
                {cap.desc}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2">
                {cap.features.map((f) => (
                  <span
                    key={f}
                    className="font-[family-name:var(--font-dm-sans)] text-[12px] font-medium px-3 py-1 rounded-full"
                    style={{ background: cap.bg, color: cap.color }}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-2">
                {cap.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ color: cap.color, flexShrink: 0 }}>
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-[#374151]">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile visual — shown inline below text on small screens */}
            <div className="mt-8 lg:hidden">
              <CapabilityMockup cap={cap} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Right: sticky visual (desktop only) ── */}
      <div className="hidden lg:block w-[460px] shrink-0">
        <div className="sticky top-[100px] flex flex-col gap-6">
          {/* Visual with fade transition */}
          <div
            style={{
              opacity: visualOpacity,
              transform: `translateY(${visualOpacity === 0 ? "12px" : "0"})`,
              transition: "opacity 0.18s ease, transform 0.22s ease",
            }}
          >
            <CapabilityMockup cap={activeCap} />
          </div>

          {/* Dot progress indicator */}
          <div className="flex items-center justify-center gap-2">
            {capabilities.map((cap, i) => (
              <div
                key={cap.num}
                className="rounded-full transition-all duration-300"
                style={{
                  width:  activeIdx === i ? 24 : 7,
                  height: 7,
                  background: activeIdx === i ? cap.color : "#e5e7eb",
                }}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

/** One capability row — text + visual, alternating sides */
function CapabilityRow({ cap, index }: { cap: Capability; index: number }) {
  const isEven = index % 2 === 0;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("cap-row-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`cap-row flex flex-col md:flex-row items-center gap-10 lg:gap-16 py-14 border-b border-[#f0f0f0] last:border-0`}
    >
      {/* Text side */}
      <div className={`flex-1 flex flex-col gap-5 cap-row-text ${isEven ? "md:order-1" : "md:order-2"}`}>
        <div className="flex items-center gap-3">
          <span
            className="font-[family-name:var(--font-gothic-a1)] font-black text-[42px] leading-none tracking-[-0.04em]"
            style={{ color: cap.color, opacity: 0.18 }}
          >
            {cap.num}
          </span>
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{ background: cap.bg, color: cap.color }}
          >
            {cap.icon}
          </div>
        </div>

        <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] md:text-[24px] leading-snug text-[#1b1b1b]">
          {cap.title}
        </h3>

        <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.75] text-[#727272]">
          {cap.desc}
        </p>

        <div className="flex flex-wrap gap-2">
          {cap.features.map((f) => (
            <span
              key={f}
              className="font-[family-name:var(--font-dm-sans)] text-[12px] font-medium px-3 py-1 rounded-full"
              style={{ background: cap.bg, color: cap.color }}
            >
              {f}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {cap.benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ color: cap.color, flexShrink: 0 }}>
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-[#374151]">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual side */}
      <div className={`w-full md:w-[440px] shrink-0 cap-row-visual ${isEven ? "md:order-2" : "md:order-1"}`}>
        <CapabilityMockup cap={cap} />
      </div>
    </div>
  );
}

/** A single capability card used in Section 5 */
function CapabilityCard({ cap }: { cap: Capability }) {
  return (
    <div
      className="iris-reveal-target flex flex-col gap-5 rounded-2xl p-7 border"
      style={{
        borderColor: "#e5e7eb",
        background: "#fff",
        // Keep equal height when in a grid
        height: "100%",
      }}
    >
      {/* Number + icon row */}
      <div className="flex items-start justify-between">
        <span
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] leading-none"
          style={{ color: cap.color, opacity: 0.18, letterSpacing: "-0.04em" }}
        >
          {cap.num}
        </span>
        <div
          className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: cap.bg, color: cap.color }}
        >
          {cap.icon}
        </div>
      </div>

      {/* Title */}
      <h3
        className="font-[family-name:var(--font-gothic-a1)] font-bold text-[17px] leading-snug text-[#1b1b1b]"
      >
        {cap.title}
      </h3>

      {/* Description */}
      <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.7] text-[#727272] flex-1">
        {cap.desc}
      </p>

      {/* Key features pills */}
      <div className="flex flex-col gap-2">
        <p
          className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "#9ca3af" }}
        >
          Key features
        </p>
        <div className="flex flex-wrap gap-2">
          {cap.features.map((f) => (
            <span
              key={f}
              className="font-[family-name:var(--font-dm-sans)] text-[12px] px-3 py-1 rounded-full"
              style={{ background: cap.bg, color: cap.color, fontWeight: 500 }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="flex flex-col gap-1.5">
        <p
          className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "#9ca3af" }}
        >
          Benefits
        </p>
        {cap.benefits.map((b) => (
          <div key={b} className="flex items-center gap-2">
            {/* Colored arrow bullet */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              style={{ color: cap.color, flexShrink: 0 }}
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium"
              style={{ color: "#374151" }}
            >
              {b}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline capability card
// ─────────────────────────────────────────────────────────────────────────────

function TimelineCard({ cap }: { cap: Capability }) {
  return (
    <div
      className="rounded-2xl p-6 bg-white border border-[#e8f0fe]"
      style={{ boxShadow: "0 4px 24px rgba(21,94,239,0.07), 0 1px 4px rgba(21,94,239,0.04)" }}
    >
      {/* Num + rule */}
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ color: cap.color }}
        >
          {cap.num}
        </span>
        <div className="h-px flex-1 rounded" style={{ background: cap.color, opacity: 0.18 }} />
      </div>

      <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[17px] leading-snug text-[#1b1b1b] mb-3">
        {cap.title}
      </h3>

      <p className="font-[family-name:var(--font-dm-sans)] text-[13.5px] leading-[1.72] text-[#727272] mb-4">
        {cap.desc}
      </p>

      {/* Feature chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {cap.features.map((f) => (
          <span
            key={f}
            className="font-[family-name:var(--font-dm-sans)] text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: cap.bg, color: cap.color }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Benefits */}
      <div className="flex flex-col gap-1.5">
        {cap.benefits.map((b) => (
          <div key={b} className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden style={{ color: cap.color, flexShrink: 0 }}>
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-[family-name:var(--font-dm-sans)] text-[12.5px] font-medium text-[#374151]">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Vertical timeline section — cards alternate left / right, line fills on scroll
// ─────────────────────────────────────────────────────────────────────────────

function CapabilitiesTimeline({ capabilities }: { capabilities: Capability[] }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = itemRefs.current.map((el) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { el.classList.add("tl-visible"); obs.disconnect(); }
        },
        { threshold: 0.08 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="relative max-w-[960px] mx-auto">

      {/* ── Central vertical line (desktop) ── */}
      <div
        className="absolute top-0 bottom-0 w-px hidden md:block pointer-events-none"
        style={{
          left: "50%",
          background:
            "linear-gradient(to bottom, transparent 0%, #bfdbfe 6%, #93c5fd 25%, #93c5fd 75%, #bfdbfe 94%, transparent 100%)",
        }}
      />

      <div className="flex flex-col gap-12 md:gap-16">
        {capabilities.map((cap, i) => {
          const isLeft = i % 2 === 0; // left card on even, right card on odd

          return (
            <div
              key={cap.num}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="tl-item relative flex flex-col md:flex-row items-start md:items-center"
            >
              {/* ── Left half ── */}
              <div className="hidden md:flex w-1/2 justify-end pr-10">
                {isLeft && (
                  <div className="tl-card-left w-full max-w-[400px]">
                    <TimelineCard cap={cap} />
                  </div>
                )}
              </div>

              {/* ── Center node (desktop) ── */}
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 tl-node z-10">
                <div
                  className="w-11 h-11 rounded-full bg-white border-2 flex items-center justify-center"
                  style={{
                    borderColor: cap.color,
                    color: cap.color,
                    boxShadow: `0 0 0 5px ${cap.bg}, 0 4px 16px rgba(21,94,239,0.15)`,
                  }}
                >
                  {cap.icon}
                </div>
              </div>

              {/* ── Right half ── */}
              <div className="hidden md:flex w-1/2 pl-10">
                {!isLeft && (
                  <div className="tl-card-right w-full max-w-[400px]">
                    <TimelineCard cap={cap} />
                  </div>
                )}
              </div>

              {/* ── Mobile: left line + card ── */}
              <div className="md:hidden flex gap-4 w-full">
                {/* Mini vertical indicator */}
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div
                    className="w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: cap.color, color: cap.color }}
                  >
                    {cap.icon}
                  </div>
                  {i < capabilities.length - 1 && (
                    <div className="w-px flex-1 mt-2" style={{ background: "#bfdbfe", minHeight: 24 }} />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <TimelineCard cap={cap} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Zazu-style scattered problems layout
// Cards float around the centered heading text at slight angles
// ─────────────────────────────────────────────────────────────────────────────

/// Desktop: absolute positions + rotations for each card (6 cards)
// Scene is 1100px wide × 720px tall, center text at 50%/50%
const CARD_POSITIONS = [
  // top-left
  { top: "2%",  left: "0%",   rotate: "-3deg", from: "translateX(-60px) translateY(-30px)" },
  // top-right
  { top: "2%",  right: "0%",  rotate:  "3deg", from: "translateX(60px) translateY(-30px)"  },
  // mid-left
  { top: "38%", left: "0%",   rotate: "-2deg", from: "translateX(-60px)"                   },
  // mid-right
  { top: "38%", right: "0%",  rotate:  "2deg", from: "translateX(60px)"                    },
  // bottom-left
  { top: "72%", left: "6%",   rotate: "-3deg", from: "translateX(-40px) translateY(30px)"  },
  // bottom-right
  { top: "72%", right: "6%",  rotate:  "2.5deg",from:"translateX(40px) translateY(30px)"  },
] as const;

function ProblemsGrid({ problems }: { problems: ProblemCard[] }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(false);

  // Trigger all cards when the scene enters viewport
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sceneRef} className="zazu-scene w-full max-w-[1100px] mx-auto">

      {/* ── Centered heading text (absolute center on desktop, first in DOM for mobile) ── */}
      <div className="zazu-center">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(12px)",
            transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: "80ms",
          }}
        >
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#1b1b1b]">
            Why Traditional EHS Systems{" "}
            <span style={{ color: "#155eef" }}>Fall Short</span>
          </h2>
          <p
            className="font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.75] text-[#727272] mt-3"
            style={{ textWrap: "pretty" } as React.CSSProperties}
          >
            Human attention, manual processes and scattered data create dangerous gaps.
          </p>
        </div>
      </div>

      {/* ── Scattered cards ── */}
      {problems.map((p, i) => {
        const pos = CARD_POSITIONS[i];
        return (
          <div
            key={p.title}
            ref={el => { cardRefs.current[i] = el; }}
            className={`zazu-card${visible ? " zz-visible" : ""}`}
            style={{
              top:    "top"   in pos ? pos.top   : undefined,
              left:   "left"  in pos ? pos.left  : undefined,
              right:  "right" in pos ? pos.right : undefined,
              transform: visible
                ? `rotate(${pos.rotate})`
                : `${pos.from} rotate(${pos.rotate})`,
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <ProblemCard card={p} />
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS prop types
// ─────────────────────────────────────────────────────────────────────────────

interface CmsHero {
  title?: string;
  subtitle?: string;
  [key: string]: any;
}

interface CmsTextCta {
  title?: string;
  description?: string;
  button?: { button?: { label?: string; type?: string; url?: string } };
  [key: string]: any;
}

interface CmsProblemItem {
  icon?: string;
  title?: string;
  description?: string;
  link?: any;
  [key: string]: any;
}

interface CmsCapabilityStep {
  eyebrow?: string;
  title?: string;
  description?: string;
  icon?: string;
  image?: any;
  sub_items?: any[];
  [key: string]: any;
}

interface CmsCtaBanner {
  title?: string;
  description?: string;
  button?: any;
  [key: string]: any;
}

interface IrisPageProps {
  cmsHero?: CmsHero;
  cmsTextCta?: CmsTextCta;
  cmsProblems?: CmsProblemItem[];
  cmsCapabilities?: CmsCapabilityStep[];
  cmsCtaBanner?: CmsCtaBanner;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build a ProblemCard array from CMS icon_features items
// Falls back to the hardcoded PROBLEMS constant if CMS data is absent
// ─────────────────────────────────────────────────────────────────────────────

const PROBLEM_COLORS = [
  { color: "#155eef", bg: "#eff4ff" },
  { color: "#ef4444", bg: "#fff5f5" },
  { color: "#7c3aed", bg: "#f7f0ff" },
  { color: "#4f46e5", bg: "#eff0ff" },
  { color: "#f97316", bg: "#fff7ed" },
  { color: "#0891b2", bg: "#ecfeff" },
];

const PROBLEM_ICONS: React.ReactNode[] = [
  <IconEye key="eye" />,
  <IconClipboardX key="clipx" />,
  <IconLayers key="layers" />,
  <IconScatter key="scatter" />,
  <IconClock key="clock" />,
  <IconEyeOff key="eyeoff" />,
];

function buildProblems(cmsItems?: CmsProblemItem[]): ProblemCard[] {
  if (!cmsItems || cmsItems.length === 0) return PROBLEMS;
  return cmsItems.map((item, i) => ({
    title: item.title ?? "",
    desc:  item.description ?? "",
    icon:  PROBLEM_ICONS[i % PROBLEM_ICONS.length],
    color: PROBLEM_COLORS[i % PROBLEM_COLORS.length].color,
    bg:    PROBLEM_COLORS[i % PROBLEM_COLORS.length].bg,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Build a Capability array from CMS number_steps data
// Falls back to the hardcoded CAPABILITIES constant if CMS data is absent
// ─────────────────────────────────────────────────────────────────────────────

const CAPABILITY_PALETTE = [
  { num: "01", color: "#155eef", bg: "#eff4ff", icon: <IconMicrophone key="01" /> },
  { num: "02", color: "#1d4ed8", bg: "#eef2ff", icon: <IconLightbulb  key="02" /> },
  { num: "03", color: "#2563eb", bg: "#dbeafe", icon: <IconSearchTree  key="03" /> },
  { num: "04", color: "#3b82f6", bg: "#dbeafe", icon: <IconNetwork     key="04" /> },
  { num: "05", color: "#0ea5e9", bg: "#e0f2fe", icon: <IconChartLightning key="05" /> },
  { num: "06", color: "#0891b2", bg: "#ecfeff", icon: <IconCameraEye  key="06" /> },
];

function buildCapabilities(cmsSteps?: CmsCapabilityStep[]): Capability[] {
  if (!cmsSteps || cmsSteps.length === 0) return CAPABILITIES;
  return cmsSteps.map((step, i) => {
    const palette = CAPABILITY_PALETTE[i % CAPABILITY_PALETTE.length];
    // sub_items can serve as features list; benefits come from sub_items too if available
    const subItems: any[] = step.sub_items ?? [];
    const features = subItems.slice(0, 3).map((s: any) => s.title ?? s.label ?? String(s));
    const benefits = subItems.length > 3
      ? subItems.slice(3).map((s: any) => s.title ?? s.label ?? String(s))
      : (CAPABILITIES[i]?.benefits ?? []);
    return {
      num:      palette.num,
      color:    palette.color,
      bg:       palette.bg,
      title:    step.title ?? CAPABILITIES[i]?.title ?? "",
      desc:     step.description ?? CAPABILITIES[i]?.desc ?? "",
      features: features.length > 0 ? features : (CAPABILITIES[i]?.features ?? []),
      benefits,
      icon:     palette.icon,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function IrisPage({
  cmsHero,
  cmsTextCta,
  cmsProblems,
  cmsCapabilities,
  cmsCtaBanner,
}: IrisCmsProps = {}) {
  // ── Derived CMS values with hardcoded fallbacks ──────────────────────────
  const heroHeadline    = cmsHero?.headline    || "Meet IRIS";
  const heroSubheadline = cmsHero?.subheadline || undefined;
  const ctaBannerHeadline = cmsCtaBanner?.headline || "Put IRIS to work on your safety data";
  const ctaBannerSubhead  = cmsCtaBanner?.subhead  || "See what you’ve been missing. Book a demo and explore every AI capability live.";

  // ACTIVE_PROBLEMS: prefer CMS items, fall back to module-level PROBLEMS constant.
  // Icons are preserved from the hardcoded array by index (CMS supplies icon name strings,
  // not React nodes — the existing SVG icon components are reused as fallbacks).
  const ACTIVE_PROBLEMS: ProblemCard[] =
    cmsProblems && cmsProblems.length > 0
      ? cmsProblems.map((item, i) => ({
          title: item.title || PROBLEMS[i]?.title || "",
          desc:  item.description || PROBLEMS[i]?.desc || "",
          icon:  PROBLEMS[i]?.icon ?? null,
          color: PROBLEMS[i]?.color || "#155eef",
          bg:    PROBLEMS[i]?.bg    || "#eff4ff",
        }))
      : PROBLEMS;

  // CAPABILITIES: overlay CMS title/desc by index if provided; keep all
  // styling, icons, features and benefits from the hardcoded array.
  // This merged array is passed down to any capabilities sub-section rendered below.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CAPABILITIES_MERGED: Capability[] =
    cmsCapabilities && cmsCapabilities.length > 0
      ? CAPABILITIES.map((cap, i) => {
          const cms = cmsCapabilities[i];
          if (!cms) return cap;
          return {
            ...cap,
            title: cms.title || cap.title,
            desc:  cms.description || cap.desc,
          };
        })
      : CAPABILITIES;

  // Inject CSS keyframes once on client mount
  useEffect(() => {
    const tag = document.createElement("style");
    tag.id = "iris-page-styles";
    if (!document.getElementById("iris-page-styles")) {
      tag.textContent = IRIS_STYLES;
      document.head.appendChild(tag);
    }
    return () => {
      document.getElementById("iris-page-styles")?.remove();
    };
  }, []);

  // Per-section scroll-reveal refs
  const introRef        = useScrollReveal();
  const problemsHeadRef = useScrollReveal();
  const problemsGridRef = useScrollReveal();

  const capHeaderRef   = useScrollReveal();
  const capGridRef     = useScrollReveal();
  const ctaRef         = useScrollReveal();


  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1 — HERO (light mode)                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 sm:px-6"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "clamp(100px, 15vh, 160px)",
          paddingBottom: "clamp(48px, 8vh, 100px)",
        }}
      >
        {/* Animated grid background */}
        <style>{`
          .iris-hero-grid-container {
            background-image:
              linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          @keyframes irisHeroGridBoxFill { 0%,100%{opacity:0} 50%{opacity:0.6} }
          .iris-hero-grid-box { position:absolute; width:48px; height:48px; }
          @keyframes irisCardFromLeft {
            from { opacity: 0; transform: translateX(-36px) translateY(8px); }
            to   { opacity: 1; transform: translateX(0) translateY(0); }
          }
          @keyframes irisCardFromRight {
            from { opacity: 0; transform: translateX(36px) translateY(8px); }
            to   { opacity: 1; transform: translateX(0) translateY(0); }
          }
          @keyframes irisCardFromBottom {
            from { opacity: 0; transform: translateY(28px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .iris-card-left {
            opacity: 0;
            animation: irisCardFromLeft 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards;
          }
          .iris-card-right {
            opacity: 0;
            animation: irisCardFromRight 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards;
          }
          .iris-card-bottom {
            opacity: 0;
            animation: irisCardFromBottom 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
          }
          .iris-hero-card {
            transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s ease;
            cursor: default;
          }
          .iris-hero-card:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 10px 32px rgba(0,0,0,0.10) !important;
          }
        `}</style>
        <div className="absolute inset-0 overflow-hidden iris-hero-grid-container pointer-events-none">
          {Array.from({ length: 120 }, (_, i) => {
            const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
            const colorVariant = i % 4;
            const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
            const animationDelay = (i * 0.3) % 12;
            const animationDuration = 4 + ((i * 2) % 6);
            const row = Math.floor(i / 20);
            const col = i % 20;
            return shouldAnimate ? (
              <div
                key={`iris-hero-grid-box-${i}`}
                className="iris-hero-grid-box"
                style={{
                  left: `${col * 50 + 1}px`,
                  top: `${row * 50 + 1}px`,
                  backgroundColor: colors[colorVariant],
                  animation: `irisHeroGridBoxFill ${animationDuration}s ease-in-out infinite`,
                  animationDelay: `${animationDelay}s`,
                }}
              />
            ) : null;
          })}
          {/* Bottom fade overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%)",
            }}
          />
        </div>

        {/* ── Title ── */}
        <div className="relative z-10 text-center mb-2 animate-hero-rise" style={{ animationDelay:"60ms" }}>
          {cmsHero?.headline ? (
            <h1
              className="font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] sm:text-[44px] md:text-[56px] leading-[1.06] tracking-[-0.03em] text-[#0a0f1e]"
              dangerouslySetInnerHTML={{ __html: heroHeadline }}
            />
          ) : (
            <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] sm:text-[44px] md:text-[56px] leading-[1.06] tracking-[-0.03em] text-[#0a0f1e]">
              Meet IRIS
              <br />
              <span style={{ color:"#1d4ed8" }}>Intelligent Risk &amp; Insight System</span>
            </h1>
          )}
          {heroSubheadline && (
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] leading-[1.7] text-[#4b5563] mt-4 max-w-[600px] mx-auto text-pretty">
              {heroSubheadline}
            </p>
          )}
        </div>

        {/* ── CTAs ── */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 mt-2 mb-8 animate-hero-rise" style={{ animationDelay: "200ms" }}>
          <GlareButton
            href="#"
            className="inline-flex items-center gap-2 px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white duration-200 hover:shadow-lg"
            style={{
              backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
              boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
            }}
          >
            Book AI Demo
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </GlareButton>
          <GlareButton
            href="#"
            fillColor="#FFA660"
            hoverTextColor="#ffffff"
            className="px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] border"
            style={{ borderColor: "#d1d5db", color: "#374151" }}
          >
            See Pricing
          </GlareButton>
        </div>

        {/* ── Cards + IRIS logo ── */}
        <div className="relative z-10 w-full max-w-[1100px]">

          {/* Top row: left 2 cards | IRIS circle | right 2 cards */}
          <div className="flex items-center justify-center gap-5 lg:gap-8">

            {/* Left column: 2 cards */}
            <div className="hidden lg:flex flex-col gap-4 w-[220px] shrink-0">
              {/* Card 1: Hazard Intelligence */}
              <div className="iris-hero-card iris-card-left" style={{ background:"white", border:"1px solid #e8edf5", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", animationDelay:"350ms" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:10, fontFamily:"var(--font-dm-sans,sans-serif)" }}>Hazard Intelligence</p>
                {[["Chemical exposure","#ef4444",78],["Height work","#f97316",54],["Electrical","#eab308",35]].map(([l,c,w]) => (
                  <div key={String(l)} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:10, color:"#6b7280", width:88, flexShrink:0, fontFamily:"var(--font-dm-sans,sans-serif)" }}>{l}</span>
                    <div style={{ flex:1, height:4, background:"#f3f4f6", borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${w}%`, background:String(c), borderRadius:2 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card 2: Predictive Analytics */}
              <div className="iris-hero-card iris-card-left" style={{ background:"white", border:"1px solid #e8edf5", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", animationDelay:"480ms" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:10, fontFamily:"var(--font-dm-sans,sans-serif)" }}>Predictive Analytics</p>
                <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:40 }}>
                  {[14,22,18,30,26,38,34,44].map((h,i) => (
                    <div key={i} style={{ flex:1, height:`${h}px`, background:`rgba(59,130,246,${0.25+i*0.09})`, borderRadius:"3px 3px 0 0" }} />
                  ))}
                </div>
                <p style={{ fontSize:10, color:"#3b82f6", marginTop:6, fontFamily:"var(--font-dm-sans,sans-serif)", fontWeight:600 }}>↓ 23% risk reduction</p>
              </div>
            </div>

            {/* Center: Orb + IRIS logo */}
            <div className="relative shrink-0" style={{ width: 280, height: 280 }}>
              <Orb
                hue={30}
                hoverIntensity={0.5}
                rotateOnHover={false}
                forceHoverState={false}
                backgroundColor="#ffffff"
              />
              {/* IRIS logo centred over orb */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <Image
                  src={`${basePath}/images/iris-logo.png`}
                  alt="IRIS"
                  width={90}
                  height={90}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            {/* Right column: 2 cards */}
            <div className="hidden lg:flex flex-col gap-4 w-[220px] shrink-0">
              {/* Card 3: Workflow Acceleration */}
              <div className="iris-hero-card iris-card-right" style={{ background:"white", border:"1px solid #e8edf5", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", animationDelay:"350ms" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:10, fontFamily:"var(--font-dm-sans,sans-serif)" }}>Workflow Acceleration</p>
                {[["Investigation","92%","#f59e0b"],["Actions closed","78%","#f97316"],["Reports filed","100%","#10b981"]].map(([l,v,c]) => (
                  <div key={String(l)} style={{ marginBottom:7 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:10, color:"#6b7280", fontFamily:"var(--font-dm-sans,sans-serif)" }}>{l}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:String(c), fontFamily:"var(--font-dm-sans,sans-serif)" }}>{v}</span>
                    </div>
                    <div style={{ height:4, background:"#f3f4f6", borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:v, background:String(c), borderRadius:2 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card 4: Natural Language Query */}
              <div className="iris-hero-card iris-card-right" style={{ background:"white", border:"1px solid #e8edf5", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", animationDelay:"480ms" }}>
                <p style={{ fontSize:10, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:10, fontFamily:"var(--font-dm-sans,sans-serif)" }}>Natural Language Query</p>
                <div style={{ background:"#f3f4f6", borderRadius:8, padding:"7px 10px", marginBottom:7 }}>
                  <p style={{ fontSize:10, color:"#374151", fontFamily:"var(--font-dm-sans,sans-serif)", fontStyle:"italic" }}>&ldquo;Top risks this quarter?&rdquo;</p>
                </div>
                <div style={{ background:"#eff6ff", borderRadius:8, padding:"7px 10px" }}>
                  <p style={{ fontSize:10, color:"#1d4ed8", fontFamily:"var(--font-dm-sans,sans-serif)", fontWeight:500 }}>3 critical trends detected in Site A ↗</p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom row: 2 cards centred below the circle */}
          <div className="hidden lg:flex justify-center gap-4 mt-4">
            {/* Card 5: Smart Recommendations */}
            <div className="iris-hero-card iris-card-bottom w-[220px]" style={{ background:"white", border:"1px solid #e8edf5", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", animationDelay:"560ms" }}>
              <p style={{ fontSize:10, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:10, fontFamily:"var(--font-dm-sans,sans-serif)" }}>Smart Recommendations</p>
              {["Deploy safety barriers","Retrain 3 operators","Update risk register"].map((t,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                  <div style={{ width:15, height:15, borderRadius:4, background:i===0?"#10b981":"transparent", border:i===0?"none":"1.5px solid #d1d5db", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {i===0 && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5l2 2 4-3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize:10, color:i===0?"#9ca3af":"#374151", fontFamily:"var(--font-dm-sans,sans-serif)", textDecoration:i===0?"line-through":"none" }}>{t}</span>
                </div>
              ))}
            </div>

            {/* Card 6: Intelligent Data Synthesis */}
            <div className="iris-hero-card iris-card-bottom w-[220px]" style={{ background:"white", border:"1px solid #e8edf5", borderRadius:14, padding:"14px 16px", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", animationDelay:"620ms" }}>
              <p style={{ fontSize:10, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:10, fontFamily:"var(--font-dm-sans,sans-serif)" }}>Intelligent Data Synthesis</p>
              <div style={{ display:"flex", gap:12, marginBottom:8 }}>
                {[["Incidents","247","#6366f1"],["Actions","89","#8b5cf6"],["Sites","14","#a78bfa"]].map(([l,v,c]) => (
                  <div key={String(l)} style={{ flex:1, textAlign:"center" }}>
                    <p style={{ fontSize:20, fontWeight:800, color:String(c), fontFamily:"var(--font-gothic-a1,sans-serif)", lineHeight:1 }}>{v}</p>
                    <p style={{ fontSize:9, color:"#6b7280", fontFamily:"var(--font-dm-sans,sans-serif)", marginTop:3, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2 — ABOUT IRIS (simple text)                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section
        ref={introRef}
        className="py-[70px] md:py-[90px] px-4 md:px-6"
        style={{ background: "#F8FBFF" }}
      >
        <div className="max-w-[760px] mx-auto text-center flex flex-col gap-5 iris-reveal-target">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-tight tracking-[-0.025em] text-[#1b1b1b]">
            {cmsTextCta?.title
              ? <span dangerouslySetInnerHTML={{ __html: cmsTextCta.title }} />
              : <>About <span style={{ color: "#155eef" }}>IRIS</span></>
            }
          </h2>

          <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#1b1b1b] text-pretty">
            {cmsTextCta?.description ?? (
              <>
                IRIS <span style={{ color: "#727272" }}>(Intelligent Risk &amp; Insight System)</span>{" "}
                is EHSWatch&apos;s embedded AI layer — built into every workflow your safety team
                already uses. Six capabilities work together to surface hazards earlier, accelerate
                incident closure and turn raw safety data into actionable intelligence that used to
                take days to compile manually.
              </>
            )}
          </p>

          <div className="w-12 border-t border-[#d1d5db] mx-auto" />

          <p className="font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.75] italic text-[#727272]">
            &ldquo;IRIS doesn&apos;t replace your safety team&apos;s judgment — it sharpens it.&rdquo;
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3 — PROBLEMS (modules-style grid)                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
        <style>{`
          @media (min-width: 640px) and (max-width: 1023px) {
            .problems-row > *:nth-child(2n) { border-right: none !important; }
          }
        `}</style>
        <div className="max-w-[1160px] mx-auto">
          {/* Heading */}
          <div className="text-center mb-10 md:mb-14" ref={problemsHeadRef}>
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#1b1b1b] iris-reveal-target">
              Why Traditional EHS Systems{" "}
              <span style={{ color: "#155eef" }}>Fall Short</span>
            </h2>
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.75] text-[#727272] mt-3 max-w-[520px] mx-auto text-pretty iris-reveal-target" style={{ transitionDelay: "80ms" }}>
              Human attention, manual processes and scattered data create dangerous gaps.
            </p>
          </div>

          {/* Grid — no outer border, internal dividers only (matches modules style) */}
          <div ref={problemsGridRef}>
            {[0, 1].map((rowIdx) => {
              const row = ACTIVE_PROBLEMS.slice(rowIdx * 3, rowIdx * 3 + 3);
              const isLastRow = rowIdx === 1;
              return (
                <div key={rowIdx} className="problems-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 iris-stagger iris-reveal-target" style={{ transitionDelay: `${rowIdx * 120}ms` }}>
                  {row.map((p, colIdx) => (
                    <div
                      key={p.title}
                      className="flex flex-col gap-3 px-5 sm:px-7 py-6 sm:py-8"
                      style={{
                        borderBottom: !isLastRow ? "1px solid #e5e7eb" : "none",
                        borderRight: colIdx < 2 ? "1px solid #e5e7eb" : "none",
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: p.color + "14", color: p.color }}
                      >
                        {p.icon}
                      </div>

                      {/* Title */}
                      <h3 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug">
                        {p.title}
                      </h3>

                      {/* Description */}
                      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.65] text-pretty">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4+5 — AI CHAT SHOWCASE (scroll-driven)                      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <IRISChatShowcase />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 6 — CTA (orange gradient)                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className="relative py-12 md:py-[61px] px-4 md:px-6 overflow-hidden iris-reveal-target"
        style={{
          background: "#f1f7ff",
        }}
      >
        <div className="max-w-[800px] mx-auto flex flex-col gap-3 md:gap-[16px] items-center text-center">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-[#0a0f1e] whitespace-nowrap">
            {ctaBannerHeadline}
          </h2>

          <p className="font-[family-name:var(--font-dm-sans)] text-[14px] md:text-[15px] leading-relaxed text-[#6b7280] max-w-[500px] whitespace-nowrap">
            {ctaBannerSubhead}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-[16px] items-center justify-center pt-4 md:pt-[24px]">
            <GlareButton
              href={cmsCtaBanner?.button?.button?.url ?? "#"}
              className="flex items-center justify-center px-6 md:px-[26px] py-3 md:py-[10px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white whitespace-nowrap"
              style={{
                backgroundImage:
                  "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
              }}
            >
              {cmsCtaBanner?.button?.button?.label ?? "Book Your Free Demo"}
            </GlareButton>
            <GlareButton
              fillColor="#FFA660"
              hoverTextColor="#ffffff"
              href="#"
              className="flex items-center justify-center px-7 md:px-[31.5px] py-3 md:py-[10px] rounded-full border font-[family-name:var(--font-dm-sans)] text-[14px] text-[#ff6d00]"
              style={{ background: "rgba(255,120,44,0.1)", borderColor: "rgba(255,120,44,0.2)" }}
            >
              View Pricing
            </GlareButton>
          </div>
        </div>
      </section>
    </>
  );
}
