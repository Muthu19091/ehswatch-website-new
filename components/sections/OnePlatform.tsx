"use client";

import { useState, useEffect, useRef } from "react";
import { basePath } from "@/lib/basePath";

/* ── asset paths ──────────────────────────────────────────────── */
const OP_BASE   = basePath + "/images/One%20Platform%20for%20Everyday%20Safety";
const COMP_BASE = OP_BASE  + "/Compliance%20Reporting";
const MOB_BASE  = OP_BASE  + "/Mobile%20App";
const UNI_BASE  = OP_BASE  + "/Unified%20Platform";

/* ── Figma status-bar assets (7-day URLs) ─────────────────────── */
const FIGMA_SIGNAL  = "https://www.figma.com/api/mcp/asset/5b351eba-1f50-49f7-8278-a5667065c964";
const FIGMA_WIFI    = "https://www.figma.com/api/mcp/asset/03abb2f7-0c36-4c5a-a183-fb9a20c87386";
const FIGMA_BATTERY = "https://www.figma.com/api/mcp/asset/daa49278-9d84-42d8-a756-d98f5acb1bd1";

/* ── keyframes ──────────────────────────────────────────────────
   op-bar-grow        : tab progress bar
   op-fade-up         : rows / cards appearing
   op-progress-fill   : compliance progress bars
   op-phone-float     : phone gentle bob
   op-orbit           : pivot rotates (icon nodes only)
   op-counter-orbit   : arm translates + counter-rotates (155 px radius)
   op-float           : tiny vertical bob per icon card
   op-node-in         : opacity fade-in on mount (prevents positional jump)
────────────────────────────────────────────────────────────────── */
const STYLES = `
@keyframes op-bar-grow {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes op-fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes op-progress-fill {
  from { width: 0%; }
  to   { width: var(--target-w, 100%); }
}
@keyframes op-phone-float {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-7px); }
}
@keyframes op-orbit {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes op-counter-orbit {
  from { transform: translateX(155px) rotate(0deg); }
  to   { transform: translateX(155px) rotate(-360deg); }
}
@keyframes op-float {
  0%,100% { transform: translateY(0px); }
  50%     { transform: translateY(-5px); }
}
@keyframes op-node-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`;

/* ══════════════════════════════════════════════════════════════════
   1. COMPLIANCE REPORTING
   Icon circle backgrounds — exact Figma colours
   ISO 9001  → soft purple  #ede9fe  (imgEllipse)
   ISO 14001 → soft green   #d1fae5  (imgFrame175)
   ISO 45001 → soft orange  #fff3e0  (imgFrame174)
   OSHA Audit→ dark navy    #1e3154  (imgFrame176)
   ══════════════════════════════════════════════════════════════════ */
const COMPLIANCE_ROWS = [
  {
    icon: COMP_BASE + "/Quality%20Management.png",
    iconBg: "#6843DD",
    invertIcon: true,          /* white icon on purple bg */
    name: "ISO 9001",        sub: "Quality Management",
    pct: 100, barColor: "#26b859",
    badge: "Compliant",       badgeBg: "#e0ffe5", badgeColor: "#269e52",
    due: null,
  },
  {
    icon: COMP_BASE + "/Environmental%20Management.png",
    iconBg: "#26B859",
    invertIcon: true,          /* white icon on green bg */
    name: "ISO 14001",       sub: "Environmental Management",
    pct: 72,  barColor: "#cc8c1a",
    badge: "In Progress",     badgeBg: "#fff5db", badgeColor: "#cc8c1a",
    due: null,
  },
  {
    icon: COMP_BASE + "/Occupational%20Health%20%26%20Safety.png",
    iconBg: "#FDB11E",
    invertIcon: true,          /* white icon on amber bg */
    name: "ISO 45001",       sub: "Occupational Health & Safety",
    pct: 40,  barColor: "#e53838",
    badge: "Action Required", badgeBg: "#ffe5e5", badgeColor: "#d92e2e",
    due: "Due: 25 May 2025",
  },
  {
    icon: COMP_BASE + "/Workplace%20Safety.png",
    iconBg: "#1e3154",
    invertIcon: true,          /* white icon on dark navy bg */
    name: "OSHA Audit",      sub: "Workplace Safety",
    pct: null, barColor: "#e5e8ed",
    badge: "Pending",         badgeBg: "#ededf5", badgeColor: "#808ca6",
    due: "Due: 10 Jun 2025",
  },
];

