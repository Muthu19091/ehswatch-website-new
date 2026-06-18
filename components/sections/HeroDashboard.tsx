"use client";

import Image from "next/image";
import { basePath } from "@/lib/basePath";
import { useInView } from "@/hooks/useInView";

// ─── Donut chart data ──────────────────────────────────────────────────────────
const RADIUS = 68;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 427.26

const DONUT_SEGMENTS = [
  { label: "High",   pct: 35, color: "#d6302b", length: CIRCUMFERENCE * 0.35, rotation: -90 },
  { label: "Medium", pct: 25, color: "#f79126", length: CIRCUMFERENCE * 0.25, rotation: -90 + 126 },
  { label: "Low",    pct: 40, color: "#42b857", length: CIRCUMFERENCE * 0.40, rotation:  36 + 90  },
] as const;

// ─── Bar chart data ────────────────────────────────────────────────────────────
const BAR_DATA = [
  { label: "Open",     value: 13, color: "#386ba3" },
  { label: "Progress", value: 10, color: "#f79126" },
  { label: "Closed",   value: 20, color: "#42b857" },
  { label: "Overdue",  value:  4, color: "#d6302b" },
] as const;

const BAR_MAX     = 20;

// ─── SVG nav icons ─────────────────────────────────────────────────────────────
function IconHome({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#155eef" : "#9aa5b8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}
function IconWarning({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#155eef" : "#9aa5b8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconChart({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#155eef" : "#9aa5b8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="12" width="4" height="9" rx="1" />
      <rect x="10" y="7" width="4" height="14" rx="1" />
      <rect x="17" y="3" width="4" height="18" rx="1" />
    </svg>
  );
}
function IconChecklist({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#155eef" : "#9aa5b8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function IconSettings({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#155eef" : "#9aa5b8"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

// ─── Metric card icons ─────────────────────────────────────────────────────────
function IconIncidents() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#386ba3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconActions() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#386ba3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function IconObservations() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#386ba3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconRate() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#386ba3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

// ─── Inline calendar / location icons for filter cards ────────────────────────
function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa5b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa5b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ─── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: IconHome,      active: false },
  { icon: IconWarning,   active: false },
  { icon: IconChart,     active: true  }, // active = reports
  { icon: IconChecklist, active: false },
  { icon: IconSettings,  active: false },
] as const;

// ─── Metric cards data ─────────────────────────────────────────────────────────
const METRICS = [
  { label: "TOTAL INCIDENTS",      value: "237",   Icon: IconIncidents    },
  { label: "PENDING ACTIONS",      value: "12",    Icon: IconActions      },
  { label: "TOTAL OBSERVATIONS",   value: "1,258", Icon: IconObservations },
  { label: "INCIDENT RATE",        value: "1.2",   Icon: IconRate         },
] as const;

// ─── Y-axis grid lines for bar chart ──────────────────────────────────────────
const Y_LABELS = [20, 10, 0];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function HeroDashboard() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className="w-full flex flex-col bg-[#f6f5f5] h-full overflow-hidden"
      style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
    >
      {/* ── Browser Chrome Bar ────────────────────────────────────────────────── */}
      <div className="h-8 bg-[#f0f0f0] border-b border-gray-200 flex items-center px-3 gap-2 flex-shrink-0">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
        </div>
        {/* Address bar */}
        <div className="flex-1 flex justify-center">
          <div className="h-4 px-3 bg-white border border-gray-200 rounded-full flex items-center">
            <span className="text-[8px] text-gray-400">app.ehswatch.com</span>
          </div>
        </div>
        {/* Mock controls */}
        <div className="flex items-center gap-1">
          <div className="w-3 h-2 bg-gray-300 rounded-[2px]" />
          <div className="w-3 h-2 bg-gray-300 rounded-[2px]" />
        </div>
      </div>

      {/* ── Sidebar + Main row ────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left Sidebar ────────────────────────────────────────────────────── */}
        <aside className="w-[56px] sm:w-[68px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-6">
          {/* Logo mark */}
          <Image
            src={basePath + "/images/EHS%20Logo%20fav.png"}
            alt="EHS"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />

          {/* Nav icons */}
          <nav className="flex flex-col gap-5 mt-2">
            {NAV_ITEMS.map(({ icon: Icon, active }, i) => (
              <div
                key={i}
                className={`flex items-center justify-center w-[32px] h-[32px] rounded-lg transition-colors duration-150 ${
                  active ? "bg-[#f2f7fa]" : "hover:bg-gray-50"
                }`}
              >
                <Icon active={active} />
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Main Area ───────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top Nav */}
          <header className="h-[44px] bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center justify-between px-4 flex-shrink-0">
            <span
              className="font-semibold text-[#1a1f2e]"
              style={{ fontSize: 13 }}
            >
              Welcome
            </span>
            <div className="flex items-center gap-2">
              <button className="text-[#738094] text-[10px] px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                Filter dashboard
              </button>
              <button className="text-[#738094] text-[10px] px-2 py-1 rounded hover:bg-gray-50 transition-colors">
                Edit Dashboard
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 bg-[#f6f5f5] p-2 sm:p-3 overflow-hidden flex flex-col gap-1.5 sm:gap-3 min-h-0">

            {/* Row 1 — Filter widgets */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-shrink-0">
              {/* Filter by Date */}
              <div className="bg-white rounded-xl shadow-sm p-2 sm:p-3">
                <p className="text-[9px] sm:text-[10px] font-semibold text-[#738094] uppercase tracking-wide mb-1 sm:mb-2">
                  Filter by Date
                </p>
                <div className="h-px bg-gray-100 mb-1 sm:mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-[12px] font-medium text-[#1a1f2e]">12/06/2025</span>
                  <IconCalendar />
                </div>
              </div>

              {/* Filter by Location */}
              <div className="bg-white rounded-xl shadow-sm p-2 sm:p-3">
                <p className="text-[9px] sm:text-[10px] font-semibold text-[#738094] uppercase tracking-wide mb-1 sm:mb-2">
                  Filter by Location
                </p>
                <div className="h-px bg-gray-100 mb-1 sm:mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-[12px] font-medium text-[#1a1f2e]">Offshore</span>
                  <IconPin />
                </div>
              </div>
            </div>

            {/* Row 2 — Metric cards */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3 flex-shrink-0">
              {METRICS.map(({ label, value, Icon }, i) => (
                <div
                  key={label}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm p-1.5 sm:p-3 flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  {/* Icon square */}
                  <div className="flex-shrink-0 w-[24px] h-[24px] sm:w-[36px] sm:h-[36px] bg-[#e8edf5] rounded-lg sm:rounded-xl flex items-center justify-center">
                    <Icon />
                  </div>
                  {/* Text */}
                  <div className="min-w-0 text-center sm:text-left">
                    <p className="text-[6px] sm:text-[8px] font-semibold text-[#738094] uppercase tracking-wide leading-tight hidden sm:block">
                      {label}
                    </p>
                    <p className="text-[12px] sm:text-[18px] font-bold text-[#1a4db8] leading-tight mt-0 sm:mt-0.5">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3 — Charts */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-3 flex-1 min-h-0">

              {/* Left: Donut chart */}
              <div className="bg-white rounded-xl shadow-sm p-2 sm:p-3 flex flex-col min-h-0">
                <p className="text-[9px] sm:text-[10px] font-semibold text-[#1a1f2e] uppercase tracking-wide mb-1 sm:mb-2 flex-shrink-0">
                  Incidents by Severity
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 flex-1 min-h-0 overflow-hidden">
                  {/* SVG Donut */}
                  <svg
                    viewBox="0 0 160 160"
                    className="flex-shrink-0 w-[90px] h-[90px] sm:w-[130px] sm:h-[130px]"
                    style={{ overflow: "visible" }}
                  >
                    {/* Background ring */}
                    <circle
                      cx="80" cy="80" r={RADIUS}
                      fill="none"
                      stroke="#f0f0f0"
                      strokeWidth="20"
                    />
                    {/* Animated segments */}
                    {DONUT_SEGMENTS.map((seg, i) => {
                      const delay = i * 0.3;
                      const dashArray = `${seg.length} ${CIRCUMFERENCE - seg.length}`;
                      return (
                        <circle
                          key={seg.label}
                          cx="80" cy="80" r={RADIUS}
                          fill="none"
                          stroke={seg.color}
                          strokeWidth="20"
                          strokeDasharray={dashArray}
                          strokeLinecap="butt"
                          transform={`rotate(${seg.rotation}, 80, 80)`}
                          style={{
                            transition: `stroke-dashoffset 1.2s ease-out ${delay}s`,
                            strokeDashoffset: inView ? 0 : seg.length,
                          }}
                        />
                      );
                    })}
                    {/* Center label */}
                    <text x="80" y="77" textAnchor="middle" fill="#1a1f2e" fontSize="14" fontWeight="700">237</text>
                    <text x="80" y="90" textAnchor="middle" fill="#9aa5b8" fontSize="8.5">incidents</text>
                  </svg>

                  {/* Legend */}
                  <div className="flex flex-col gap-1 sm:gap-2">
                    {DONUT_SEGMENTS.map((seg) => (
                      <div key={seg.label} className="flex items-center gap-1 sm:gap-1.5">
                        <div
                          className="flex-shrink-0 rounded-[2px]"
                          style={{ width: 10, height: 10, backgroundColor: seg.color }}
                        />
                        <span className="text-[9.5px] text-[#738094] leading-none">{seg.label}</span>
                        <span className="text-[9.5px] font-semibold text-[#1a1f2e] leading-none ml-0.5">
                          {seg.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Bar chart */}
              <div className="bg-white rounded-xl shadow-sm p-2 sm:p-3 flex flex-col min-h-0">
                <p className="text-[9px] sm:text-[10px] font-semibold text-[#1a1f2e] uppercase tracking-wide mb-1 sm:mb-2 flex-shrink-0">
                  Actions by Status
                </p>

                <div className="flex flex-1 min-h-0 gap-2 pt-1 sm:pt-2">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between items-end flex-shrink-0 pb-4 self-stretch">
                    {Y_LABELS.map((v) => (
                      <span key={v} className="text-[7px] sm:text-[8px] text-[#9aa5b8] leading-none">
                        {v}
                      </span>
                    ))}
                  </div>

                  {/* Bars area */}
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Grid lines + Bars */}
                    <div className="relative flex-1 min-h-0">
                      {Y_LABELS.map((_, i) => (
                        <div
                          key={i}
                          className="absolute left-0 right-0 border-t border-gray-100"
                          style={{ top: `${(i / (Y_LABELS.length - 1)) * 100}%` }}
                        />
                      ))}

                      {/* Bars — percentage-based heights */}
                      <div className="absolute inset-0 flex items-end justify-around px-1 gap-1.5 sm:gap-2">
                        {BAR_DATA.map((bar, i) => {
                          const delay = i * 0.12;
                          return (
                            <div
                              key={bar.label}
                              className="flex-1 rounded-t-[3px] cursor-pointer transition-[filter,transform] duration-150 hover:brightness-110 hover:scale-x-[1.04]"
                              style={{
                                height: `${(bar.value / BAR_MAX) * 100}%`,
                                backgroundColor: bar.color,
                                transformOrigin: "bottom",
                                transform: inView ? "scaleY(1)" : "scaleY(0)",
                                transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-around px-1 gap-1.5 sm:gap-2 mt-1 flex-shrink-0">
                      {BAR_DATA.map((bar) => (
                        <span
                          key={bar.label}
                          className="flex-1 text-center text-[7px] sm:text-[8px] text-[#9aa5b8] leading-none"
                        >
                          {bar.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
