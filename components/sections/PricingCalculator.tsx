"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ── Proposal form schema ── */
const proposalSchema = z.object({
  name:    z.string().min(2, "Full name must be at least 2 characters"),
  email:   z.string().email("Enter a valid work email"),
  phone:   z.string().min(7, "Enter a valid phone number"),
  company: z.string().min(1, "Company name is required"),
});

type ProposalData = z.infer<typeof proposalSchema>;

type ProposalField = { label: string; key: keyof ProposalData; type: string; placeholder: string };
const PROPOSAL_FIELDS: ProposalField[] = [
  { label: "Full Name",    key: "name",    type: "text",  placeholder: "Jane Smith" },
  { label: "Work Email",   key: "email",   type: "email", placeholder: "jane@company.com" },
  { label: "Phone Number", key: "phone",   type: "tel",   placeholder: "+1 000 000 0000" },
  { label: "Company",      key: "company", type: "text",  placeholder: "Your organisation name" },
];

// ── App data ──────────────────────────────────────────────────────────────────

const APPS = [
  { id: "action",         name: "Action Tracker",             desc: "Track corrective actions to closure with accountability.",  color: "#155eef", icon: "check-circle" },
  { id: "eightd",         name: "8D Report",                  desc: "Structured 8-discipline problem-solving reports.",          color: "#6366f1", icon: "clipboard" },
  { id: "audit",          name: "Audit Management",           desc: "Plan audits, capture findings, close compliance gaps.",     color: "#6366f1", icon: "clipboard" },
  { id: "communications", name: "Communications",             desc: "Share safety alerts, updates and bulletins org-wide.",      color: "#0891b2", icon: "chat-warning" },
  { id: "complaints",     name: "Customer Complaint Details", desc: "Structured complaints workflow with full audit trail.",     color: "#0891b2", icon: "chat-warning" },
  { id: "emergency",      name: "Emergency Response Drills",  desc: "Schedule drills and capture lessons learned.",              color: "#ef4444", icon: "alarm" },
  { id: "files",          name: "File Management",            desc: "Version-controlled EHSQ documents with access control.",    color: "#059669", icon: "folder" },
  { id: "hsestats",       name: "HSE Monthly Statistics",     desc: "Aggregate and report monthly HSE performance data.",        color: "#155eef", icon: "chart" },
  { id: "hseplans",       name: "HSE Plans",                  desc: "Build and track health & safety plans across sites.",       color: "#7c3aed", icon: "book" },
  { id: "observations",   name: "HSE Observations",           desc: "Capture unsafe acts and positive safety behaviours.",       color: "#f59e0b", icon: "eye" },
  { id: "inspections",    name: "Inspections",                desc: "Conduct digital inspections with custom checklists.",       color: "#155eef", icon: "search" },
  { id: "incident",       name: "Incident Management",        desc: "Report, investigate and close incidents end-to-end.",       color: "#ef4444", icon: "warning" },
  { id: "legal",          name: "Legal Register",             desc: "Track regulatory obligations and stay audit-ready.",        color: "#7c3aed", icon: "book" },
  { id: "moc",            name: "Management of Change",       desc: "Control operational changes with structured approvals.",    color: "#0891b2", icon: "arrows-cycle" },
  { id: "meetings",       name: "Meetings Management",        desc: "Capture decisions and track action follow-through.",        color: "#059669", icon: "calendar" },
  { id: "mutualaid",      name: "Mutual Aid",                 desc: "Coordinate shared resources and emergency assistance.",     color: "#ef4444", icon: "heart" },
  { id: "nonconformance", name: "Non Conformance",            desc: "Record, investigate and prevent recurring issues.",         color: "#f97316", icon: "x-circle" },
  { id: "permit",         name: "Permit to Work",             desc: "Digitise high-risk work permits with approval workflows.",  color: "#155eef", icon: "lock" },
  { id: "risk",           name: "Risk Assessments",           desc: "Identify hazards, assess risk and document controls.",      color: "#6366f1", icon: "shield" },
  { id: "survey",         name: "Survey",                     desc: "Create and distribute safety culture surveys.",             color: "#f59e0b", icon: "clipboard" },
  { id: "training",       name: "Training Management",        desc: "Manage training records and certification expiries.",       color: "#f59e0b", icon: "graduation" },
];

