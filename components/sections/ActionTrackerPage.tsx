"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import GlareButton from "@/components/ui/GlareButton";
import { basePath } from "@/lib/basePath";

// ─────────────────────────────────────────────────────────────────────────────
// Action Tracker Flow Diagram — exact Figma implementation (transparent bg)
// ─────────────────────────────────────────────────────────────────────────────

function ActionTrackerDiagram() {
  const [vis, setVis] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const v = vis;
  const A = `${basePath}/images/Action%20tracker%20/Assest`;

  return (
    <div ref={ref} className="w-full select-none">
      <style>{`
        .atd-n { opacity: 0; }
        .atd-n.v { animation: atdNIn 0.45s ease-out forwards; }
        .atd-c { opacity: 0; }
        .atd-c.v { animation: atdCIn 0.4s ease-out forwards; }
        @keyframes atdNIn { from { opacity:0; } to { opacity:1; } }
        @keyframes atdCIn { from { opacity:0; } to { opacity:1; } }
      `}</style>

      {/* viewBox: 0 0 960 480 — no background rect, transparent */}
      <svg viewBox="0 0 960 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <marker id="ar-r"  markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 1 L6 3.5 L0 6Z" fill="#EF4444"/></marker>
          <marker id="ar-g"  markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 1 L6 3.5 L0 6Z" fill="#059669"/></marker>
          <marker id="ar-o"  markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 1 L6 3.5 L0 6Z" fill="#FF6D00"/></marker>
          <marker id="ar-b"  markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 1 L6 3.5 L0 6Z" fill="#155EEF"/></marker>
          <marker id="ar-gr" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 1 L6 3.5 L0 6Z" fill="#9CA3AF"/></marker>
          <marker id="ar-gl" markerWidth="7" markerHeight="7" refX="1.5" refY="3.5" orient="auto"><path d="M6 1 L0 3.5 L6 6Z" fill="#9CA3AF"/></marker>
        </defs>

        {/* ═══ CONNECTORS — Left → Center ═══ */}

        {/* Incident (right edge 180, y=68) → center left (340, 228) — RED */}
        <g className={`atd-c${v?" v":""}`} style={{animationDelay:"0.12s"}}>
          <circle cx="180" cy="68" r="4.5" fill="#EF4444"/>
          <path d="M180 68 H248 Q260 68 260 80 V216 Q260 228 272 228 H340"
            stroke="#EF4444" strokeWidth="1.8" fill="none" strokeLinecap="round" markerEnd="url(#ar-r)"/>
        </g>

        {/* Inspection (right edge 140, y=174) → center left (340, 228) — GREEN */}
        <g className={`atd-c${v?" v":""}`} style={{animationDelay:"0.22s"}}>
          <circle cx="140" cy="174" r="4.5" fill="#059669"/>
          <path d="M140 174 H248 Q260 174 260 186 V216 Q260 228 272 228 H340"
            stroke="#059669" strokeWidth="1.8" fill="none" strokeLinecap="round" markerEnd="url(#ar-g)"/>
        </g>

        {/* Audit Finding (right edge 180, y=296) → center left (340, 228) — ORANGE */}
        <g className={`atd-c${v?" v":""}`} style={{animationDelay:"0.32s"}}>
          <circle cx="180" cy="296" r="4.5" fill="#FF6D00"/>
          <path d="M180 296 H248 Q260 296 260 284 V240 Q260 228 272 228 H340"
            stroke="#FF6D00" strokeWidth="1.8" fill="none" strokeLinecap="round" markerEnd="url(#ar-o)"/>
        </g>

        {/* Observation (right edge 180, y=412) → center left (340, 228) — BLUE */}
        <g className={`atd-c${v?" v":""}`} style={{animationDelay:"0.42s"}}>
          <circle cx="180" cy="412" r="4.5" fill="#155EEF"/>
          <path d="M180 412 H240 Q252 412 252 400 V240 Q252 228 264 228 H340"
            stroke="#155EEF" strokeWidth="1.8" fill="none" strokeLinecap="round" markerEnd="url(#ar-b)"/>
        </g>

        {/* ═══ CONNECTORS — Center → Right (dashed) ═══ */}

        {/* → Assigned (cx=700, cy=62) */}
        <path d="M515 228 H566 Q578 228 578 216 V74 Q578 62 590 62 H668"
          stroke="#9CA3AF" strokeWidth="1.4" fill="none" strokeLinecap="round"
          strokeDasharray="5 4" markerEnd="url(#ar-gr)"
          className={`atd-c${v?" v":""}`} style={{animationDelay:"0.85s"}}/>

        {/* → In Progress (cx=716, cy=174) */}
        <path d="M515 228 H566 Q578 228 578 216 V186 Q578 174 590 174 H684"
          stroke="#9CA3AF" strokeWidth="1.4" fill="none" strokeLinecap="round"
          strokeDasharray="5 4" markerEnd="url(#ar-gr)"
          className={`atd-c${v?" v":""}`} style={{animationDelay:"0.95s"}}/>

        {/* → Review (cx=716, cy=280) */}
        <path d="M515 228 H566 Q578 228 578 240 V268 Q578 280 590 280 H684"
          stroke="#9CA3AF" strokeWidth="1.4" fill="none" strokeLinecap="round"
          strokeDasharray="5 4" markerEnd="url(#ar-gr)"
          className={`atd-c${v?" v":""}`} style={{animationDelay:"1.05s"}}/>

        {/* → Closed (cx=700, cy=392) — bidirectional */}
        <path d="M515 228 H566 Q578 228 578 240 V380 Q578 392 590 392 H668"
          stroke="#9CA3AF" strokeWidth="1.4" fill="none" strokeLinecap="round"
          strokeDasharray="5 4" markerEnd="url(#ar-gr)" markerStart="url(#ar-gl)"
          className={`atd-c${v?" v":""}`} style={{animationDelay:"1.15s"}}/>

        {/* ═══ LEFT INPUT CARDS ═══ */}

        {/* Incident: x=50, y=30, 130×76 → right-edge-center (180, 68) */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"0s"}}>
          <rect x="50" y="30" width="130" height="76" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          <image href={`${A}/Incident.svg`} x="100" y="39" width="30" height="30"/>
          <text x="115" y="90" textAnchor="middle" fontSize="12" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">Incident</text>
        </g>

        {/* Inspection: x=10, y=136, 130×76 → right-edge-center (140, 174) */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"0.08s"}}>
          <rect x="10" y="136" width="130" height="76" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          <image href={`${A}/Inspection.svg`} x="60" y="145" width="30" height="30"/>
          <text x="75" y="199" textAnchor="middle" fontSize="12" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">Inspection</text>
        </g>

        {/* Audit Finding: x=50, y=258, 130×76 → right-edge-center (180, 296) */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"0.16s"}}>
          <rect x="50" y="258" width="130" height="76" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          <image href={`${A}/Audit%20Finding.svg`} x="100" y="267" width="30" height="30"/>
          <text x="115" y="320" textAnchor="middle" fontSize="12" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">Audit Finding</text>
        </g>

        {/* Observation: x=50, y=374, 130×76 → right-edge-center (180, 412) */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"0.24s"}}>
          <rect x="50" y="374" width="130" height="76" rx="12" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          <image href={`${A}/Observation.svg`} x="100" y="383" width="30" height="30"/>
          <text x="115" y="436" textAnchor="middle" fontSize="12" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">Observation</text>
        </g>

        {/* ═══ CENTER HUB — x=340, y=168, 175×120 ═══ */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"0.55s"}}>
          <rect x="340" y="168" width="175" height="120" rx="22" fill="white" stroke="#BFDBFE" strokeWidth="1.5"/>
          <image href={`${A}/Action%20Tracker.svg`} x="405" y="185" width="45" height="45"/>
          <text x="428" y="252" textAnchor="middle" fontSize="15" fill="#111827"
            fontFamily="var(--font-gothic-a1,sans-serif)" fontWeight="700">Action Tracker</text>
        </g>

        {/* ═══ RIGHT STATUS CIRCLES ═══ */}

        {/* Assigned: cx=700, cy=62, r=32 */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"0.85s"}}>
          <circle cx="700" cy="62" r="32" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          <image href={`${A}/Assigned.svg`} x="686" y="48" width="28" height="28"/>
          <text x="746" y="67" fontSize="13" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">Assigned</text>
        </g>

        {/* In Progress: cx=716, cy=174, r=32 */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"0.95s"}}>
          <circle cx="716" cy="174" r="32" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          <image href={`${A}/In%20Progress.svg`} x="701" y="159" width="30" height="30"/>
          <text x="762" y="179" fontSize="13" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">In Progress</text>
        </g>

        {/* Review: cx=716, cy=280, r=32 */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"1.05s"}}>
          <circle cx="716" cy="280" r="32" fill="white" stroke="#E5E7EB" strokeWidth="1"/>
          <image href={`${A}/Review.svg`} x="701" y="265" width="30" height="30"/>
          <text x="762" y="285" fontSize="13" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">Review</text>
        </g>

        {/* Closed: cx=700, cy=392, r=32 — green tint */}
        <g className={`atd-n${v?" v":""}`} style={{animationDelay:"1.15s"}}>
          <circle cx="700" cy="392" r="32" fill="#F0FDF4" stroke="#22C55E" strokeWidth="1.2"/>
          <image href={`${A}/Closed.svg`} x="685" y="377" width="30" height="30"/>
          <text x="746" y="397" fontSize="13" fill="#374151" fontFamily="var(--font-dm-sans,sans-serif)" fontWeight="500">Closed</text>
        </g>

      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M19 4l1.5 1.5L23 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#155eef",
    title: "Instant Assignment",
    desc: "Create actions with a defined owner, due date and priority level the moment a finding is raised — no separate task or email required.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 3v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M15 3v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M7 14h3M7 17h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="17" cy="15.5" r="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M16 15.5l.8.8 1.7-1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#059669",
    title: "Real-Time Status",
    desc: "Monitor all open, overdue and completed actions across every site and team from a single live dashboard. Filter by owner, module, location or priority.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    color: "#f59e0b",
    title: "Automated Notifications",
    desc: "Configurable email and in-app alerts notify owners when actions are assigned, approaching their deadline or overdue. Escalation paths ensure nothing stalls silently.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="7" cy="6" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="17" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
    color: "#7c3aed",
    title: "Custom Workflows",
    desc: "Define multi-step approval and review workflows that match your organisation's processes — from simple two-step closures to complex multi-team sign-off chains.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 15h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="16" cy="16" r="3.5" fill="white" stroke="currentColor" strokeWidth="1.4" />
        <path d="M16 14.5v2l1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#0891b2",
    title: "Mobile-First",
    desc: "Assign, update, comment on or approve actions from any smartphone or tablet, online or offline. Ideal for field teams and multi-site operations.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "#155eef",
    title: "Connected Platform",
    desc: "Actions auto-link to their originating record — whether an incident, audit finding, observation or risk assessment — with no manual re-entry and no data duplication.",
  },
];

