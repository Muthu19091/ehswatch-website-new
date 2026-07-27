"use client";

import CmsIcon from "@/components/ui/CmsIcon";

import React, { useEffect, useRef, useState } from "react";
import { basePath } from "@/lib/basePath";

/* ── Asset roots ─────────────────────────────────────────────────── */
const HOW = basePath + "/images/product/How%20EHSWatch%20Works";
const S1  = HOW + "/Set%20up%20your%20safety%20processes%C2%A0%20"; // \xa0 (non-breaking space) + regular space
const S2  = HOW + "/Capture%20information%20from%20the%20field";
const S3  = HOW + "/Route%20work%20to%20the%20right%20people";
const S4  = HOW + "/Track%20progress%20in%20real%20time";
const S5  = HOW + "/Use%20insights%20to%20improve%20safety";

/* ── CMS step shape ───────────────────────────────────────────────── */
export interface CmsStep {
  eyebrow?: string;
  title?: string;
  description?: string;
  icon?: string;
  image?: { url?: string } | null;
  sub_items?: Array<{ icon?: string; title?: string; description?: string }>;
}

/* ── Default step copy ────────────────────────────────────────────── */
const DEFAULT_STEPS: Array<{ n: number; title: string; body: string }> = [
  {
    n: 1,
    title: "Set up your safety processes",
    body: "Configure your forms, modules, sites and approval workflows to match how your organisation already operates — without a complex IT setup or external consultants.",
  },
  {
    n: 2,
    title: "Capture information from the field",
    body: "Workers, supervisors and safety teams log incidents, observations, audits or actions from any device. Offline reporting is fully supported — data syncs automatically when connectivity is restored.",
  },
  {
    n: 3,
    title: "Route work to the right people",
    body: "Once submitted, EHSWatch automatically assigns work to the relevant person or team. If actions are not acknowledged within the defined timeframe, the platform escalates automatically — nothing stalls silently.",
  },
  {
    n: 4,
    title: "Track progress in real time",
    body: "Managers monitor open actions, risks and compliance tasks through live dashboards. A clear view of what needs attention, what has been closed, and where recurring issues are emerging.",
  },
  {
    n: 5,
    title: "Use insights to improve safety",
    body: "EHSWatch surfaces patterns, identifies root causes and flags preventive actions — so safety improvements compound with every report submitted.",
  },
];

/* ══════════════════════════════════════════════════════════════════
   STEP 1 — Set up your safety processes
   ══════════════════════════════════════════════════════════════════ */
