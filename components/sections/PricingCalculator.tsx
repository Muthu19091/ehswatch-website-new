"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TurnstileField from "@/components/ui/TurnstileField";
import { z } from "zod";
import * as LucideIcons from "lucide-react";

/* ── Proposal form schema ── */
const proposalSchema = z.object({
  name:       z.string().min(2, "Full name must be at least 2 characters"),
  email:      z.string().email("Enter a valid work email"),
  phone:      z.string().min(7, "Enter a valid phone number"),
  company:    z.string().min(1, "Company name is required"),
  messagebox: z.string().optional(),
});

type ProposalData = z.infer<typeof proposalSchema>;

type ProposalField = { label: string; key: keyof ProposalData; type: string; placeholder: string };
const PROPOSAL_FIELDS: ProposalField[] = [
  { label: "Full Name",          key: "name",       type: "text",     placeholder: "Jane Smith" },
  { label: "Work Email",         key: "email",      type: "email",    placeholder: "jane@company.com" },
  { label: "Phone Number",       key: "phone",      type: "tel",      placeholder: "+1 000 000 0000" },
  { label: "Company",            key: "company",    type: "text",     placeholder: "Your organisation name" },
  { label: "Message (optional)", key: "messagebox", type: "textarea", placeholder: "Anything specific you'd like us to know?" },
];

// ── App data ──────────────────────────────────────────────────────────────────

const APPS = [
  { id: "action",         name: "Action Tracker",             desc: "Track corrective actions to closure with accountability.",  color: "#155eef", icon: "check-circle" },
  { id: "eightd",         name: "8D Report",                  desc: "Structured 8-discipline problem-solving reports.",          color: "#6366f1", icon: "clipboard" },
  { id: "audit",          name: "Audit Management",           desc: "Plan audits, capture findings, close compliance gaps.",     color: "#6366f1", icon: "clipboard-check" },
  { id: "communications", name: "Communications",             desc: "Share safety alerts, updates and bulletins org-wide.",      color: "#0891b2", icon: "message-circle" },
  { id: "complaints",     name: "Customer Complaint Details", desc: "Structured complaints workflow with full audit trail.",     color: "#0891b2", icon: "message-square" },
  { id: "emergency",      name: "Emergency Response Drills",  desc: "Schedule drills and capture lessons learned.",              color: "#ef4444", icon: "alarm-clock" },
  { id: "files",          name: "File Management",            desc: "Version-controlled EHSQ documents with access control.",    color: "#059669", icon: "folder" },
  { id: "hsestats",       name: "HSE Monthly Statistics",     desc: "Aggregate and report monthly HSE performance data.",        color: "#155eef", icon: "bar-chart-2" },
  { id: "hseplans",       name: "HSE Plans",                  desc: "Build and track health & safety plans across sites.",       color: "#7c3aed", icon: "book" },
  { id: "observations",   name: "HSE Observations",           desc: "Capture unsafe acts and positive safety behaviours.",       color: "#f59e0b", icon: "eye" },
  { id: "inspections",    name: "Inspections",                desc: "Conduct digital inspections with custom checklists.",       color: "#155eef", icon: "search" },
  { id: "incident",       name: "Incident Management",        desc: "Report, investigate and close incidents end-to-end.",       color: "#ef4444", icon: "alert-triangle" },
  { id: "legal",          name: "Legal Register",             desc: "Track regulatory obligations and stay audit-ready.",        color: "#7c3aed", icon: "book-open" },
  { id: "moc",            name: "Management of Change",       desc: "Control operational changes with structured approvals.",    color: "#0891b2", icon: "refresh-cw" },
  { id: "meetings",       name: "Meetings Management",        desc: "Capture decisions and track action follow-through.",        color: "#059669", icon: "calendar" },
  { id: "mutualaid",      name: "Mutual Aid",                 desc: "Coordinate shared resources and emergency assistance.",     color: "#ef4444", icon: "heart" },
  { id: "nonconformance", name: "Non Conformance",            desc: "Record, investigate and prevent recurring issues.",         color: "#f97316", icon: "x-circle" },
  { id: "permit",         name: "Permit to Work",             desc: "Digitise high-risk work permits with approval workflows.",  color: "#155eef", icon: "lock" },
  { id: "risk",           name: "Risk Assessments",           desc: "Identify hazards, assess risk and document controls.",      color: "#6366f1", icon: "shield" },
  { id: "survey",         name: "Survey",                     desc: "Create and distribute safety culture surveys.",             color: "#f59e0b", icon: "clipboard-list" },
  { id: "training",       name: "Training Management",        desc: "Manage training records and certification expiries.",       color: "#f59e0b", icon: "graduation-cap" },
];