const DIFFERENTIATORS = [
  "Rapid deployment with no IT dependency — configure workflows, approvals and notifications without development resource.",
  "Built by EHS experts who understand what safety teams need in the field.",
  "Scales from small teams to enterprise-wide multi-site deployments.",
  "ISO 45001-aligned audit trail supports external audits, regulatory inspections and certification reviews.",
];

const FAQS = [
  {
    q: "What is EHSWatch Action Tracker?",
    a: "Action Tracker centralises corrective and preventive actions originating from incidents, audits, observations, risk assessments and other modules. Each action has a defined owner, deadline and priority level. Status is tracked in real time, and every change is logged with a full audit trail — so nothing falls through the cracks and accountability is always clear.",
  },
  {
    q: "Can Action Tracker be configured for our specific workflow?",
    a: "Yes. Approval steps, notification rules, form fields, escalation paths and dashboards are all configurable to match your organisation's processes — without any coding or external development resource.",
  },
  {
    q: "Does it integrate with other EHSWatch modules?",
    a: "Yes. Because Action Tracker is built within the EHSWatch platform, actions link directly to the originating record — whether that is an incident, audit, observation or risk assessment. There is no manual data transfer and no duplication across systems.",
  },
  {
    q: "Who typically uses Action Tracker?",
    a: "Action Tracker is used by EHS Managers, Quality Managers, Operations Supervisors and Compliance Officers who need structured, visible follow-through on safety and quality findings. It is equally valuable for front-line supervisors managing field actions and for HSE Directors monitoring close-out performance across multiple sites.",
  },
  {
    q: "How does it support compliance and audit requirements?",
    a: "Action Tracker maintains a complete audit trail of every action — owner history, status changes, comments, attachments and closure evidence — all timestamped and user-attributed. This record is exportable for regulatory inspections, ISO 45001 audits and internal compliance reviews.",
  },
  {
    q: "Is Action Tracker accessible on mobile devices?",
    a: "Yes. The full module is accessible on smartphones and tablets, with offline capability for field teams in remote or low-connectivity environments. Data syncs automatically when connectivity is restored.",
  },
];

