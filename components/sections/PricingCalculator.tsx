"use client";

import { useEffect, useRef, useState } from "react";
import TurnstileField from "@/components/ui/TurnstileField";
import CmsIcon from "@/components/ui/CmsIcon";
import PhoneInput, { isPhoneField } from "@/components/ui/PhoneInput";

// ─────────────────────────────────────────────────────────────────────────────
// Fully CMS-driven pricing wizard.
// Steps and fields render from the CMS form schema (build-ehswatch-package):
// add / remove / reorder fields in the CMS form editor and they appear here.
// Validation is derived from each field's `required` flag and `field_type`.
// ─────────────────────────────────────────────────────────────────────────────

// ── Icon renderer — shared sitewide resolver (Lucide + heroicon-o-* slugs) ──
function LucideIcon({ name, size = 18 }: { name?: string; size?: number }) {
  return <CmsIcon icon={name} size={size} strokeWidth={1.5} color="currentColor" fallback="square-check" />;
}

// Selected-apps count label with correct Arabic number grammar (singular/dual/plural).
function appCountLabel(n: number, ar: boolean): string {
  if (!ar) return `${n} app${n !== 1 ? "s" : ""}`;
  if (n === 1) return "تطبيق واحد";
  if (n === 2) return "تطبيقان";
  return `تطبيقات ${n}`;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CmsFormField {
  key: string;
  label: string;
  field_type: string;
  options?: string[] | null;
  required?: boolean;
  placeholder?: string | null;
  help_text?: string | null;
  full_width?: boolean;
}

export interface CmsFormStep {
  key: string;
  title: string;
  description: string;
  fields: CmsFormField[];
}

interface PickerItem { id: string; name: string; desc: string; icon?: string; color: string }

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
  cmsCaptchaSiteKey?: string;
}

// ── Field-level validation, driven by the CMS schema ─────────────────────────

const PICKER_TYPES = new Set(["application_picker", "addon_picker"]);
const MULTI_TYPES  = new Set(["application_picker", "addon_picker", "checkboxes"]);

function validateField(
  field: CmsFormField,
  values: Record<string, string>,
  picks: Record<string, string[]>,
): string | null {
  const label = field.label || field.key;

  if (MULTI_TYPES.has(field.field_type)) {
    if (field.required && (picks[field.key]?.length ?? 0) === 0) {
      return `Select at least one option for ${label}.`;
    }
    return null;
  }

  if (field.field_type === "consent") {
    if (field.required && values[field.key] !== "true") {
      return `You must accept ${label} to continue.`;
    }
    return null;
  }

  const val = (values[field.key] ?? "").trim();

  if (field.required && !val) return `${label} is required.`;
  if (!val) return null; // optional and empty — nothing more to check

  if (field.field_type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
    return "Enter a valid email address.";
  }
  if (isPhoneField(field) && val.replace(/\D/g, "").length < 7) {
    return "Enter a valid phone number.";
  }
  if (field.field_type === "url" && !/^https?:\/\/.+\..+/.test(val)) {
    return "Enter a valid URL (starting with http:// or https://).";
  }
  if (field.field_type === "number" && Number.isNaN(Number(val))) {
    return `${label} must be a number.`;
  }
  return null;
}