const ADDONS = [
  { id: "iris",     name: "IRIS AI",                desc: "AI incident analysis & smart insights",    color: "#6366f1", icon: "sparkles" },
  { id: "whatsapp", name: "WhatsApp Reporting",     desc: "Report incidents directly from WhatsApp",  color: "#25d366", icon: "message-circle" },
  { id: "api",      name: "API Integrations",       desc: "Connect with existing systems",            color: "#0891b2", icon: "link" },
  { id: "bi",       name: "3rd Party BI Connector", desc: "Power BI / Tableau connectivity",          color: "#f59e0b", icon: "bar-chart-2" },
  { id: "hr",       name: "HR Integration",         desc: "Sync users from your HRMS",               color: "#7c3aed", icon: "users" },
  { id: "sso",      name: "Single Sign On (SSO)",   desc: "Azure / Google / Active Directory login",  color: "#155eef", icon: "lock" },
];

const INDUSTRIES = [
  "Construction", "Oil & Gas", "Manufacturing", "Mining", "Utilities",
  "Chemical & Pharma", "Food & Beverage", "Transportation & Logistics",
  "Healthcare", "Facilities Management", "Retail", "Other",
];

const STEPS = ["Applications", "Add-Ons", "Organisation", "Get Proposal"];

// ── Dynamic Lucide icon renderer ──────────────────────────────────────────────
// CMS may return Heroicons-style names (Filament's default icon set).
// This map converts them to their Lucide equivalents so rendering never breaks.
const ICON_ALIASES: Record<string, string> = {
  "magnifying-glass":               "search",
  "exclamation-triangle":           "alert-triangle",
  "exclamation-circle":             "alert-circle",
  "arrow-path":                     "refresh-cw",
  "lock-closed":                    "lock",
  "chart-bar":                      "bar-chart-2",
  "calendar-days":                  "calendar",
  "clipboard-document-list":        "clipboard-list",
  "clipboard-document-check":       "clipboard-check",
  "academic-cap":                   "graduation-cap",
  "rocket-launch":                  "rocket",
  "arrow-down-tray":                "arrow-down-to-line",
  "arrow-up-tray":                  "arrow-up-from-line",
  "code-bracket":                   "code-2",
  "code-bracket-square":            "code",
  "user-group":                     "users",
  "chat-bubble-bottom-center-text": "message-circle",
  "chat-bubble-left-right":         "message-square",
  "chat-warning":                   "message-circle",
  "alarm":                          "alarm-clock",
  "arrows-cycle":                   "refresh-cw",
  "chart":                          "bar-chart-2",
  "graduation":                     "graduation-cap",
  "warning":                        "alert-triangle",
  "minus-circle":                   "minus-circle",
  "sparkle":                        "sparkles",
  "document-text":                  "file-text",
  "document-check":                 "file-check",
  "building-office":                "building-2",
  "building-office-2":              "building-2",
  "shield-exclamation":             "shield-alert",
  "information-circle":             "info",
  "question-mark-circle":           "help-circle",
  "hand-raised":                    "hand",
  "globe-alt":                      "globe",
  "sun":                            "sun",
  "moon":                           "moon",
  "fire":                           "flame",
  "beaker":                         "flask-conical",
  "identification":                 "id-card",
  "paper-airplane":                 "send",
  "printer":                        "printer",
  "device-phone-mobile":            "smartphone",
  "computer-desktop":               "monitor",
  "server":                         "server",
  "cpu-chip":                       "cpu",
  "currency-dollar":                "dollar-sign",
  "banknotes":                      "banknote",
  "receipt-percent":                "receipt",
  "arrow-trending-up":              "trending-up",
  "arrow-trending-down":            "trending-down",
  "chart-pie":                      "pie-chart",
  "squares-2x2":                    "grid-2x2",
  "list-bullet":                    "list",
  "bars-3":                         "menu",
  "adjustments-horizontal":         "sliders-horizontal",
  "adjustments-vertical":           "sliders-vertical",
  "funnel":                         "filter",
  "tag":                            "tag",
  "wrench-screwdriver":             "wrench",
  "cog-6-tooth":                    "settings-2",
  "cog-8-tooth":                    "settings",
};