const MORE_MODULES = [
  {
    name: "Incident Management", href: "#", color: "#ef4444",
    desc: "Capture, investigate and close incidents faster with structured workflows and root cause analysis.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L18 17H2L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 9v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14.5" r="0.8" fill="currentColor"/></svg>,
  },
  {
    name: "Audit Management", href: "#", color: "#6366f1",
    desc: "Plan, conduct and follow up on compliance, supplier and internal audits from one connected platform.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="4" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4V3.5A1.5 1.5 0 0 1 8.5 2h3A1.5 1.5 0 0 1 13 3.5V4" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  {
    name: "Risk Assessment", href: "#", color: "#6366f1",
    desc: "Identify hazards, assess risk levels and document controls before incidents occur.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5v5C3 14.1 6 17.4 10 18c4-0.6 7-3.9 7-7.5v-5L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    name: "HSE Observations", href: "#", color: "#f59e0b",
    desc: "Report unsafe acts, unsafe conditions and positive safety behaviours in real time from the field.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
  },
  {
    name: "IRIS AI", href: "/iris", color: "#6366f1",
    desc: "Let EHSWatch's AI surface patterns, recommend actions and generate insights your team would otherwise miss.",
    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l1.5 6L18 10l-6.5 2L10 18l-1.5-6L2 10l6.5-2L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function ExploreLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="self-start inline-flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] font-medium text-[14px] no-underline transition-all duration-200"
      style={{
        color: hovered ? "#cc5700" : "#FF6D00",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}
    >
      <span>{label}</span>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function ModuleCard({ mod, isLast }: { mod: typeof MORE_MODULES[number]; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col gap-3 px-5 sm:px-6 py-6 sm:py-8"
      style={{ borderRight: !isLast ? "1px solid #e5e7eb" : "none" }}
    >
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ background: mod.color + "14", color: mod.color }}
      >
        {mod.icon}
      </div>
      <h3 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug">
        {mod.name}
      </h3>
      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.65] flex-1 text-pretty">
        {mod.desc}
      </p>
      <Link
        href={mod.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="mt-1 self-start inline-flex items-center gap-1 font-[family-name:var(--font-dm-sans)] font-medium text-[13px] no-underline transition-all duration-200"
        style={{
          color: hovered ? "#cc5700" : "#FF6D00",
          transform: hovered ? "translateX(3px)" : "translateX(0)",
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

function CTAButton({ href, label, variant = "primary" }: { href: string; label: string; variant?: "primary" | "ghost" }) {
  if (variant === "primary") {
    return (
      <GlareButton
        href={href}
        className="gap-2 px-8 py-[12px] rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[15px] text-white transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
          boxShadow: "0 4px 24px rgba(249,115,22,0.30)",
        }}
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </GlareButton>
    );
  }
  return (
    <GlareButton
      href={href}
      fillColor="#FFA660"
      hoverTextColor="#ffffff"
      className="gap-2 px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] border transition-all duration-200"
      style={{ borderColor: "#d1d5db", color: "#374151" }}
    >
      {label}
    </GlareButton>
  );
}

function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
      <div className="max-w-[820px] mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] md:text-[38px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="flex flex-col divide-y divide-[#e5eaf2]">
          {FAQS.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] sm:text-[16px] text-[#0a0f1e]">
                  {faq.q}
                </span>
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-colors duration-200"
                  style={{ background: openIdx === i ? "#1d4ed8" : "#e5eaf2" }}
                >
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
                  >
                    <path d="M2 4l4 4 4-4" stroke={openIdx === i ? "white" : "#374151"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              {openIdx === i && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.8] text-[#6b7280] mt-3 text-pretty">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ActionTrackerPage() {
  return (
    <>
      <style>{`
        /* Grid hero */
        .at-grid-container {
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes atGridBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.6; }
        }
        .at-grid-box {
          position: absolute;
          width: 48px;
          height: 48px;
        }

        /* Feature card hover */
        .at-feature-card {
          transition: box-shadow 0.22s ease, transform 0.22s ease;
        }
        .at-feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.08) !important;
        }

        /* Module links */
        .at-module-card {
          transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
        }
        .at-module-card:hover {
          border-color: #93c5fd !important;
          box-shadow: 0 4px 16px rgba(59,130,246,0.10);
          transform: translateY(-2px);
        }

        /* Scroll reveal */
        @keyframes atFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .at-reveal {
          opacity: 0;
          animation: atFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

      {/* ── 1. HERO ── */}
      <section
        className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
        style={{
          minHeight: "58vh",
          background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",
        }}
      >
        {/* Animated grid */}
        <div className="absolute inset-0 overflow-hidden at-grid-container pointer-events-none">
          {Array.from({ length: 200 }, (_, i) => {
            const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
            const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
            const animationDelay = (i * 0.45) % 4;
            const animationDuration = 4 + ((i * 2) % 6);
            const row = Math.floor(i / 20);
            const col = i % 20;
            return shouldAnimate ? (
              <div
                key={`at-gb-${i}`}
                className="at-grid-box"
                style={{
                  left: `${col * 50 + 1}px`,
                  top: `${row * 50 + 1}px`,
                  backgroundColor: colors[i % 4],
                  animation: `atGridBoxFill ${animationDuration}s ease-in-out infinite`,
                  animationDelay: `${animationDelay}s`,
                }}
              />
            ) : null;
          })}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 70%, white 100%)" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-[800px] w-full mx-auto text-center flex flex-col items-center gap-5 md:gap-6">


          <h1
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[50px] md:text-[58px] leading-[1.06] text-[#0a0f1e] tracking-[-0.03em] animate-hero-rise"
            style={{ animationDelay: "80ms" }}
          >
            Turn Findings Into{" "}
            <span style={{ color: "#1d4ed8" }}>Results</span>
          </h1>

          <p
            className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] md:text-[18px] text-[#4b5563] leading-[1.75] max-w-[860px] animate-hero-rise text-pretty"
            style={{ animationDelay: "180ms" }}
          >
            No more lost actions or endless email chains. EHSWatch Action Tracker gives every corrective and preventive action a clear owner, a firm deadline and a transparent audit trail — from the moment a finding is raised to the moment it is closed.
          </p>

          <p
            className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[16px] sm:text-[17px] text-[#0a0f1e] animate-hero-rise"
            style={{ animationDelay: "240ms" }}
          >
            Stop chasing actions. Start closing them.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 animate-hero-rise" style={{ animationDelay: "300ms" }}>
            <CTAButton href="/support" label="Get Free Trial Access" variant="primary" />
            <CTAButton href="/pricing" label="View Pricing" variant="ghost" />
          </div>
        </div>
      </section>

      {/* ── 2. WHY ACTION TRACKER ── */}
      <section className="py-[70px] md:py-[90px] px-4 md:px-6" style={{ background: "#F8FBFF" }}>
        <div className="max-w-[1160px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left — text (40%) */}
          <div className="flex flex-col gap-6 w-full lg:w-[40%]">
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
              Why Action Tracker?
            </h2>
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.8] text-[#4b5563] text-pretty">
              In most organisations, corrective and preventive actions are managed across spreadsheets, email threads and verbal commitments. The result is predictable: actions stall, deadlines pass unnoticed, and the same incidents recur because root causes were never properly addressed.
            </p>
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.8] text-[#4b5563] text-pretty">
              EHSWatch Action Tracker replaces that fragmentation with a single, connected workflow. Every action — regardless of where it originates — is assigned, tracked, escalated and closed through one system that everyone can see in real time.
            </p>
            <ExploreLink href="/support" label="See Action Tracker in Action" />
          </div>

          {/* Right — Action Tracker screenshot (60%) */}
          <div className="w-full lg:w-[60%] rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/images/Action%20tracker%20/Action.png`}
              alt="Action Tracker dashboard"
              className="w-full h-auto"
            />
          </div>

        </div>
      </section>

      {/* ── 4. KEY FEATURES ── */}
      <section id="features" className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
        <style>{`
          @media (min-width: 640px) and (max-width: 1023px) {
            .features-row > *:nth-child(2n) { border-right: none !important; }
          }
        `}</style>
        <div className="max-w-[1160px] mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
              Key Features of <span style={{ color: "#1d4ed8" }}>Action Tracker</span>
            </h2>
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] text-[#6b7280] mt-4 max-w-[500px] mx-auto text-pretty leading-[1.7]">
              Everything your team needs to close actions without chasing them.
            </p>
          </div>

          {/* Divider-line grid — same layout as ProductModules */}
          {(() => {
            const rows: typeof FEATURES[] = [];
            for (let i = 0; i < FEATURES.length; i += 3) rows.push(FEATURES.slice(i, i + 3));
            return rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="features-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              >
                {row.map((feat, colIdx) => {
                  const isLastRow = rowIdx === rows.length - 1;
                  return (
                    <div
                      key={colIdx}
                      className="flex flex-col gap-3 px-5 sm:px-7 py-6 sm:py-8"
                      style={{
                        borderBottom: !isLastRow ? "1px solid #e5e7eb" : "none",
                        borderRight: colIdx < 2 ? "1px solid #e5e7eb" : "none",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ background: feat.color + "14", color: feat.color }}
                      >
                        {feat.icon}
                      </div>
                      <h3 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug">
                        {feat.title}
                      </h3>
                      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.65] flex-1 text-pretty">
                        {feat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </section>

      {/* ── 5. WHAT SETS IT APART ── */}
      <section className="py-[70px] md:py-[90px] px-4 md:px-6" style={{ background: "#F8FBFF" }}>
        <style>{`
          @keyframes diffFadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .diff-item {
            opacity: 0;
            animation: diffFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
          }
        `}</style>
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — heading */}
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
            What Sets EHSWatch<br />
            <span style={{ color: "#1d4ed8" }}>Action Tracker</span> Apart
          </h2>

          {/* Right — simple list */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {DIFFERENTIATORS.map((item, i) => (
                <div
                  key={i}
                  className="diff-item flex items-start gap-3"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "#93c5fd" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5l2.8 2.8L9 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.75] text-[#374151] text-pretty">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <FAQAccordion />

      {/* ── 8. FINAL CTA ── */}
      <section className="py-[70px] md:py-[90px] px-4 md:px-6" style={{ background: "#f1f7ff" }}>
        <div className="max-w-[700px] mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
            Ready to Close Actions Faster?
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.8] text-[#4b5563] max-w-[560px] text-pretty">
            Request your free Action Tracker demo. See how EHSWatch transforms safety and compliance findings into closed, evidenced actions — across every site, every team, every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <CTAButton href="/support" label="Get Free Trial Access" variant="primary" />
            <CTAButton href="/pricing" label="View Pricing" variant="ghost" />
          </div>
        </div>
      </section>

      {/* ── 9. EXPLORE MORE MODULES ── */}
      <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
        <div className="max-w-[1160px] mx-auto">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-center mb-10 md:mb-14 text-[#0a0f1e]">
            Explore More <span style={{ color: "#1d4ed8" }}>EHSWatch Modules</span>
          </h2>
          {/* Single row — divider-line grid matching ProductModules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {MORE_MODULES.map((mod, i) => (
              <ModuleCard key={i} mod={mod} isLast={i === MORE_MODULES.length - 1} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