const ADDONS = [
  { id: "iris",     name: "IRIS AI",                desc: "AI incident analysis & smart insights",    color: "#6366f1" },
  { id: "whatsapp", name: "WhatsApp Reporting",     desc: "Report incidents directly from WhatsApp",  color: "#25d366" },
  { id: "api",      name: "API Integrations",       desc: "Connect with existing systems",            color: "#0891b2" },
  { id: "bi",       name: "3rd Party BI Connector", desc: "Power BI / Tableau connectivity",          color: "#f59e0b" },
  { id: "hr",       name: "HR Integration",         desc: "Sync users from your HRMS",               color: "#7c3aed" },
  { id: "sso",      name: "Single Sign On (SSO)",   desc: "Azure / Google / Active Directory login",  color: "#155eef" },
];

const INDUSTRIES = [
  "Construction", "Oil & Gas", "Manufacturing", "Mining", "Utilities",
  "Chemical & Pharma", "Food & Beverage", "Transportation & Logistics",
  "Healthcare", "Facilities Management", "Retail", "Other",
];

const STEPS = ["Applications", "Add-Ons", "Organisation", "Get Proposal"];

// ── Icon SVGs (inline) ────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AppIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  const s = size;
  const icons: Record<string, React.ReactNode> = {
    "warning":      <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 3L18 17H2L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 9v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14.5" r="0.8" fill="currentColor"/></svg>,
    "check-circle": <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    "clipboard":    <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="4" y="4" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4V3.5A1.5 1.5 0 0 1 8.5 2h3A1.5 1.5 0 0 1 13 3.5V4" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9h6M7 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "shield":       <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 2l7 3v5c0 4-3 7.5-7 9-4-1.5-7-5-7-9V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    "lock":         <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="14" r="1.2" fill="currentColor"/></svg>,
    "eye":          <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
    "search":       <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "graduation":   <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 3l9 4-9 4-9-4 9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M5 11v4c0 1.7 2.2 3 5 3s5-1.3 5-3v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M19 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "book":         <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M4 3h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7h5M7 10h5M7 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "arrows-cycle": <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M4 10a6 6 0 0 1 10.9-3.4L16 5v4h-4l1.8-1.8A4 4 0 0 0 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 10a6 6 0 0 1-10.9 3.4L4 15v-4h4L6.2 12.8A4 4 0 0 0 14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    "alarm":        <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 4a6 6 0 1 0 0 12A6 6 0 0 0 10 4z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 7v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.5 4.5L5 3M16.5 4.5L15 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "x-circle":     <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "chat-warning": <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6l-3 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 7v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="12" r="0.8" fill="currentColor"/></svg>,
    "calendar":     <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="13" r="1" fill="currentColor"/><circle cx="10" cy="13" r="1" fill="currentColor"/><circle cx="13" cy="13" r="1" fill="currentColor"/></svg>,
    "folder":       <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M2 6a2 2 0 0 1 2-2h3.17a2 2 0 0 1 1.42.59L9.41 5.4A2 2 0 0 0 10.83 6H16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" stroke="currentColor" strokeWidth="1.5"/></svg>,
    "flask":        <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M7 3h6M8 3v6l-4 8h12l-4-8V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "hard-hat":     <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M4 12V9a6 6 0 0 1 12 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 12h16v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "leaf":         <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M17 3C9 3 4 8 4 14c0 0 4-2 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17c2-4 4-8 8-11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    "heart":        <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M10 16s-7-4.5-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 17 7c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    "chart":        <svg width={s} height={s} viewBox="0 0 20 20" fill="none"><path d="M3 15V9M7 15V6M11 15V11M15 15V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  };
  return <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{icons[icon] ?? null}</span>;
}