function LucideIcon({ name, size = 18 }: { name?: string; size?: number }) {
  if (!name) return null;
  const resolved = ICON_ALIASES[name] ?? name;
  const pascal = resolved.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[pascal];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={1.5} />;
}

// ── Main component ────────────────────────────────────────────────────────────

interface CmsFormStep {
  key: string;
  title: string;
  description: string;
  fields: Array<{ key: string; label: string; field_type: string; options?: string[] | null }>;
}

interface PricingCalculatorProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsFormSlug?: string;
  cmsFormSteps?: CmsFormStep[];
  cmsStepLabels?: string[];
  cmsApplications?: Array<{ id: string; name: string; description: string; icon?: string; color?: string }>;
  cmsAddons?: Array<{ id: string; name: string; description: string; icon?: string; color?: string }>;
  cmsIndustries?: string[];
  cmsSubmitLabel?: string;
  cmsSuccessHeading?: string;
  cmsSuccessBody?: string;
}

export default function PricingCalculator({
  cmsHeading,
  cmsSubheading,
  cmsFormSlug,
  cmsFormSteps,
  cmsStepLabels,
  cmsApplications,
  cmsAddons,
  cmsIndustries,
  cmsSubmitLabel,
  cmsSuccessHeading,
  cmsSuccessBody,
}: PricingCalculatorProps = {}) {
  const formSlug   = cmsFormSlug || "build-ehswatch-package";
  const heading    = cmsHeading    || "Build Your EHSWatch Package";
  const subheading = cmsSubheading || "Select what you need and we’ll put together a tailored proposal.";

  // Derive step labels from CMS form steps (form schema titles)
  const WIZARD_KEYS = ["applications", "addons", "organisation", "contact"] as const;
  const getStep = (key: string) => cmsFormSteps?.find(s => s.key === key);
  const formStepLabels = cmsFormSteps
    ? WIZARD_KEYS.map(k => getStep(k)?.title).filter(Boolean) as string[]
    : [];
  // pricing_calculator.step_labels takes precedence, then form step titles, then hardcoded
  const steps = (cmsStepLabels && cmsStepLabels.length === 4)
    ? cmsStepLabels
    : formStepLabels.length === 4 ? formStepLabels : STEPS;

  // Per-step title/description from CMS form schema
  const appsStepTitle    = getStep("applications")?.title       || "Step 1 — Application Selection";
  const appsStepDesc     = getStep("applications")?.description || "Select the applications you need in your organisation";
  const addonsStepTitle  = getStep("addons")?.title             || "Step 2 — Advanced Features";
  const addonsStepDesc   = getStep("addons")?.description       || "Enhance your EHSWatch experience";
  const orgStepTitle     = getStep("organisation")?.title       || "Step 3 — Organisation Details";
  const orgStepDesc      = getStep("organisation")?.description || "Tell us about your organisation";
  const contactStepTitle = getStep("contact")?.title            || "Step 4 — Get Your Proposal";
  const contactStepDesc  = getStep("contact")?.description      || "We'll send you a detailed proposal based on your selections";

  // Contact step fields — labels from CMS, structure covers all 5 fields including messagebox
  const cmsContactFields = getStep("contact")?.fields ?? [];
  const getCmsLabel = (key: string, fallback: string) =>
    cmsContactFields.find((f) => f.key === key)?.label || fallback;
  const contactProposalFields: ProposalField[] = [
    { label: getCmsLabel("name",       "Full Name"),          key: "name",       type: "text",     placeholder: "Jane Smith" },
    { label: getCmsLabel("email",      "Work Email"),         key: "email",      type: "email",    placeholder: "jane@company.com" },
    { label: getCmsLabel("phone",      "Phone Number"),       key: "phone",      type: "tel",      placeholder: "+1 000 000 0000" },
    { label: getCmsLabel("company",    "Company"),            key: "company",    type: "text",     placeholder: "Your organisation name" },
    { label: getCmsLabel("messagebox", "Message (optional)"), key: "messagebox", type: "textarea", placeholder: "Anything specific you'd like us to know?" },
  ];

  // Organisation field options: form schema options (always present)
  const orgFields = getStep("organisation")?.fields ?? [];
  const getOpts = (key: string, fallback: string[]) => {
    const f = orgFields.find(f => f.key === key);
    return f?.options && f.options.length > 0 ? f.options : fallback;
  };
  const employeeOptions = getOpts("employees", ["< 50", "50–200", "201–1,000", "1,001–5,000", "5,000+"]);
  const siteOptions     = getOpts("sites",     ["1", "2–5", "6–20", "21–50", "50+"]);
  // Industries: pricing_calculator block overrides form schema options
  const industryOptions = (cmsIndustries && cmsIndustries.length > 0)
    ? cmsIndustries
    : getOpts("industry", INDUSTRIES);

  // Apps: pricing_calculator block drives the list; falls back to hardcoded APPS
  const apps = (cmsApplications && cmsApplications.length > 0)
    ? cmsApplications.map(a => ({ id: a.id, name: a.name, desc: a.description, icon: a.icon || "check-circle", color: a.color || "#155eef" }))
    : APPS;

  // Addons: pricing_calculator block drives the list; falls back to hardcoded ADDONS
  const addons = (cmsAddons && cmsAddons.length > 0)
    ? cmsAddons.map(a => ({ id: a.id, name: a.name, desc: a.description, color: a.color || "#6366f1", icon: a.icon }))
    : ADDONS;

  const submitLabel    = cmsSubmitLabel    || "Get My EHSWatch Proposal →";
  const successHeading = cmsSuccessHeading || "Proposal Request Sent!";

  const [step, setStep] = useState(0);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [org, setOrg] = useState({ employees: "", sites: "", industry: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
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

  const onSubmit = async (data: ProposalData) => {
    setSubmitError(null);
    try {
      const { submitForm } = await import("@/lib/api");
      const result = await submitForm(formSlug, {
        ...data,
        selected_applications: Array.from(selectedApps),
        selected_addons: Array.from(selectedAddons),
        employees: org.employees,
        sites: org.sites,
        industry: org.industry,
        captcha_token: captchaToken ?? "",
      });

      if (!result.ok) {
        // Map CMS field errors back to their input fields where possible
        const fieldKeys = new Set(Object.keys(proposalSchema.shape));
        let mappedAny = false;
        for (const err of result.errors ?? []) {
          const field = err.source?.pointer?.split("/").pop() as keyof ProposalData | undefined;
          if (field && fieldKeys.has(field)) {
            setError(field, { type: "server", message: err.detail });
            mappedAny = true;
          }
        }
        // Unmapped errors (e.g. selected_applications, captcha) shown as banner
        const unmapped = (result.errors ?? []).filter(
          (e) => !fieldKeys.has((e.source?.pointer?.split("/").pop() ?? "") as keyof ProposalData)
        );
        if (unmapped.length > 0) {
          setSubmitError(unmapped.map((e) => e.detail).join(" "));
        } else if (!mappedAny) {
          setSubmitError("Submission failed. Please check your details and try again.");
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    }
  };

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
          <h2
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#0a0f1e]"
            dangerouslySetInnerHTML={{ __html: heading.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">') }}
          />
          <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] mt-3 max-w-[460px] mx-auto text-pretty">
            {subheading}
          </p>
        </div>

        {/* Step indicator */}
        <div className="w-full max-w-[640px] mx-auto mb-10 md:mb-14">
          <div className="flex items-center">
            {steps.map((label, i) => {
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
                  {i < steps.length - 1 && (
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
                  {appsStepTitle}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  {appsStepDesc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {apps.map((app) => {
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
                            <LucideIcon name={app.icon} size={16} />
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
                  {addonsStepTitle}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  {addonsStepDesc} <span className="text-[#9ca3af]">(optional)</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {addons.map((addon) => {
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
                            <LucideIcon name={addon.icon} size={20} />
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
                  {orgStepTitle}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  {orgStepDesc}
                </p>
                <div className="flex flex-col gap-5">
                  {[
                    { label: "Number of Employees", key: "employees", options: employeeOptions },
                    { label: "Number of Sites",     key: "sites",     options: siteOptions },
                    { label: "Industry",            key: "industry",  options: industryOptions },
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
                  {contactStepTitle}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  {contactStepDesc}
                </p>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
                  {contactProposalFields.map(({ label, key, type, placeholder }) => {
                    const isOptional = key === "messagebox";
                    return (
                      <div key={key} className="flex flex-col gap-2">
                        <label className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#374151]">
                          {label}{!isOptional && <span style={{ color: "#ef4444" }}> *</span>}
                        </label>
                        {type === "textarea" ? (
                          <textarea
                            rows={4}
                            placeholder={placeholder}
                            className="calc-input w-full rounded-xl border px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0a0f1e] placeholder:text-[#9ca3af] transition-all duration-200 resize-none"
                            style={{ borderColor: errors[key] ? "#f87171" : "#e5e7eb" }}
                            {...register(key)}
                          />
                        ) : (
                          <input
                            type={type}
                            placeholder={placeholder}
                            className="calc-input w-full rounded-xl border px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0a0f1e] placeholder:text-[#9ca3af] transition-all duration-200"
                            style={{ borderColor: errors[key] ? "#f87171" : "#e5e7eb" }}
                            {...register(key)}
                          />
                        )}
                        {errors[key] && (
                          <p className="text-[12px] text-red-500 font-[family-name:var(--font-dm-sans)]">
                            {errors[key]?.message}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <TurnstileField onToken={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />

                  {submitError && (
                    <div
                      className="rounded-xl px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[13.5px] leading-[1.6]"
                      style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}
                    >
                      {submitError}
                    </div>
                  )}

                  <button type="submit"
                    disabled={isSubmitting || !captchaToken}
                    className="mt-2 w-full py-[13px] rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[15px] text-white transition-all duration-300"
                    style={{
                      backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                      boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                      opacity: (isSubmitting || !captchaToken) ? 0.7 : 1,
                      cursor: (isSubmitting || !captchaToken) ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmitting ? "Sending..." : submitLabel}
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
                    {successHeading}
                  </h3>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] leading-[1.75] text-pretty">
                    {cmsSuccessBody
                      ? cmsSuccessBody
                          .replace(/{name}/g, getValues("name").split(" ")[0])
                          .replace(/{email}/g, getValues("email"))
                      : <>Thanks {getValues("name").split(" ")[0]}! Our team will review your selections and send a tailored proposal to <strong>{getValues("email")}</strong> within 1 business day.</>
                    }
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
                  {apps.filter((a) => selectedApps.has(a.id)).map((a) => (
                    <li key={a.id} className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: a.color + "18", color: a.color }}
                      >
                        <LucideIcon name={a.icon} size={13} />
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
                      {addons.filter((a) => selectedAddons.has(a.id)).map((a) => (
                        <li key={a.id} className="flex items-center gap-2.5">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ background: a.color + "18", color: a.color }}
                          >
                            <LucideIcon name={a.icon} size={13} />
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