function ComplianceMockup() {
  return (
    <div className="flex items-center justify-center h-full px-6 py-6">
      <div
        className="w-full max-w-[540px] rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 8px 32px rgba(20,31,56,0.10)",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eef1f6]">
          <span className="font-semibold text-[#141f38] text-[15px]">Compliance Standards</span>
          <span className="text-[#2e75f2] font-semibold text-[12px] cursor-pointer">View All  ›</span>
        </div>

        {/* rows */}
        <div className="flex flex-col divide-y divide-[#eef1f6]">
          {COMPLIANCE_ROWS.map((row, i) => (
            <div
              key={row.name}
              className="flex items-center gap-3 px-5 py-3.5"
              style={{ opacity: 0, animation: `op-fade-up 0.4s ease-out ${0.1 + i * 0.1}s forwards` }}
            >
              {/* icon circle — exact Figma bg colour */}
              <div
                className="shrink-0 rounded-full flex items-center justify-center"
                style={{ width: 40, height: 40, padding: 8, background: row.iconBg, flexShrink: 0 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={row.icon}
                  alt={row.sub}
                  style={{
                    width: "100%", height: "100%", objectFit: "contain",
                    filter: row.invertIcon ? "brightness(0) invert(1)" : undefined,
                  }}
                />
              </div>

              {/* name + sub */}
              <div className="min-w-0" style={{ flex: "0 0 clamp(110px,13vw,165px)" }}>
                <p className="font-semibold text-[#141f38] text-[13px] leading-tight truncate">{row.name}</p>
                <p className="text-[#808ca6] text-[10px] leading-tight mt-0.5 truncate">{row.sub}</p>
              </div>

              {/* progress */}
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                {row.pct !== null ? (
                  <>
                    <span className="font-semibold text-[12px] leading-none" style={{ color: row.barColor }}>
                      {row.pct}%
                    </span>
                    <div className="relative h-[5px] rounded-full bg-[#e5e8ed] overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          background: row.barColor, width: 0,
                          animation: `op-progress-fill 0.9s ease-out ${0.3 + i * 0.1}s forwards`,
                          ["--target-w" as string]: `${row.pct}%`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-[#99a6b8] text-[16px]">–</span>
                    <div className="h-[5px] rounded-full bg-[#e5e8ed]" />
                  </>
                )}
              </div>

              {/* badge */}
              <div className="shrink-0 flex flex-col items-end gap-0.5">
                <span
                  className="font-semibold px-2.5 py-1 rounded-full whitespace-nowrap text-[10px]"
                  style={{ background: row.badgeBg, color: row.badgeColor }}
                >
                  {row.badge}
                </span>
                {row.due && <span className="text-[#808ca6] text-[9px]">{row.due}</span>}
              </div>
              <span className="text-[#bbb] ml-1 text-[16px]">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. MOBILE APP
   — Mobile mockup.png is the transparent phone FRAME layered ON TOP
   — Actual screen content sits underneath, inset to match Figma
   — +20% size from previous clamp(130px,22%,168px)
   ══════════════════════════════════════════════════════════════════ */
const MOB_FIELDS = [
  { label: "Organization *",      value: "Exceego Infolabs Inc.", placeholder: "",                  hasClose: true   },
  { label: "Source",              value: "Others",                placeholder: ""                                    },
  { label: "Other Source",        value: "",                      placeholder: "Enter other source"                  },
  { label: "Action Type *",       value: "",                      placeholder: "Select"                              },
  { label: "Priority *",          value: "",                      placeholder: "Select"                              },
  { label: "Action Required *",   value: "",                      placeholder: "Select"                              },
  { label: "Person Responsible *",value: "",                      placeholder: "Select"                              },
  { label: "Target Date *",       value: "",                      placeholder: "Select",             hasCalendar: true},
];

function MobileMockup() {
  return (
    <div className="flex items-center justify-center h-full px-8 py-6">
      {/* Size by HEIGHT so the tall portrait SVG never overflows the panel */}
      <div
        style={{
          opacity: 0,
          animation: "op-fade-up 0.5s ease-out 0.1s forwards",
          lineHeight: 0,           /* collapse wrapper to img size */
        }}
      >
        <div style={{ animation: "op-phone-float 4s ease-in-out 0.8s infinite" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MOB_BASE + "/Mobile%20App.svg"}
            alt="EHSWatch Mobile App"
            style={{
              display: "block",
              height: "clamp(360px, 56vw, 520px)",   /* height-driven — width scales naturally */
              width: "auto",
              maxWidth: "300px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. UNLIMITED USERS
   ══════════════════════════════════════════════════════════════════ */
const USERS = [
  { initials: "AA", bg: "#2659d9", name: "Aarav Mehta",    email: "aarav.mehta@ecompany.com",  role: "ADMIN",         roleBg: "#ffe0e0", roleColor: "#d92e2e" },
  { initials: "ST", bg: "#7c3aed", name: "Sara Thomas",    email: "sara.thomas@ecompany.com",  role: "POWER USER",    roleBg: "#e0ffe5", roleColor: "#1a994d" },
  { initials: "RP", bg: "#0891b2", name: "Rohit Patel",    email: "rohit.patel@ecompany.com",  role: "POWER USER",    roleBg: "#e0ffe5", roleColor: "#1a994d" },
  { initials: "LH", bg: "#059669", name: "Lina Hernandez", email: "lina.h@ecompany.com",       role: "STANDARD USER", roleBg: "#e0ebff", roleColor: "#1f75f2" },
];

function UsersMockup() {
  return (
    <div className="flex items-center justify-center h-full px-6 py-6">
      <div
        className="w-full max-w-[540px] rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.34)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 8px 32px rgba(20,31,56,0.08)" }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-semibold text-[#1a2440] text-[15px]">Team Members</span>
          <button className="bg-[#2e75f2] text-white font-semibold rounded-lg text-[11px] cursor-pointer px-3.5 py-1.5">＋ Add New</button>
        </div>
        <div className="mx-4 mb-3 bg-white rounded-xl px-5 py-3 flex items-center justify-between" style={{ opacity: 0, animation: "op-fade-up 0.4s ease-out 0.1s forwards" }}>
          {[{ val: "248", sub: "Active Users" }, { val: "Unlimited", sub: "Seats" }, { val: "No Extra Charge", sub: "Always included" }].map((s) => (
            <div key={s.val} className="flex flex-col">
              <span className="text-[#1a2440] font-bold text-[14px]">{s.val}</span>
              <span className="text-[#808ca6] text-[9px]">{s.sub}</span>
            </div>
          ))}
        </div>
        <p className="px-5 font-semibold tracking-widest text-[#808ca6] uppercase text-[8px] mb-2">Active Users</p>
        <div className="mx-4 bg-white rounded-xl overflow-hidden mb-3 divide-y divide-[#eef1f6]">
          {USERS.map((u, i) => (
            <div key={u.name} className="flex items-center gap-3 px-4 py-2.5" style={{ opacity: 0, animation: `op-fade-up 0.4s ease-out ${0.2 + i * 0.1}s forwards` }}>
              <div className="shrink-0 rounded-full flex items-center justify-center font-bold text-white text-[10px]" style={{ width: 32, height: 32, background: u.bg }}>{u.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1a2440] text-[11px] truncate">{u.name}</p>
                <p className="text-[#808ca6] text-[9px] truncate">{u.email}</p>
              </div>
              <span className="shrink-0 font-bold rounded text-[8px]" style={{ background: u.roleBg, color: u.roleColor, padding: "3px 7px" }}>{u.role}</span>
            </div>
          ))}
        </div>
        <div className="mx-4 mb-4 bg-[#f0f5ff] rounded-xl px-5 py-2.5" style={{ opacity: 0, animation: "op-fade-up 0.4s ease-out 0.65s forwards" }}>
          <p className="text-[#2e75f2] font-semibold text-[11px]">Unlimited seats — no extra charge</p>
          <p className="text-[#5973a6] text-[9px] mt-0.5">Invite your whole team. Scale without limits.</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. UNIFIED PLATFORM
   ─────────────────────────────────────────────────────────────────
   • Rings:  COMPLETELY STATIC — no animation whatsoever
   • Icons:  placed at exact Figma % positions (from node 791-887,
             466 px reference frame) so labels are always right-side up.
   • Float:  ±5 px gentle vertical bob per icon (calm)
   • Fade:   each icon fades in on mount
   ══════════════════════════════════════════════════════════════════ */

/* Ring PNGs: static, no animation.  Size % of container (largest → smallest). */
const RINGS = [
  { file: "3.png", size: 100 },
  { file: "2.png", size: 78  },
  { file: "1.png", size: 53  },
  { file: "0.png", size: 32  },
];

/*
  Icon positions — converted from Figma pixel coords (466 px container)
  to % of container.  left/top = top-left corner of the icon card.
  Figma data (node 791-887):
    Environment  left=124.33  top=41.56   w=37.72
    Supplier     left=285.84  top=111.28  w=41.83
    Risk         left=414.82  top=124.06  w=37.72
    Health       left=338.13  top=293.71  w=37.72
    Safety       left=127.82  top=265.82  w=38.38
    Quality      left=0       top=185.64  w=38.38
*/
const UNI_ICONS = [
  { key: "Environment", img: UNI_BASE + "/Property%201%3DEnvironment.png", left: "26.7%", top: "8.9%",  floatDur: 4.8, floatDelay: 0    },
  { key: "Supplier",    img: UNI_BASE + "/Property%201%3DSuplier.png",     left: "61.3%", top: "23.9%", floatDur: 5.3, floatDelay: 0.55 },
  { key: "Risk",        img: UNI_BASE + "/Property%201%3DRisk.png",        left: "89.0%", top: "26.6%", floatDur: 4.2, floatDelay: 1.1  },
  { key: "Health",      img: UNI_BASE + "/Property%201%3DHEalth.png",      left: "72.6%", top: "63.0%", floatDur: 5.8, floatDelay: 1.65 },
  { key: "Safety",      img: UNI_BASE + "/Property%201%3DSecurity.png",    left: "27.4%", top: "57.1%", floatDur: 4.5, floatDelay: 2.2  },
  { key: "Quality",     img: UNI_BASE + "/Property%201%3DQuality.png",     left: "0%",    top: "39.8%", floatDur: 5.0, floatDelay: 2.75 },
];

function UnifiedMockup() {
  return (
    <div className="flex items-center justify-center h-full px-4 py-4">
      {/* Container — reduced 10% from previous clamp(396px,80%,560px) */}
      <div style={{ width: "clamp(357px, 72%, 504px)", aspectRatio: "1 / 1", position: "relative" }}>

        {/* ── STATIC concentric ring PNGs ── */}
        {RINGS.map(({ file, size }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={file}
            src={`${UNI_BASE}/${file}`}
            alt=""
            style={{
              position: "absolute",
              width: `${size}%`, height: `${size}%`,
              top: `${(100 - size) / 2}%`, left: `${(100 - size) / 2}%`,
              objectFit: "contain",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        ))}

        {/* ── STATIC centre logo ── */}
        <div
          style={{
            position: "absolute",
            width: "22%", height: "22%",
            top: "39%", left: "39%",
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 4px 16px rgba(20,31,56,0.12)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${UNI_BASE}/Logo.png`} alt="EHSWatch" style={{ width: "72%", objectFit: "contain", marginBottom: 1 }} />
          <p style={{ color: "#5d5b5b", fontWeight: 500, fontSize: "clamp(4px,0.45vw,6.5px)", textAlign: "center", lineHeight: 1.2, margin: 0 }}>
            Unified Platform
          </p>
        </div>

        {/*
          ── MODULE ICONS — absolute % positioning from Figma coords ──────
          Each icon is placed directly at its Figma-derived (left%, top%)
          position. No pivot/arm rotation, so labels are always right-side up.

          Structure:
            [FADE wrapper]  → position: absolute at (left%, top%)
              [FLOAT div]   → op-float animation (gentle vertical bob)
                [ICON card] → rounded box with icon image
                [LABEL]     → text below, centred under icon
        */}
        {UNI_ICONS.map((mod, i) => (
          /* Fade-in on mount */
          <div
            key={mod.key}
            style={{
              position: "absolute",
              left: mod.left,
              top: mod.top,
              opacity: 0,
              animation: `op-node-in 0.4s ease-out ${0.1 + i * 0.08}s forwards`,
            }}
          >
            {/* Float wrapper — bobs icon + label together */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "clamp(3px,0.3vw,5px)",
                animation: `op-float ${mod.floatDur}s ease-in-out ${mod.floatDelay}s infinite`,
              }}
            >
              {/* Icon card */}
              <div
                style={{
                  background: "#f8fbff",
                  borderRadius: 16,
                  border: "0.5px solid #dae8ff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "clamp(36px,3.4vw,50px)",
                  height: "clamp(36px,3.4vw,50px)",
                  padding: "clamp(7px,0.75vw,11px)",
                  boxShadow: "0 5.8px 2px rgba(214,214,214,0.05), 0 2.3px 1.2px rgba(214,214,214,0.09), 0 1.2px 0.6px rgba(214,214,214,0.10)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mod.img} alt={mod.key} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              {/* Label — always upright, centred below icon */}
              <span
                style={{
                  fontWeight: 500,
                  color: "#264073",
                  fontSize: "clamp(8px,0.72vw,11px)",
                  whiteSpace: "nowrap",
                  textShadow: "0 1px 3px rgba(255,255,255,0.9)",
                }}
              >
                {mod.key}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TAB DATA
   ══════════════════════════════════════════════════════════════════ */
const TABS = [
  { number: "1.", label: "Compliance Reporting", title: "Stay Audit-Ready, Always",           desc: "Automatically generate compliance reports, track control effectiveness, and get ahead of regulatory deadlines — all from one centralised dashboard.", link: "See Compliance Tools" },
  { number: "2.", label: "Mobile App",           title: "Safety in the Field, Offline-Ready", desc: "Your team can submit hazard reports, complete inspections, and log incidents directly from their phone — even without an internet connection.",         link: "Explore Mobile Features" },
  { number: "3.", label: "Unlimited Users",      title: "Scale Without Extra Cost",           desc: "Add as many team members as you need — from field workers to executives — with role-based access and zero per-seat charges.",                         link: "See Pricing" },
  { number: "4.", label: "Unified Platform",     title: "Everything in One Place",            desc: "From incident management to contractor safety, all your EHSQ modules share the same data, the same interface, and update in real-time.",               link: "View All Modules" },
];

const MOCKUPS    = [ComplianceMockup, MobileMockup, UsersMockup, UnifiedMockup];
const TAB_DURATION = 4000;

/* ══════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════════ */

interface OnePlatformProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsTabs?: Array<{
    label: string;
    title: string;
    description: string;
    badge?: string | null;
    cmsImage?: string | null;
    ctaLabel: string;
    ctaUrl: string;
  }>;
}

export default function OnePlatform({ cmsHeading, cmsSubheading, cmsTabs }: OnePlatformProps) {
  const [active, setActive]       = useState(0);
  const [inView, setInView]       = useState(false);
  const [cycleKey, setCycleKey]   = useState(0);
  // stylesReady gates mockup rendering so animations always have keyframes available
  const [stylesReady, setStylesReady] = useState(false);
  const sectionRef                = useRef<HTMLElement>(null);
  const MockupPanel               = MOCKUPS[active];

  const sectionHeading = cmsHeading?.trim() || "One Platform for Everyday Safety";
  const sectionSubheading = cmsSubheading?.trim() || "EHSWatch brings all your EHSQ activities into a single, easy-to-use platform so everyone, from workers in the field to leadership, works from the same, up-to-date information.";
  const tabs = TABS.map((t, i) => {
    const cms = cmsTabs?.[i];
    return {
      ...t,
      label: cms?.label?.trim() || t.label,
      title: cms?.title?.trim() || t.title,
      desc: cms?.description?.trim() || t.desc,
      link: cms?.ctaLabel?.trim() || t.link,
      badge: cms?.badge ?? null,
      cmsImage: cms?.cmsImage ?? null,
    };
  });

  // Inject keyframes first, then mark ready — forces a second render with animations available
  useEffect(() => {
    const id = "op-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }
    setStylesReady(true);
  }, []);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(0); setCycleKey((k) => k + 1); setInView(true); }
      else { setInView(false); }
    }, { threshold: 0.10 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tab auto-advance is driven by onAnimationEnd on the progress bar span.
  // No setInterval needed — the bar completing IS the signal to switch tabs.

  return (
    <section ref={sectionRef} className="bg-[#f8fbff] py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#1b1b1b]">
            {(() => {
              const HIGHLIGHT = "Everyday Safety";
              const idx = sectionHeading.indexOf(HIGHLIGHT);
              if (idx === -1) return <>{sectionHeading}</>;
              return <>{sectionHeading.slice(0, idx)}<span className="text-[#155eef]">{HIGHLIGHT}</span>{sectionHeading.slice(idx + HIGHLIGHT.length)}</>;
            })()}
          </h2>
          <p className="mt-3 font-[family-name:var(--font-dm-sans)] font-medium text-[14px] md:text-[16px] lg:text-[18px] leading-relaxed text-[#727272] max-w-[809px] mx-auto">
            {sectionSubheading}
          </p>
        </div>

        {/* card */}
        <div className="border border-[#cbcbcb] rounded-[8px] overflow-hidden bg-[#f8fbff]">

          {/* tab bar */}
          <div
            role="tablist"
            aria-label="Platform features"
            className="flex border-b border-[#dde2eb] overflow-x-auto scrollbar-none"
          >
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                role="tab"
                aria-selected={active === i}
                tabIndex={active === i ? 0 : -1}
                onClick={() => { setActive(i); setCycleKey((k) => k + 1); }}
                className={[
                  "flex-1 flex flex-col items-center justify-center px-2 md:px-3 py-[14px] md:py-[17px] min-h-[48px] md:min-h-[56px]",
                  "text-[11px] sm:text-[12px] md:text-[15px] font-medium cursor-pointer",
                  "transition-colors min-w-0 relative overflow-hidden whitespace-nowrap",
                  i < TABS.length - 1 ? "border-r border-r-[#dde2eb]" : "",
                  active === i ? "text-[#0a0f1e]" : "text-[#888] hover:text-[#555]",
                ].join(" ")}
              >
                <span className="flex items-center gap-1.5">
                  {tab.label}
                  {tab.badge && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold bg-[#f97316] text-white leading-none">
                      {tab.badge}
                    </span>
                  )}
                </span>
                {inView && active === i && (
                  <span
                    key={`bar-${cycleKey}-${active}`}
                    className="absolute bottom-0 left-0 h-[2.5px] w-full bg-[#f97316]"
                    style={{ transform: "scaleX(0)", transformOrigin: "left center", animation: `op-bar-grow ${TAB_DURATION}ms linear forwards` }}
                    onAnimationEnd={() => {
                      setActive((p) => (p + 1) % TABS.length);
                      setCycleKey((k) => k + 1);
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* content */}
          <div
            role="tabpanel"
            aria-label={TABS[active].label}
            className="flex flex-col md:flex-row min-h-[420px] md:min-h-[580px] lg:min-h-[620px]"
          >
            {/* left — text */}
            <div className="flex-none md:flex-[0_0_38%] px-6 md:px-12 py-8 md:py-12 flex flex-col justify-center">
              <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[24px] leading-snug text-[#0a0f1e] mb-3">
                {tabs[active].title}
              </h3>
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] md:text-[15px] text-[#555] leading-relaxed">
                {tabs[active].desc}
              </p>
              <button className="mt-6 self-start font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#f97316] hover:text-[#ea6c00] transition-colors cursor-pointer">
                {tabs[active].link} →
              </button>
            </div>
            {/* right — mockup, fills remaining space */}
            <div className="flex-1 overflow-hidden">
              {tabs[active].cmsImage ? (
                <div className="flex items-center justify-center h-full p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tabs[active].cmsImage!}
                    alt={tabs[active].title}
                    className="max-h-full max-w-full object-contain rounded-xl"
                    style={{ maxHeight: "clamp(320px,45vw,520px)" }}
                  />
                </div>
              ) : (
                stylesReady && <MockupPanel key={`${active}-${cycleKey}-${stylesReady}`} />
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