function Visual1({ active }: { active: boolean }) {
  const rows = [
    { item: "PPE is worn correctly by all personnel",                     yes: true,  remark: "All good"      },
    { item: "Fire extinguishers are available and accessible",            yes: true,  remark: "Accessible"    },
    { item: "Emergency exits are clear and unobstructed",                 yes: true,  remark: "Clear"         },
    { item: "Electrical cables are in good condition and safely routed",  yes: false, remark: "Cable damaged" },
    { item: "Work area is clean and free from hazards",                   yes: true,  remark: "Clean"         },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div
        style={{
          width: "100%", maxWidth: 520,
          background: "white", borderRadius: 18,
          border: "1px solid #e8edf5",
          boxShadow: "0 16px 48px rgba(15,26,51,0.08)",
          overflow: "hidden",
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
          transition: "opacity 0.5s cubic-bezier(0.34,1.1,0.64,1), transform 0.5s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      >
        {/* Column headers */}
        <div style={{ display: "flex", alignItems: "center", padding: "13px 22px 11px", borderBottom: "1px solid #f1f5f9" }}>
          <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>Checklist Item</span>
          <span style={{ width: 86, fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>Status</span>
          <span style={{ width: 118, fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>Remarks</span>
        </div>

        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center",
              padding: "11px 22px",
              borderBottom: i < rows.length - 1 ? "1px solid #f8fafc" : "none",
              opacity: active ? 1 : 0,
              transform: active ? "translateX(0)" : "translateX(18px)",
              transition: `opacity 0.4s ease ${0.1 + i * 0.08}s, transform 0.4s ease ${0.1 + i * 0.08}s`,
            }}
          >
            <span style={{ flex: 1, fontSize: 12.5, color: "#374151", fontWeight: 450, lineHeight: 1.45, paddingRight: 14 }}>
              {row.item}
            </span>
            <div style={{ width: 86 }}>
              {row.yes ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#dcfce7", borderRadius: 20, padding: "4px 11px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.1005 9.8995 1.75 7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.8995 4.1005 12.25 7 12.25Z" stroke="#16A34A" strokeWidth="1.16667"/>
                    <path d="M4.6665 7.29175L6.4165 9.04175L9.33317 5.54175" stroke="#16A34A" strokeWidth="1.28333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#16A34A" }}>Yes</span>
                </div>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fee2e2", borderRadius: 20, padding: "4px 11px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 12.25C9.8995 12.25 12.25 9.8995 12.25 7C12.25 4.1005 9.8995 1.75 7 1.75C4.1005 1.75 1.75 4.1005 1.75 7C1.75 9.8995 4.1005 12.25 7 12.25Z" stroke="#DC2626" strokeWidth="1.16667"/>
                    <path d="M5.25 5.25L8.75 8.75M8.75 5.25L5.25 8.75" stroke="#DC2626" strokeWidth="1.28333" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#DC2626" }}>No</span>
                </div>
              )}
            </div>
            <div style={{
              width: 118, height: 30,
              background: "#f8fafc",
              border: "1px solid #e8edf5",
              borderRadius: 7,
              display: "flex", alignItems: "center",
              paddingLeft: 10,
            }}>
              <span style={{ fontSize: 11.5, color: "#64748b" }}>{row.remark}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STEP 2 — Capture information from the field
   ══════════════════════════════════════════════════════════════════ */
function Visual2({ active }: { active: boolean }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.65s cubic-bezier(0.34,1.4,0.64,1), transform 0.65s cubic-bezier(0.34,1.4,0.64,1)",
          lineHeight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${S2}/Mobile%20App.svg`}
          alt="EHSWatch field capture"
          style={{
            height: "clamp(330px, 55vw, 473px)",
            width: "auto",
            maxWidth: 242,
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STEP 3 — Route work to the right people
   ══════════════════════════════════════════════════════════════════ */
function Visual3({ active }: { active: boolean }) {
  const alerts = [
    { icon: `${S3}/Card/Alert/Check.svg`, text: "Assignment notification sent", delay: 0.52 },
    { icon: `${S3}/Card/Alert/Check.svg`, text: "Reminder sent to assignee",    delay: 0.66 },
    { icon: `${S3}/Card/Alert/clock.svg`, text: "Reminder sent to supervisor",  delay: 0.80 },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div
        style={{
          width: "100%", maxWidth: 450,
          background: "white", borderRadius: 22,
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 56px rgba(15,26,51,0.10)",
          overflow: "hidden",
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0) scale(1)" : "translateY(22px) scale(0.96)",
          transition: "opacity 0.55s cubic-bezier(0.34,1.1,0.64,1), transform 0.55s cubic-bezier(0.34,1.1,0.64,1)",
        }}
      >
        <div style={{ background: "#0087ff", padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${S3}/Card/Avatar%20Wrap.svg`} alt="Team" style={{ height: 50, width: "auto", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.72)", margin: "0 0 3px" }}>Assigned To</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: "white", margin: 0 }}>Maintenance Team</p>
              <div style={{ padding: "5px 13px", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.30)", borderRadius: 20, backdropFilter: "blur(8px)", flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "white" }}>In Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.32s" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${S3}/Card/calendar.svg`} alt="Due date" style={{ width: 24, height: 24, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 2px" }}>Due Date</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>25 May 2025, 05:00 PM</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", background: "#fef3c7", borderRadius: 7, flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${S3}/Card/clock.svg`} alt="Time left" style={{ width: 14, height: 14 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#d97706" }}>2 Days Left</span>
            </div>
          </div>

          <div style={{ height: 1, background: "#f1f5f9" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 9, opacity: active ? 1 : 0, transition: "opacity 0.35s ease 0.42s" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 0 0-5 5v3L2.5 12.5h13L14 10V7A5 5 0 0 0 9 2z" stroke="#0f172a" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M7 12.5v.5a2 2 0 004 0v-.5" stroke="#0f172a" strokeWidth="1.4"/>
              <circle cx="9" cy="2" r="1" fill="#0f172a"/>
            </svg>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>Automated Alerts &amp; Reminders</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {alerts.map((alert, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  opacity: active ? 1 : 0,
                  transform: active ? "translateX(0)" : "translateX(-14px)",
                  transition: `opacity 0.32s ease ${alert.delay}s, transform 0.32s ease ${alert.delay}s`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={alert.icon} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#334155" }}>{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STEP 4 — Track progress in real time
   ══════════════════════════════════════════════════════════════════ */
function Visual4({ active }: { active: boolean }) {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const targets = [237, 12, 1258, 1.2];

  useEffect(() => {
    if (!active) { setCounts([0, 0, 0, 0]); return; }
    const dur = 1400;
    const start = Date.now();
    const tick = () => {
      const t    = Math.min(1, (Date.now() - start) / dur);
      const ease = 1 - Math.pow(1 - t, 3);
      setCounts(targets.map((v, i) =>
        i === 3 ? Math.round(v * ease * 10) / 10 : Math.round(v * ease)
      ));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const kpis = [
    { label: "TOTAL INCIDENTS",    val: counts[0], fmt: (v: number) => String(v) },
    { label: "PENDING ACTIONS",    val: counts[1], fmt: (v: number) => String(v) },
    { label: "TOTAL OBSERVATIONS", val: counts[2], fmt: (v: number) => String(v) },
    { label: "INCIDENT RATE",      val: counts[3], fmt: (v: number) => v.toFixed(1) },
  ];

  const r = 26, circ = 2 * Math.PI * r;
  const donutSegs = [
    { pct: 0.35, color: "#ef4444", label: "High" },
    { pct: 0.25, color: "#f97316", label: "Medium" },
    { pct: 0.40, color: "#22c55e", label: "Low" },
  ];
  const segLens  = donutSegs.map(s => s.pct * circ);
  const segOffsets = [0, -segLens[0], -(segLens[0] + segLens[1])];

  const bars = [
    { label: "Open",     pct: 60, color: "#3b82f6" },
    { label: "Progress", pct: 40, color: "#f97316" },
    { label: "Closed",   pct: 95, color: "#22c55e" },
    { label: "Overdue",  pct: 25, color: "#ef4444" },
  ];

  const leftNav = [
    { file: "Home.svg",           active: false },
    { file: "Graph.svg",          active: true  },
    { file: "Check%20list.svg",   active: false },
    { file: "Grid%20view.svg",    active: false },
  ];
  const rightNav = ["AI.svg", "link.svg", "Notification.svg"];
  const kpiIcons = [
    "TOTAL%20INCIDENTS.svg",
    "PENDING%20ACTIONS.svg",
    "TOTAL%20OBSERVATIONS.svg",
    "INCIDENT%20RATE.svg",
  ];

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ padding: "8px 0" }}>
      <div
        style={{
          width: "100%", maxWidth: 530,
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 16px 48px rgba(15,26,51,0.12)",
          border: "1px solid #e8edf5",
          background: "white",
          display: "flex",
          height: 340,
          opacity: active ? 1 : 0,
          transform: active ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Left sidebar */}
        <div style={{ width: 46, background: "white", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 2, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${S4}/Fav%20icon.svg`} alt="EHSWatch" style={{ width: 22, height: "auto", objectFit: "contain", marginBottom: 8 }} />
          <div style={{ width: 26, height: 1, background: "#f1f5f9", marginBottom: 6 }} />
          {leftNav.map((nav, i) => (
            <div key={i} style={{ width: 34, height: 30, borderRadius: 7, background: nav.active ? "#eff4ff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${S4}/${nav.file}`} alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#f8fafc" }}>
          <div style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "8px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>Welcome</span>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ fontSize: 7.5, color: "#94a3b8" }}>▼ Filter dashboard</span>
              <span style={{ fontSize: 7.5, color: "#94a3b8" }}>⊞ Edit Dashboard</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${S4}/Settings.svg`} alt="Settings" style={{ width: 14, height: 14, objectFit: "contain" }} />
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#155eef", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 8, color: "white", fontWeight: 800 }}>A</span>
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderBottom: "1px solid #f1f5f9", padding: "6px 14px", display: "flex", gap: 10, flexShrink: 0 }}>
            {[{ label: "Filter by Date", val: "12/06/2025" }, { label: "Filter by Location", val: "Offshore" }].map((f, i) => (
              <div key={i} style={{ flex: 1, border: "1px solid #e8edf5", borderRadius: 6, padding: "4px 9px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 7, color: "#94a3b8", margin: 0, fontWeight: 500 }}>{f.label}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#0f172a", margin: 0 }}>{f.val}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${S4}/ang.svg`} alt="" style={{ width: 10, height: 10, objectFit: "contain" }} />
              </div>
            ))}
          </div>

          <div style={{ flex: 1, padding: "9px 14px", display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flexShrink: 0 }}>
              {kpis.map((k, i) => (
                <div key={i} style={{
                  background: "white", borderRadius: 8, padding: "9px 13px",
                  border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex", alignItems: "center", gap: 10,
                  opacity: active ? 1 : 0, transition: `opacity 0.35s ease ${0.1 + i * 0.07}s`,
                }}>
                  <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${S4}/${kpiIcons[i]}`} alt={k.label} style={{ width: 28, height: 28, objectFit: "contain" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 7, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 2px" }}>{k.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#155eef", margin: 0, lineHeight: 1 }}>{k.fmt(k.val)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, flex: 1, overflow: "hidden", minHeight: 0 }}>
              <div style={{ flex: 1, background: "white", borderRadius: 8, padding: "10px 12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.38s" }}>
                <p style={{ fontSize: 7.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>Incidents by Severity</p>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minHeight: 0 }}>
                  <svg width="72" height="72" viewBox="0 0 72 72" style={{ flexShrink: 0 }}>
                    <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10"/>
                    {donutSegs.map((seg, i) => (
                      <circle
                        key={i}
                        cx="36" cy="36" r={r}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="10"
                        transform="rotate(-90 36 36)"
                        style={{
                          strokeDasharray: `${active ? segLens[i] : 0} ${circ}`,
                          strokeDashoffset: segOffsets[i],
                          transition: `stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1) ${0.4 + i * 0.12}s`,
                        }}
                      />
                    ))}
                  </svg>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {donutSegs.map((seg, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: seg.color, flexShrink: 0 }}/>
                        <span style={{ fontSize: 8.5, color: "#64748b" }}>{seg.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flex: 1.3, background: "white", borderRadius: 8, padding: "10px 12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", opacity: active ? 1 : 0, transition: "opacity 0.4s ease 0.44s" }}>
                <p style={{ fontSize: 7.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" }}>Actions by Status</p>
                <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 16, paddingRight: 4 }}>
                    {[20,15,10,5].map(n => <span key={n} style={{ fontSize: 6.5, color: "#94a3b8" }}>{n}</span>)}
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, paddingBottom: 0 }}>
                    {bars.map((bar, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                        <div style={{
                          width: "65%",
                          height: active ? `${bar.pct}%` : "0%",
                          background: bar.color,
                          borderRadius: "3px 3px 0 0",
                          transition: `height 0.7s cubic-bezier(0.4,0,0.2,1) ${0.5 + i * 0.1}s`,
                        }}/>
                        <span style={{ fontSize: 6.5, color: "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 7, marginTop: 4, flexWrap: "wrap" }}>
                  {bars.map(bar => (
                    <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: bar.color }}/>
                      <span style={{ fontSize: 6.5, color: "#64748b" }}>{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: 34, background: "white", borderLeft: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: 10, flexShrink: 0 }}>
          {rightNav.map(file => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={file} src={`${S4}/${file}`} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
          ))}
          <div style={{ flex: 1 }}/>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${S4}/Dark%20mode.svg`} alt="" style={{ width: 16, height: 16, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   STEP 5 — Use insights to improve safety
   ══════════════════════════════════════════════════════════════════ */
const DEFAULT_INSIGHT_STEPS = [
  {
    img: `${S5}/Right/Step/Surface%20Patterns.svg`,
    title: "Surface Patterns",
    desc:  "Analyse reports to identify what issues occur most frequently",
  },
  {
    img: `${S5}/Right/Step/Flag%20Preventive%20Actions-1.svg`,
    title: "Identify Root Causes",
    desc:  "Dig deeper into data to uncover the real underlying causes",
  },
  {
    img: `${S5}/Right/Step/Flag%20Preventive%20Actions.svg`,
    title: "Flag Preventive Actions",
    desc:  "Recommend targeted actions before incidents recur",
  },
  {
    img: `${S5}/Right/Step/Safer%20Workplaces.svg`,
    title: "Safer Workplaces",
    desc:  "Continuous improvement compounds with every report submitted",
  },
];

function Visual5({
  active,
  subItems,
}: {
  active: boolean;
  subItems?: Array<{ icon?: string; title?: string; description?: string }>;
}) {
  // Use CMS sub_items if provided, otherwise fall back to defaults
  const insightSteps =
    subItems && subItems.length > 0
      ? subItems.map((si, i) => ({
          img: DEFAULT_INSIGHT_STEPS[i]?.img ?? `${S5}/Right/Step/Surface%20Patterns.svg`,
          icon: si.icon || undefined,
          title: si.title || DEFAULT_INSIGHT_STEPS[i]?.title || "",
          desc: si.description || DEFAULT_INSIGHT_STEPS[i]?.desc || "",
        }))
      : DEFAULT_INSIGHT_STEPS;

  return (
    <div className="w-full h-full flex items-center justify-center px-2 overflow-hidden">
      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column" }}>
        {insightSteps.map((step, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 14px rgba(15,26,51,0.07)",
                display: "flex",
                alignItems: "center",
                gap: 15,
                padding: "14px 18px",
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(22px)",
                transition: `opacity 0.5s cubic-bezier(0.34,1.1,0.64,1) ${0.08 + i * 0.12}s, transform 0.5s cubic-bezier(0.34,1.1,0.64,1) ${0.08 + i * 0.12}s`,
              }}
            >
              <div style={{ width: 54, height: 54, borderRadius: 14, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {(step as { icon?: string }).icon ? (
                  <CmsIcon icon={(step as { icon?: string }).icon} size={28} strokeWidth={1.6} color="#155eef" fallback="sparkles" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={step.img} alt={step.title} style={{ width: 32, height: 32, objectFit: "contain" }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#155eef" }}>0{i + 1}</span>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>{step.title}</p>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.55 }}>{step.desc}</p>
              </div>
            </div>

            {i < insightSteps.length - 1 && (
              <div style={{ paddingLeft: 44, height: 20, display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 2, borderRadius: 2,
                    height: active ? 20 : 0,
                    background: "repeating-linear-gradient(to bottom, #93c5fd 0, #93c5fd 4px, transparent 4px, transparent 9px)",
                    backgroundSize: "2px 18px",
                    opacity: active ? 0.8 : 0,
                    transition: `height 0.4s ease ${0.3 + i * 0.2}s, opacity 0.3s ease ${0.3 + i * 0.2}s`,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── Visual registry ──────────────────────────────────────────────── */
const STATIC_VISUALS = [Visual1, Visual2, Visual3, Visual4];

/* ── Geometry ────────────────────────────────────────────────────── */
const CIRCLE = 28;
const GAP    = 36;

/* ══════════════════════════════════════════════════════════════════
   Props interface
   ══════════════════════════════════════════════════════════════════ */
interface ProductHowItWorksProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsSteps?: CmsStep[];
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════════ */
export default function ProductHowItWorks({
  cmsHeading,
  cmsSubheading,
  cmsSteps,
}: ProductHowItWorksProps = {}) {
  const [activeStep,  setActiveStep]  = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Build steps from CMS or use defaults
  const steps = cmsSteps && cmsSteps.length > 0
    ? cmsSteps.map((s, i) => ({
        n: i + 1,
        title: s.title || DEFAULT_STEPS[i]?.title || `Step ${i + 1}`,
        body: s.description || DEFAULT_STEPS[i]?.body || "",
        sub_items: s.sub_items,
      }))
    : DEFAULT_STEPS.map(s => ({ ...s, sub_items: undefined }));

  const TRACK = (steps.length - 1) * (CIRCLE + GAP);

  // CMS-only heading/subheading — no hardcoded fallback copy.
  const rawHeading = cmsHeading?.trim() || "";
  const headingSpanMatch = rawHeading.match(/<span>([\s\S]*?)<\/span>/);
  const headingSpanText = headingSpanMatch ? headingSpanMatch[1] : "";
  const headingPlain = rawHeading.replace(/<[^>]+>/g, "");
  const headingSpanIdx = headingSpanText ? headingPlain.indexOf(headingSpanText) : -1;
  const headingBefore = headingSpanIdx >= 0 ? headingPlain.slice(0, headingSpanIdx) : headingPlain;
  const headingAfter = headingSpanIdx >= 0 ? headingPlain.slice(headingSpanIdx + headingSpanText.length) : "";

  const subheading = cmsSubheading?.trim() || "";

  /* Scroll-driven step detection */
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect       = sectionRef.current.getBoundingClientRect();
      const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled  = -rect.top;
      const progress  = Math.max(0, Math.min(0.9999, scrolled / scrollable));
      const step      = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      setActiveStep(step);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [steps.length]);

  const fillH = activeStep === 0 ? 0 : (activeStep / (steps.length - 1)) * TRACK;

  return (
    <>
    {/* Mobile: simple stacked steps — the scroll-pinned version below hides its
        stepper and visuals under md, which left 7 near-empty screens of scroll */}
    <section className="md:hidden bg-[#f1f7ff] px-6 py-14">
      {(headingPlain || subheading) && (
      <div className="text-center mb-10">
        {headingPlain && (
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] leading-tight text-[#1b1b1b] tracking-[-0.025em]">
            {headingBefore}
            {headingSpanText && <span className="text-[#155eef]">{headingSpanText}</span>}
            {headingAfter}
          </h2>
        )}
        {subheading && (
          <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#4b5563] leading-[1.7] mx-auto max-w-[700px]">
            {subheading}
          </p>
        )}
      </div>
      )}
      <div className="flex flex-col max-w-[480px] mx-auto">
        {steps.map((step, i) => (
          <div key={i} className="relative pl-12 pb-10 last:pb-0">
            {i < steps.length - 1 && (
              <div className="absolute left-[13px] top-[30px] bottom-0 w-[2px] rounded-full bg-[#dde8f8]" />
            )}
            <div className="absolute left-0 top-0 z-10 flex items-center justify-center rounded-full w-7 h-7 text-[11px] font-bold bg-[#155eef] text-white">
              {step.n}
            </div>
            <span className="font-[family-name:var(--font-dm-sans)] font-bold text-[11px] text-[#155eef] tracking-[1.6px] uppercase">
              Step {step.n}
            </span>
            <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] leading-snug mt-2 mb-2 text-[#0a0f1e]">
              {step.title}
            </h3>
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.82] text-[#4b5563]">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section
      ref={sectionRef}
      className="hidden md:block bg-[#f1f7ff]"
      /* Per-step scroll distance: (55 - 100/steps)vh ≈ 30vh (~1.5–2 wheel
         notches) for a 4-step section — was 100 (~75vh, ~4 scrolls per step). */
      style={{ height: `${steps.length * 55}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 overflow-hidden flex flex-col" style={{ height: "100vh" }}>

        {/* Heading */}
        {(headingPlain || subheading) && (
        <div className="flex-none text-center px-6 pt-[11vh] pb-[1vh]">
          {headingPlain && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-tight text-[#1b1b1b] tracking-[-0.025em]">
              {headingBefore}
              {headingSpanText && <span className="text-[#155eef]">{headingSpanText}</span>}
              {headingAfter}
            </h2>
          )}
          {subheading && (
            <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[14px] md:text-[16px] text-[#4b5563] leading-[1.7] mx-auto max-w-[700px]">
              {subheading}
            </p>
          )}
        </div>
        )}

        {/* Main row */}
        <div className="flex-1 flex items-center gap-8 md:gap-12 max-w-[1200px] mx-auto w-full px-6 md:px-10 pt-[1vh] pb-[5vh]">

          {/* Vertical stepper */}
          <div
            className="hidden md:flex flex-col items-center relative shrink-0"
            style={{ gap: `${GAP}px` }}
          >
            <div className="absolute w-[2px] rounded-full bg-[#dde8f8]" style={{ top: CIRCLE / 2, height: TRACK }} />
            <div
              className="absolute w-[2px] rounded-full bg-[#155eef] transition-[height] duration-500 ease-out"
              style={{ top: CIRCLE / 2, height: `${fillH}px` }}
            />
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative z-10 flex items-center justify-center rounded-full text-[11px] font-bold"
                style={{
                  width: CIRCLE, height: CIRCLE,
                  background:   i <= activeStep ? "#155eef" : "white",
                  border:       `2px solid ${i <= activeStep ? "#155eef" : "#dde8f8"}`,
                  boxShadow:    i === activeStep ? "0 0 0 5px rgba(21,94,239,0.14)" : "none",
                  transition:   "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                }}
              >
                {i < activeStep ? (
                  <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5l3 3 6-6" stroke="white" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span style={{ color: i === activeStep ? "white" : "#94a3b8" }}>{step.n}</span>
                )}
              </div>
            ))}
          </div>

          {/* Step text — driven directly by activeStep so it can never desync
              from the stepper (the old timer-based displayStep could get stuck
              at "Step 1" during fast scrolling). key={activeStep} re-triggers a
              short CSS fade-in on each change. */}
          <div
            key={activeStep}
            className="flex-1 md:flex-none md:flex-[0_0_260px] lg:flex-[0_0_330px] md:shrink-0 flex flex-col justify-center min-w-0"
            style={{ animation: "howStepFade 0.32s ease both" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="font-[family-name:var(--font-dm-sans)] font-bold text-[11px] text-[#155eef] tracking-[1.6px] uppercase">
                Step {steps[activeStep].n}
              </span>
              <span className="inline-block w-7 h-[1.5px] bg-[#155eef] opacity-35 rounded-full" />
            </div>
            <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] md:text-[26px] leading-snug mb-4 text-[#0a0f1e]">
              {steps[activeStep].title}
            </h3>
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] md:text-[15px] leading-[1.82] text-[#4b5563]">
              {steps[activeStep].body}
            </p>
          </div>

          {/* Animated visual panel */}
          <div className="hidden md:block flex-1 min-w-0 overflow-hidden" style={{ height: "62vh" }}>
            <div className="w-full h-full relative overflow-hidden">
              {steps.map((step, i) => {
                const isLast = i === steps.length - 1;
                return (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      opacity:       i === activeStep ? 1 : 0,
                      transform:     i === activeStep ? "translateY(0) scale(1)" : "translateY(12px) scale(0.98)",
                      transition:    "opacity 0.45s ease, transform 0.45s ease",
                      pointerEvents: i === activeStep ? "auto" : "none",
                    }}
                  >
                    {isLast ? (
                      <Visual5 active={i === activeStep} subItems={step.sub_items} />
                    ) : (
                      (() => {
                        const V = STATIC_VISUALS[i] || STATIC_VISUALS[STATIC_VISUALS.length - 1];
                        return <V active={i === activeStep} />;
                      })()
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