// ── Main component ────────────────────────────────────────────────────────────

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
  cmsCaptchaSiteKey,
}: PricingCalculatorProps = {}) {
  const formSlug   = cmsFormSlug || "build-ehswatch-package";
  // CMS-only: no hardcoded fallback copy.
  const heading    = cmsHeading?.trim()    || "";
  const subheading = cmsSubheading?.trim() || "";

  // The wizard IS the CMS form schema — no hardcoded fallback steps.
  const wizardSteps: CmsFormStep[] =
    cmsFormSteps && cmsFormSteps.length > 0 ? cmsFormSteps : [];

  const stepLabels =
    cmsStepLabels && cmsStepLabels.length === wizardSteps.length
      ? cmsStepLabels
      : wizardSteps.map((s) => s.title);

  // Picker catalogues (apps / addons) — CMS-only, no hardcoded catalogue.
  const apps: PickerItem[] = (cmsApplications ?? [])
    .map(a => ({ id: a.id, name: a.name, desc: a.description, icon: a.icon || "check-circle", color: a.color || "#155eef" }));
  const addons: PickerItem[] = (cmsAddons ?? [])
    .map(a => ({ id: a.id, name: a.name, desc: a.description, icon: a.icon, color: a.color || "#6366f1" }));

  // Industry options come from the CMS (pricing_calculator block or the form field schema).
  const fieldOptions = (field: CmsFormField): string[] => {
    if (field.key === "industry" && cmsIndustries && cmsIndustries.length > 0) return cmsIndustries;
    return field.options ?? [];
  };

  // Submit button must carry a label to remain operable; use the CMS value,
  // falling back to a neutral, non-marketing word only if the form omits it.
  const submitLabel    = cmsSubmitLabel?.trim()    || "Submit";
  const successHeading = cmsSuccessHeading?.trim() || "";

  const [step, setStep]               = useState(0);
  const [values, setValues]           = useState<Record<string, string>>({});
  const [picks, setPicks]             = useState<Record<string, string[]>>({});
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [submitted, setSubmitted]     = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // Arabic active? (drives locale-aware, self-rendered labels like the app count)
  const [isAr, setIsAr] = useState(false);
  useEffect(() => {
    const check = () =>
      /(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie) ||
      /(?:^|;\s*)locale=ar/.test(document.cookie) ||
      document.documentElement.dir === "rtl";
    setIsAr(check());
    const onLocale = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setIsAr(detail === "ar" || (detail == null && check()));
    };
    window.addEventListener("ehs-locale", onLocale);
    return () => window.removeEventListener("ehs-locale", onLocale);
  }, []);

  const isLastStep = step === wizardSteps.length - 1;
  const current = wizardSteps[step];

  const setValue = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const togglePick = (key: string, id: string) => {
    setPicks((prev) => {
      const list = prev[key] ?? [];
      return { ...prev, [key]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] };
    });
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const validateStep = (idx: number): boolean => {
    const stepErrors: Record<string, string> = {};
    for (const field of wizardSteps[idx].fields) {
      if (field.field_type === "hidden") continue;
      const err = validateField(field, values, picks);
      if (err) stepErrors[field.key] = err;
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(wizardSteps.length - 1, s + 1));
  };

  // Step contents differ wildly in height (the Applications checklist is ~10×
  // taller than Add-Ons). The browser keeps the old scroll offset across the
  // swap, which dumped the viewport into the FAQ section — snap back to the
  // top of the wizard whenever the step changes.
  const stepChangedOnce = useRef(false);
  useEffect(() => {
    if (!stepChangedOnce.current) { stepChangedOnce.current = true; return; }
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateStep(step)) return;
    if (!captchaToken) {
      setSubmitError("Please complete the CAPTCHA verification.");
      return;
    }

    // Build payload from every schema field across all steps
    const payload: Record<string, unknown> = { captcha_token: captchaToken };
    for (const s of wizardSteps) {
      for (const f of s.fields) {
        if (MULTI_TYPES.has(f.field_type)) payload[f.key] = picks[f.key] ?? [];
        else payload[f.key] = values[f.key] ?? "";
      }
    }

    setSubmitting(true);
    try {
      const { submitForm } = await import("@/lib/api");
      const result = await submitForm(formSlug, payload);

      if (!result.ok) {
        const allKeys = new Set(wizardSteps.flatMap((s) => s.fields.map((f) => f.key)));
        const fieldErrors: Record<string, string> = {};
        const unmapped: string[] = [];
        for (const err of result.errors ?? []) {
          const key = err.source?.pointer?.split("/").pop() ?? "";
          if (key && allKeys.has(key)) fieldErrors[key] = err.detail ?? err.title ?? "Invalid value.";
          else unmapped.push(err.detail ?? err.title ?? "");
        }
        if (Object.keys(fieldErrors).length > 0) setErrors(fieldErrors);
        if (unmapped.filter(Boolean).length > 0) setSubmitError(unmapped.filter(Boolean).join(" "));
        else if (Object.keys(fieldErrors).length === 0) setSubmitError("Submission failed. Please check your details and try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Widgets ────────────────────────────────────────────────────────────────

  const inputClass =
    "calc-input w-full rounded-xl border px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0a0f1e] placeholder:text-[#9ca3af] transition-all duration-200";

  function FieldError({ msg }: { msg?: string }) {
    if (!msg) return null;
    return <p className="text-[12px] text-red-500 font-[family-name:var(--font-dm-sans)]">{msg}</p>;
  }

  function renderPickerGrid(field: CmsFormField) {
    const isAddon = field.field_type === "addon_picker";
    const items = isAddon ? addons : apps;
    const selected = new Set(picks[field.key] ?? []);
    return (
      <div key={field.key}>
        {field.help_text && (
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af] mb-4">{field.help_text}</p>
        )}
        <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ${isAddon ? "gap-4" : "gap-3"}`}>
          {items.map((item) => {
            const sel = selected.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => togglePick(field.key, item.id)}
                className={`${isAddon ? "addon-card" : "calc-card"} text-left rounded-xl border transition-all duration-200 flex flex-col ${isAddon ? "p-5 gap-3" : "p-4 gap-2.5"} ${sel ? (isAddon ? "addon-card-sel" : "calc-card-sel") : ""}`}
                style={{
                  borderColor: sel ? "#1d4ed8" : "#e5e7eb",
                  background: sel ? "#eff6ff" : "white",
                  cursor: "pointer",
                }}
              >
                <div className={`flex ${isAddon ? "items-start" : "items-center"} justify-between gap-2`}>
                  <div
                    className={`${isAddon ? "w-10 h-10 rounded-xl" : "w-8 h-8 rounded-lg"} flex items-center justify-center shrink-0`}
                    style={{ background: item.color + "14", color: item.color }}
                  >
                    <LucideIcon name={item.icon} size={isAddon ? 20 : 16} />
                  </div>
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
                  <p className={`font-[family-name:var(--font-gothic-a1)] font-semibold ${isAddon ? "text-[15px]" : "text-[13px]"} text-[#0a0f1e] leading-snug`}>
                    {item.name}
                  </p>
                  <p className={`${isAddon ? "" : "calc-desc"} font-[family-name:var(--font-dm-sans)] ${isAddon ? "text-[13px]" : "text-[11px]"} text-[#6b7280] leading-[1.5] mt-1 text-pretty`}>
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3"><FieldError msg={errors[field.key]} /></div>
      </div>
    );
  }

  function renderField(field: CmsFormField) {
    if (field.field_type === "hidden") return null;
    if (PICKER_TYPES.has(field.field_type)) return renderPickerGrid(field);

    const err = errors[field.key];
    const label = (
      <label className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#374151]">
        {field.label}
        {field.required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
    );
    const help = field.help_text ? (
      <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#9ca3af]">{field.help_text}</p>
    ) : null;
    const borderColor = err ? "#f87171" : "#e5e7eb";

    if (field.field_type === "select") {
      return (
        <div key={field.key} className="flex flex-col gap-2">
          {label}
          <select
            className={inputClass + " appearance-none bg-white"}
            style={{ borderColor }}
            value={values[field.key] ?? ""}
            onChange={(e) => setValue(field.key, e.target.value)}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {fieldOptions(field).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {help}
          <FieldError msg={err} />
        </div>
      );
    }

    if (field.field_type === "textarea") {
      return (
        <div key={field.key} className="flex flex-col gap-2">
          {label}
          <textarea
            rows={4}
            placeholder={field.placeholder ?? ""}
            className={inputClass + " resize-none"}
            style={{ borderColor }}
            value={values[field.key] ?? ""}
            onChange={(e) => setValue(field.key, e.target.value)}
          />
          {help}
          <FieldError msg={err} />
        </div>
      );
    }

    if (field.field_type === "radio") {
      return (
        <div key={field.key} className="flex flex-col gap-2">
          {label}
          <div className="flex flex-wrap gap-4">
            {fieldOptions(field).map((o) => (
              <label key={o} className="flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#374151] cursor-pointer">
                <input
                  type="radio"
                  name={field.key}
                  checked={values[field.key] === o}
                  onChange={() => setValue(field.key, o)}
                  className="accent-[#1d4ed8]"
                />
                {o}
              </label>
            ))}
          </div>
          {help}
          <FieldError msg={err} />
        </div>
      );
    }

    if (field.field_type === "checkboxes") {
      const selected = new Set(picks[field.key] ?? []);
      return (
        <div key={field.key} className="flex flex-col gap-2">
          {label}
          <div className="flex flex-col gap-2">
            {fieldOptions(field).map((o) => (
              <label key={o} className="flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#374151] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.has(o)}
                  onChange={() => togglePick(field.key, o)}
                  className="accent-[#1d4ed8]"
                />
                {o}
              </label>
            ))}
          </div>
          {help}
          <FieldError msg={err} />
        </div>
      );
    }

    if (field.field_type === "consent") {
      return (
        <div key={field.key} className="flex flex-col gap-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={values[field.key] === "true"}
              onChange={(e) => setValue(field.key, e.target.checked ? "true" : "")}
              className="mt-0.5 accent-[#1d4ed8]"
            />
            <span className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#374151] leading-[1.6]">
              {field.label}
              {field.required && <span style={{ color: "#ef4444" }}> *</span>}
            </span>
          </label>
          {help}
          <FieldError msg={err} />
        </div>
      );
    }

    // Phone (by type OR field name) → country-code widget, country auto-detected per visitor.
    if (isPhoneField(field)) {
      return (
        <div key={field.key} className="flex flex-col gap-2">
          {label}
          <PhoneInput
            name={field.key}
            required={field.required}
            placeholder={field.placeholder ?? ""}
            variant="support"
            defaultValue={values[field.key] ?? ""}
            onValue={(v) => setValue(field.key, v)}
          />
          {help}
          <FieldError msg={err} />
        </div>
      );
    }

    // text / email / phone / tel / url / number
    const htmlType =
      field.field_type === "email"  ? "email"
      : field.field_type === "phone" || field.field_type === "tel" ? "tel"
      : field.field_type === "url"    ? "url"
      : field.field_type === "number" ? "number"
      : "text";

    return (
      <div key={field.key} className="flex flex-col gap-2">
        {label}
        <input
          type={htmlType}
          placeholder={field.placeholder ?? ""}
          className={inputClass}
          style={{ borderColor }}
          value={values[field.key] ?? ""}
          onChange={(e) => setValue(field.key, e.target.value)}
        />
        {help}
        <FieldError msg={err} />
      </div>
    );
  }

  // ── Sidebar summary data ───────────────────────────────────────────────────
  const appPickerKey   = wizardSteps.flatMap((s) => s.fields).find((f) => f.field_type === "application_picker")?.key;
  const addonPickerKey = wizardSteps.flatMap((s) => s.fields).find((f) => f.field_type === "addon_picker")?.key;
  const selectedAppIds   = new Set(appPickerKey ? picks[appPickerKey] ?? [] : []);
  const selectedAddonIds = new Set(addonPickerKey ? picks[addonPickerKey] ?? [] : []);
  const summarySelects = wizardSteps
    .flatMap((s) => s.fields)
    .filter((f) => f.field_type === "select" && (values[f.key] ?? "").trim());

  const firstName = (values["name"] ?? "").split(" ")[0] || "there";
  const emailVal  = values["email"] ?? "";

  const stepHasPicker = current.fields.some((f) => PICKER_TYPES.has(f.field_type));

  // CMS-only: with no form steps there is nothing to render.
  if (wizardSteps.length === 0) return null;

  return (
    <section id="calculator" className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white scroll-mt-20">
      <style>{`
        .calc-card-sel { border-color: #1d4ed8 !important; background: #eff6ff !important; }
        .calc-card:hover:not(.calc-card-sel) { border-color: #93c5fd !important; box-shadow: 0 4px 16px rgba(59,130,246,0.10) !important; }
        .addon-card-sel { border-color: #1d4ed8 !important; background: #eff6ff !important; }
        .addon-card:hover:not(.addon-card-sel) { border-color: #93c5fd !important; }
        .calc-input:focus { outline: none; border-color: #1d4ed8 !important; box-shadow: 0 0 0 3px rgba(29,78,216,0.10); }
        .calc-desc { max-height: 0; overflow: hidden; opacity: 0; transition: max-height 0.28s ease, opacity 0.22s ease; }
        .calc-card:hover .calc-desc, .calc-card-sel .calc-desc { max-height: 60px; opacity: 1; }
      `}</style>

      <div className="max-w-[1160px] mx-auto">
        {/* Section heading */}
        {(heading || subheading) && (
        <div className="text-center mb-10 md:mb-14">
          {heading && (
            <h2
              className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#0a0f1e]"
              dangerouslySetInnerHTML={{ __html: heading.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">') }}
            />
          )}
          {subheading && (
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] mt-3 max-w-[460px] mx-auto text-pretty">
              {subheading}
            </p>
          )}
        </div>
        )}

        {/* Step indicator — circles evenly spaced (fixed circle + flex-1
            connector); labels are absolutely positioned under each circle so
            varying label widths don't skew the spacing. */}
        <div className="w-full max-w-[640px] mx-auto mb-10 md:mb-14">
          <div className="flex items-center pb-2 sm:pb-8">
            {stepLabels.map((label, i) => {
              const done   = i < step;
              const active = i === step;
              const isLast = i === stepLabels.length - 1;
              return (
                <div key={i} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                  <div className="relative shrink-0 flex justify-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-[family-name:var(--font-dm-sans)] font-bold text-[14px] border-2 transition-all duration-300"
                      style={{
                        borderColor: done || active ? "#1d4ed8" : "#d1d5db",
                        background:  done || active ? "#1d4ed8" : "white",
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
                    {/* Per-circle labels: hidden on mobile (they overlap when
                        long) and allowed to wrap on ≥sm so they never collide. */}
                    <span
                      className="hidden sm:block absolute top-full mt-2 left-1/2 -translate-x-1/2 font-[family-name:var(--font-dm-sans)] text-[11px] sm:text-[12px] font-medium whitespace-normal max-w-[104px] leading-tight text-center transition-colors duration-300"
                      style={{
                        color: active ? "#0a0f1e" : done ? "#1d4ed8" : "#9ca3af",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="flex-1 h-[2px] mx-2 relative" style={{ background: "#e5e7eb" }}>
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{ width: i < step ? "100%" : "0%", background: "#1d4ed8" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Mobile: show only the current step's label (per-circle labels hidden) */}
          <p className="sm:hidden text-center font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold text-[#0a0f1e]">
            Step {step + 1} of {stepLabels.length} — {stepLabels[step]}
          </p>
        </div>

        {/* Main layout: content + sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Content area ── */}
          <div className="flex-1 min-w-0">
            {!submitted ? (
              <div className={stepHasPicker ? "" : "max-w-[560px]"}>
                <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[22px] text-[#0a0f1e] mb-2">
                  {current.title}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  {current.description}
                </p>

                {isLastStep ? (
                  <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                    {current.fields.map(renderField)}
                    <TurnstileField siteKey={cmsCaptchaSiteKey} onToken={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
                    {submitError && (
                      <div
                        className="rounded-xl px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[13.5px] leading-[1.6]"
                        style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" }}
                      >
                        {submitError}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 w-full py-[13px] rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[15px] text-white transition-all duration-300"
                      style={{
                        backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                        boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
                        opacity: submitting ? 0.7 : 1,
                        cursor: submitting ? "not-allowed" : "pointer",
                      }}
                    >
                      {submitting ? "Sending..." : submitLabel}
                    </button>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#9ca3af] text-center text-pretty">
                      No commitment required. We&apos;ll follow up within 1 business day.
                    </p>
                  </form>
                ) : (
                  <div className="flex flex-col gap-5">
                    {current.fields.map(renderField)}
                  </div>
                )}
              </div>
            ) : (
              /* Success state */
              <div className="max-w-[560px] text-center py-12 flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "#ecfdf5" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14l6 6 12-12" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  {successHeading && (
                    <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[24px] text-[#0a0f1e] mb-2">
                      {successHeading}
                    </h3>
                  )}
                  {cmsSuccessBody?.trim() && (
                    <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] leading-[1.75] text-pretty">
                      {cmsSuccessBody.replace(/{name}/g, firstName).replace(/{email}/g, emailVal)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {!submitted && (
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

                {!isLastStep && (
                  <button
                    onClick={goNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-white transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                    }}
                  >
                    Continue
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Sticky sidebar summary (stacks full-width below wizard on mobile/tablet, sticky sidebar on lg).
              Hidden after submit so only the "Proposal Request Sent!" confirmation shows (FE QA #15). ── */}
          <div className={`w-full lg:w-[280px] shrink-0 ${submitted ? "hidden" : ""}`}>
            <div
              className="lg:sticky lg:top-[100px] rounded-2xl p-6 flex flex-col gap-5"
              style={{ background: "#F8FBFF", border: "1px solid #dbeafe" }}
            >
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-gothic-a1)] font-bold text-[15px] text-[#0a0f1e]">Your Package</span>
                {selectedAppIds.size > 0 && (
                  <span
                    translate="no"
                    className="notranslate font-[family-name:var(--font-dm-sans)] text-[12px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "#1d4ed8", color: "white" }}
                  >
                    {appCountLabel(selectedAppIds.size, isAr)}
                  </span>
                )}
              </div>

              {selectedAppIds.size === 0 ? (
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af] text-center py-4">
                  No applications selected yet
                </p>
              ) : (
                <ul className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {apps.filter((a) => selectedAppIds.has(a.id)).map((a) => (
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

              {selectedAddonIds.size > 0 && (
                <>
                  <div className="border-t border-[#dbeafe]" />
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-2">Add-Ons</p>
                    <ul className="flex flex-col gap-2">
                      {addons.filter((a) => selectedAddonIds.has(a.id)).map((a) => (
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

              {summarySelects.length > 0 && (
                <>
                  <div className="border-t border-[#dbeafe]" />
                  <div className="flex flex-col gap-2">
                    <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-1">Organisation</p>
                    {summarySelects.map((f) => (
                      <p key={f.key} className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151]">
                        {f.label}: {values[f.key]}
                      </p>
                    ))}
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