function AddonIcon({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    iris:     <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l1.5 6L18 10l-6.5 2L10 18l-1.5-6L2 10l6.5-2L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    whatsapp: (
      <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
        <path d="M26.6 21.442l-3-2.171a2.23 2.23 0 0 0-2.706.078l-1.427 1.159a8.372 8.372 0 0 1-3.985-3.985l1.108-1.362a2.235 2.235 0 0 0 .1-2.678l-2.139-3.053a2.166 2.166 0 0 0-3.467-.112l-1.663 2.082a4.13 4.13 0 0 0-.907 2.993 14.585 14.585 0 0 0 13.086 13.083c.131.013.262.019.393.019a4.15 4.15 0 0 0 2.6-.924l2.1-1.684a2.162 2.162 0 0 0-.09-3.445zm-1.16 1.884l-2.1 1.683a2.164 2.164 0 0 1-1.549.477 12.582 12.582 0 0 1-11.291-11.286 2.178 2.178 0 0 1 .478-1.551l1.664-2.08a.16.16 0 0 1 .128-.062h.007a.161.161 0 0 1 .131.071l2.134 3.053a.222.222 0 0 1-.01.27l-1.489 1.832a1 1 0 0 0-.155.995 10.376 10.376 0 0 0 5.875 5.872 1 1 0 0 0 .995-.156l1.9-1.541a.228.228 0 0 1 .275-.008l3.006 2.171a.165.165 0 0 1 .071.132.156.156 0 0 1-.066.128z" fill="currentColor"/>
        <path d="M18 1a16.975 16.975 0 0 0-14.7 25.5l-2.25 7.2a1 1 0 0 0 .95 1.3 1.016 1.016 0 0 0 .3-.045l7.2-2.255a16.993 16.993 0 1 0 8.5-31.7zm0 32a14.959 14.959 0 0 1-7.848-2.235 1 1 0 0 0-.524-.149.976.976 0 0 0-.3.046l-5.805 1.814 1.815-5.806a1 1 0 0 0-.1-.823 14.988 14.988 0 1 1 12.762 7.153z" fill="currentColor"/>
      </svg>
    ),
    api:      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="6" width="7" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="6" width="7" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    bi:       <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 15V9M7 15V6M11 15V11M15 15V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    hr:       <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    sso:      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="8" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10" cy="13" r="1.2" fill="currentColor"/></svg>,
  };
  return <span style={{ color: "currentColor" }}>{icons[id]}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PricingCalculator() {
  const [step, setStep] = useState(0);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [org, setOrg] = useState({ employees: "", sites: "", industry: "" });
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProposalData>({ resolver: zodResolver(proposalSchema) });

  const toggleApp = (id: string) =>
    setSelectedApps((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const toggleAddon = (id: string) =>
    setSelectedAddons((prev) => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const canNext = () => {
    if (step === 0) return selectedApps.size > 0;
    if (step === 2) return org.employees && org.sites && org.industry;
    return true;
  };

  const onSubmit = (_data: ProposalData) => setSubmitted(true);

  return (
    <section id="calculator" className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
      <style>{`
        .calc-card-sel {
          border-color: #1d4ed8 !important;
          background: #eff6ff !important;
        }
        .calc-card:hover:not(.calc-card-sel) {
          border-color: #93c5fd !important;
          box-shadow: 0 4px 16px rgba(59,130,246,0.10) !important;
        }
        .addon-card-sel {
          border-color: #1d4ed8 !important;
          background: #eff6ff !important;
        }
        .addon-card:hover:not(.addon-card-sel) {
          border-color: #93c5fd !important;
        }
        .calc-input:focus {
          outline: none;
          border-color: #1d4ed8 !important;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.10);
        }
        .calc-desc {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.28s ease, opacity 0.22s ease;
        }
        .calc-card:hover .calc-desc,
        .calc-card-sel .calc-desc {
          max-height: 60px;
          opacity: 1;
        }
      `}</style>

      <div className="max-w-[1160px] mx-auto">
        {/* Section heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
            Build Your <span style={{ color: "#1d4ed8" }}>EHSWatch</span> Package
          </h2>
          <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] mt-3 max-w-[460px] mx-auto text-pretty">
            Select what you need and we&apos;ll put together a tailored proposal.
          </p>
        </div>

        {/* Step indicator */}
        <div className="w-full max-w-[640px] mx-auto mb-10 md:mb-14">
          <div className="flex items-center">
            {STEPS.map((label, i) => {
              const done   = i < step;
              const active = i === step;
              return (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  {/* Step node */}
                  <div className="flex flex-col items-center gap-1 relative">
                    {/* Circle */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-[family-name:var(--font-dm-sans)] font-bold text-[14px] border-2 transition-all duration-300 shrink-0"
                      style={{
                        borderColor: done ? "#1d4ed8" : active ? "#1d4ed8" : "#d1d5db",
                        background:  done ? "#1d4ed8" : active ? "#1d4ed8" : "white",
                        color:       done || active ? "white" : "#9ca3af",
                      }}
                    >
                      {done ? (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    {/* Label */}
                    <span
                      className="font-[family-name:var(--font-dm-sans)] text-[11px] sm:text-[12px] font-medium mt-1 whitespace-nowrap transition-colors duration-300"
                      style={{
                        color: active ? "#0a0f1e" : done ? "#1d4ed8" : "#9ca3af",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Connector line between circles */}
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-[2px] mx-1 relative" style={{ background: "#e5e7eb", marginBottom: "20px" }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{
                          width: i < step ? "100%" : "0%",
                          background: "#1d4ed8",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main layout: content + sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Content area ── */}
          <div className="flex-1 min-w-0">

            {/* STEP 0 — Applications */}
            {step === 0 && (
              <div>
                <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[22px] text-[#0a0f1e] mb-2">
                  Step 1 — Application Selection
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  Select the applications you need in your organisation
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {APPS.map((app) => {
                    const sel = selectedApps.has(app.id);
                    return (
                      <button
                        key={app.id}
                        onClick={() => toggleApp(app.id)}
                        className={`calc-card text-left rounded-xl p-4 border transition-all duration-200 flex flex-col gap-2.5 ${sel ? "calc-card-sel" : ""}`}
                        style={{
                          borderColor: sel ? "#1d4ed8" : "#e5e7eb",
                          background: sel ? "#eff6ff" : "white",
                          cursor: "pointer",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: app.color + "14", color: app.color }}
                          >
                            <AppIcon icon={app.icon} size={16} />
                          </div>
                          {/* Square checkbox */}
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all duration-200"
                            style={{
                              borderColor: sel ? "#1d4ed8" : "#d1d5db",
                              background: sel ? "#1d4ed8" : "white",
                            }}
                          >
                            {sel && (
                              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                <path d="M1.5 4.5l2 2 4-3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#0a0f1e] leading-snug">
                            {app.name}
                          </p>
                          <p className="calc-desc font-[family-name:var(--font-dm-sans)] text-[11px] text-[#6b7280] leading-[1.5] mt-1 text-pretty">
                            {app.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 1 — Add-Ons */}
            {step === 1 && (
              <div>
                <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[22px] text-[#0a0f1e] mb-2">
                  Step 2 — Advanced Features
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  Enhance your EHSWatch experience <span className="text-[#9ca3af]">(optional)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {ADDONS.map((addon) => {
                    const sel = selectedAddons.has(addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`addon-card text-left rounded-xl p-5 border transition-all duration-200 flex flex-col gap-3 ${sel ? "addon-card-sel" : ""}`}
                        style={{
                          borderColor: sel ? "#1d4ed8" : "#e5e7eb",
                          background: sel ? "#eff6ff" : "white",
                          cursor: "pointer",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: addon.color + "14", color: addon.color }}
                          >
                            <AddonIcon id={addon.id} />
                          </div>
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all duration-200"
                            style={{
                              borderColor: sel ? "#1d4ed8" : "#d1d5db",
                              background: sel ? "#1d4ed8" : "white",
                            }}
                          >
                            {sel && (
                              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                <path d="M1.5 4.5l2 2 4-3.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug">
                            {addon.name}
                          </p>
                          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] mt-1 text-pretty">
                            {addon.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2 — Organisation */}
            {step === 2 && (
              <div className="max-w-[560px]">
                <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[22px] text-[#0a0f1e] mb-2">
                  Step 3 — Organisation Details
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  Tell us about your organisation
                </p>
                <div className="flex flex-col gap-5">
                  {[
                    {
                      label: "Number of Employees",
                      key: "employees",
                      options: ["0–100", "100–500", "500–2,000", "2,000+"],
                    },
                    {
                      label: "Number of Sites",
                      key: "sites",
                      options: ["1", "2–5", "6–15", "16+"],
                    },
                    {
                      label: "Industry",
                      key: "industry",
                      options: INDUSTRIES,
                    },
                  ].map(({ label, key, options }) => (
                    <div key={key} className="flex flex-col gap-2">
                      <label className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#374151]">
                        {label}
                      </label>
                      <select
                        className="calc-input w-full rounded-xl border px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0a0f1e] appearance-none bg-white transition-all duration-200"
                        style={{ borderColor: "#e5e7eb" }}
                        value={org[key as keyof typeof org]}
                        onChange={(e) => setOrg((prev) => ({ ...prev, [key]: e.target.value }))}
                      >
                        <option value="">Select {label}</option>
                        {options.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 — Submit */}
            {step === 3 && !submitted && (
              <div className="max-w-[560px]">
                <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[22px] text-[#0a0f1e] mb-2">
                  Step 4 — Get Your Proposal
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  We&apos;ll send you a detailed proposal based on your selections
                </p>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                  {PROPOSAL_FIELDS.map(({ label, key, type, placeholder }) => (
                    <div key={key} className="flex flex-col gap-2">
                      <label className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#374151]">
                        {label} <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        className="calc-input w-full rounded-xl border px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0a0f1e] placeholder:text-[#9ca3af] transition-all duration-200"
                        style={{ borderColor: errors[key] ? "#f87171" : "#e5e7eb" }}
                        {...register(key)}
                      />
                      {errors[key] && (
                        <p className="text-[12px] text-red-500 font-[family-name:var(--font-dm-sans)]">
                          {errors[key]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full py-[13px] rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[15px] text-white transition-all duration-300"
                    style={{
                      backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                      boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Get My EHSWatch Proposal →"}
                  </button>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#9ca3af] text-center text-pretty">
                    No commitment required. We&apos;ll follow up within 1 business day.
                  </p>
                </form>
              </div>
            )}

            {/* Success state */}
            {step === 3 && submitted && (
              <div className="max-w-[560px] text-center py-12 flex flex-col items-center gap-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "#ecfdf5" }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6 6 12-12" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[24px] text-[#0a0f1e] mb-2">
                    Proposal Request Sent!
                  </h3>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] leading-[1.75] text-pretty">
                    Thanks {getValues("name").split(" ")[0]}! Our team will review your selections and send a tailored proposal to <strong>{getValues("email")}</strong> within 1 business day.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {!(step === 3 && submitted) && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#f0f0f0]">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-gray-50"
                  style={{ borderColor: "#e5e7eb", color: "#374151" }}
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>

                {step < 3 && (
                  <button
                    onClick={() => setStep((s) => Math.min(3, s + 1))}
                    disabled={!canNext()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:opacity-90"
                    style={{
                      backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                    }}
                  >
                    {step === 1 ? "Continue" : step === 2 ? "Continue to Proposal" : "Continue"}
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Sticky sidebar summary ── */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <div
              className="sticky top-[100px] rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "#F8FBFF", border: "1px solid #dbeafe" }}
            >
              {/* Package header */}
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-gothic-a1)] font-bold text-[15px] text-[#0a0f1e]">Your Package</span>
                {selectedApps.size > 0 && (
                  <span
                    className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "#1d4ed8", color: "white" }}
                  >
                    {selectedApps.size} app{selectedApps.size !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Selected apps list */}
              {selectedApps.size === 0 ? (
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af] text-center py-4">
                  No applications selected yet
                </p>
              ) : (
                <ul className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {APPS.filter((a) => selectedApps.has(a.id)).map((a) => (
                    <li key={a.id} className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: a.color + "18", color: a.color }}
                      >
                        <AppIcon icon={a.icon} size={13} />
                      </div>
                      <span className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151]">{a.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add-ons */}
              {selectedAddons.size > 0 && (
                <>
                  <div className="border-t border-[#dbeafe]" />
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-2">Add-Ons</p>
                    <ul className="flex flex-col gap-2">
                      {ADDONS.filter((a) => selectedAddons.has(a.id)).map((a) => (
                        <li key={a.id} className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: a.color + "18", color: a.color }}
                          >
                            <AddonIcon id={a.id} />
                          </div>
                          <span className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151]">{a.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Org details */}
              {(org.employees || org.sites || org.industry) && (
                <>
                  <div className="border-t border-[#dbeafe]" />
                  <div className="flex flex-col gap-2">
                    <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-1">Organisation</p>
                    {org.employees && <p className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151]">Employees: {org.employees}</p>}
                    {org.sites && <p className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151]">Sites: {org.sites}</p>}
                    {org.industry && <p className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151]">Industry: {org.industry}</p>}
                  </div>
                </>
              )}

              <div className="border-t border-[#dbeafe]" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#6b7280] leading-[1.65] text-pretty">
                Complete all steps to receive a tailored proposal from our team.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
