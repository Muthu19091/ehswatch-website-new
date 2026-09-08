"use client";

import React, { useEffect, useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldDef = {
  key: string;
  label: string;
  field_type: string;
  placeholder?: string | null;
  help_text?: string | null;
  options?: string | string[] | null;
  default_value?: string | null;
  required: boolean;
  full_width: boolean;
  // Only populated when field_type === 'catalogue_picker' — tells the
  // renderer which key to read from picker_catalogues for the item list.
  catalogue_slug?: string | null;
};

type CatalogueItem = {
  slug: string;
  name: string;
  icon?: string | null;
  category?: string | null;
  base_price?: number | string;
  description?: string | null;
};

type StepDef = {
  key: string;
  title: string;
  description?: string | null;
  fields: FieldDef[];
};

type CatalogueApp = {
  slug: string;
  name: string;
  icon?: string | null;
  category?: string | null;
  base_price?: number | string;
  description?: string | null;
};

type CatalogueAddon = {
  slug: string;
  name: string;
  icon?: string | null;
  base_price?: number | string;
  description?: string | null;
};

type FormSchema = {
  slug: string;
  name: string;
  form_type: string;
  use_multi_step: boolean;
  submit_label?: string;
  success_heading?: string | null;
  success_message?: string;
  redirect_url?: string | null;
  steps?: StepDef[];
  fields?: FieldDef[];
  picker_catalogues?: {
    applications?: CatalogueApp[];
    addons?: CatalogueAddon[];
    // Dynamic catalogues keyed by their slug (e.g. "services", "licences").
    [catalogueSlug: string]: CatalogueApp[] | CatalogueAddon[] | CatalogueItem[] | undefined;
  };
};

type Props = {
  formSlug: string;
  apiBase?: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const API_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cmsapi.ehswatch.com/api/v1";

// Accept either a CSV string (legacy single-step forms) OR an array
// (modern Filament TagsInput shape). API normalises to array; fallback
// here for any inline test fixtures still passing strings.
const splitOptions = (input: string | string[] | null | undefined): string[] => {
  if (Array.isArray(input)) {
    return input.map((s) => String(s).trim()).filter(Boolean);
  }
  return (input ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

// Interpolate {key} tokens from submitted data into a template string.
// Missing tokens collapse to empty string (so "Thanks {name}!" with no
// name becomes "Thanks !" — acceptable fallback).
const interpolate = (template: string, data: Record<string, unknown>): string =>
  template.replace(/\{([a-z_][a-z0-9_]*)\}/gi, (_match, key) => {
    const val = data[key];
    if (val == null) return "";
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  });

// ── Sub-components ────────────────────────────────────────────────────────────

function StepIndicator({
  steps,
  currentStep,
}: {
  steps: StepDef[];
  currentStep: number;
}) {
  return (
    <div className="w-full max-w-[640px] mx-auto mb-10 md:mb-14">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 relative">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-[family-name:var(--font-dm-sans)] font-bold text-[14px] border-2 transition-all duration-300 shrink-0"
                  style={{
                    borderColor: done || active ? "#1d4ed8" : "#d1d5db",
                    background: done || active ? "#1d4ed8" : "white",
                    color: done || active ? "white" : "#9ca3af",
                  }}
                >
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2.5 7l3 3 6-6"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div
                  className="font-[family-name:var(--font-dm-sans)] text-[11px] sm:text-[12px] font-medium mt-1 whitespace-nowrap transition-colors duration-300"
                  style={{ color: active ? "#1d4ed8" : done ? "#1d4ed8" : "#9ca3af" }}
                >
                  {step.title}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex-1 h-[2px] mx-2 sm:mx-3 transition-colors duration-300"
                  style={{ background: done ? "#1d4ed8" : "#e5e7eb" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicationPicker({
  applications,
  value,
  onChange,
}: {
  applications: CatalogueApp[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (slug: string) => {
    const set = new Set(value);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    onChange(Array.from(set));
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {applications.map((app) => {
        const selected = value.includes(app.slug);
        return (
          <button
            type="button"
            key={app.slug}
            onClick={() => toggle(app.slug)}
            className="calc-card text-left rounded-xl border bg-white p-4 transition-all duration-150 relative"
            style={{
              borderColor: selected ? "#1d4ed8" : "#e5e7eb",
              background: selected ? "#eff6ff" : "white",
            }}
          >
            <span
              className="absolute top-3 right-3 w-5 h-5 rounded border flex items-center justify-center"
              style={{
                borderColor: selected ? "#1d4ed8" : "#d1d5db",
                background: selected ? "#1d4ed8" : "white",
              }}
            >
              {selected && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 5.5l2.8 2.8L9 2.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <p className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[13px] text-[#0a0f1e] leading-snug pr-7">
              {app.name}
            </p>
            {app.description && (
              <p className="font-[family-name:var(--font-dm-sans)] text-[11px] text-[#6b7280] leading-[1.5] mt-1 text-pretty">
                {app.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function AddonPicker({
  addons,
  value,
  onChange,
}: {
  addons: CatalogueAddon[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (slug: string) => {
    const set = new Set(value);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    onChange(Array.from(set));
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {addons.map((addon) => {
        const selected = value.includes(addon.slug);
        return (
          <button
            type="button"
            key={addon.slug}
            onClick={() => toggle(addon.slug)}
            className="addon-card text-left rounded-xl border bg-white p-4 transition-all duration-150 relative"
            style={{
              borderColor: selected ? "#1d4ed8" : "#e5e7eb",
              background: selected ? "#eff6ff" : "white",
            }}
          >
            <span
              className="absolute top-3 right-3 w-5 h-5 rounded border flex items-center justify-center"
              style={{
                borderColor: selected ? "#1d4ed8" : "#d1d5db",
                background: selected ? "#1d4ed8" : "white",
              }}
            >
              {selected && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 5.5l2.8 2.8L9 2.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <p className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug pr-7">
              {addon.name}
            </p>
            {addon.description && (
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] mt-1 text-pretty">
                {addon.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
  catalogues,
  error,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
  catalogues?: FormSchema["picker_catalogues"];
  error?: string;
}) {
  const inputClass =
    "calc-input w-full rounded-xl border px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0a0f1e] placeholder:text-[#9ca3af] bg-white transition-all duration-200";

  switch (field.field_type) {
    case "application_picker":
      return (
        <ApplicationPicker
          applications={catalogues?.applications ?? []}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(next) => onChange(next)}
        />
      );
    case "addon_picker":
      return (
        <AddonPicker
          addons={catalogues?.addons ?? []}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(next) => onChange(next)}
        />
      );
    case "catalogue_picker": {
      // Read items from the dynamic catalogue keyed by field.catalogue_slug.
      // Falls back to an empty array if the API didn't inline this catalogue
      // (e.g. admin disabled it after the form was built).
      const slug = field.catalogue_slug ?? "";
      const items = (slug && catalogues
        ? ((catalogues as Record<string, unknown>)[slug] as CatalogueItem[] | undefined)
        : undefined) ?? [];
      return (
        <ApplicationPicker
          applications={items as CatalogueApp[]}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={(next) => onChange(next)}
        />
      );
    }
    case "select":
    case "radio": {
      const opts = splitOptions(field.options);
      return (
        <div className="relative">
          <select
            className={inputClass + " appearance-none pr-10"}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            style={{ borderColor: error ? "#ef4444" : "#e5e7eb" }}
          >
            <option value="" disabled>
              {field.placeholder || `Select ${field.label.toLowerCase()}`}
            </option>
            {opts.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M3 5l4 4 4-4" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    }
    case "checkboxes": {
      const opts = splitOptions(field.options);
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-col gap-2">
          {opts.map((opt) => {
            const checked = arr.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-2 text-[14px] font-[family-name:var(--font-dm-sans)] text-[#374151]">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = new Set(arr);
                    if (checked) next.delete(opt);
                    else next.add(opt);
                    onChange(Array.from(next));
                  }}
                />
                {opt}
              </label>
            );
          })}
        </div>
      );
    }
    case "consent": {
      // Single-checkbox consent — the field's label IS the consent text
      // (e.g. "I agree to receive product + EHS insight emails."). When
      // required, the backend validates with Laravel's `accepted` rule.
      // Value is boolean; the field renderer below skips the standalone
      // <label> for consent so the checkbox + text read as one line.
      const checked = Boolean(value);
      return (
        <label className="flex items-start gap-2 text-[14px] font-[family-name:var(--font-dm-sans)] text-[#374151] leading-snug cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-[3px] accent-[#155eef] cursor-pointer"
            aria-required={field.required || undefined}
          />
          <span>
            {field.label}
            {field.required ? <span className="text-red-500" aria-hidden="true"> *</span> : null}
          </span>
        </label>
      );
    }
    case "textarea":
      return (
        <textarea
          className={inputClass}
          rows={4}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          style={{ borderColor: error ? "#ef4444" : "#e5e7eb" }}
        />
      );
    default: {
      const inputType =
        field.field_type === "email" ? "email" :
        field.field_type === "phone" ? "tel" :
        field.field_type === "number" ? "number" :
        field.field_type === "date" ? "date" :
        "text";
      return (
        <input
          type={inputType}
          className={inputClass}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? ""}
          style={{ borderColor: error ? "#ef4444" : "#e5e7eb" }}
        />
      );
    }
  }
}

function PackageSidebar({
  schema,
  data,
}: {
  schema: FormSchema;
  data: Record<string, unknown>;
}) {
  const apps = schema.picker_catalogues?.applications ?? [];
  const addons = schema.picker_catalogues?.addons ?? [];
  const appKey = useMemo(
    () => schema.steps?.flatMap((s) => s.fields).find((f) => f.field_type === "application_picker")?.key,
    [schema]
  );
  const addonKey = useMemo(
    () => schema.steps?.flatMap((s) => s.fields).find((f) => f.field_type === "addon_picker")?.key,
    [schema]
  );
  const pickedApps = appKey && Array.isArray(data[appKey]) ? (data[appKey] as string[]) : [];
  const pickedAddons = addonKey && Array.isArray(data[addonKey]) ? (data[addonKey] as string[]) : [];
  const totalSelected = pickedApps.length + pickedAddons.length;

  return (
    <aside
      className="rounded-2xl border bg-white px-5 py-5 sticky top-6 self-start"
      style={{ borderColor: "#e5e7eb" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-[family-name:var(--font-gothic-a1)] font-bold text-[15px] text-[#0a0f1e]">
          Your Package
        </span>
        {totalSelected > 0 && (
          <span
            className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: "#1d4ed8", color: "white" }}
          >
            {pickedApps.length} apps
          </span>
        )}
      </div>

      {totalSelected === 0 ? (
        <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af] text-center py-4">
          No applications selected yet
        </p>
      ) : (
        <>
          {pickedApps.length > 0 && (
            <div className="mb-3 max-h-[180px] overflow-y-auto">
              {pickedApps.map((slug) => {
                const app = apps.find((a) => a.slug === slug);
                if (!app) return null;
                return (
                  <div key={slug} className="flex items-center gap-2 py-1">
                    <span className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151]">
                      {app.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          {pickedAddons.length > 0 && (
            <div className="mt-2 pt-3 border-t" style={{ borderColor: "#e5e7eb" }}>
              <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-2">
                Add-Ons
              </p>
              {pickedAddons.map((slug) => {
                const addon = addons.find((a) => a.slug === slug);
                if (!addon) return null;
                return (
                  <div key={slug} className="font-[family-name:var(--font-dm-sans)] text-[12.5px] text-[#374151] py-1">
                    {addon.name}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#9ca3af] mt-4 text-pretty">
        Complete all steps to receive a tailored proposal from our team.
      </p>
    </aside>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export default function MultiStepFormRenderer({ formSlug, apiBase }: Props) {
  const baseUrl = apiBase ?? API_BASE;
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`${baseUrl}/forms/${formSlug}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((body) => {
        if (!alive) return;
        const attrs = body?.data?.attributes;
        if (!attrs) throw new Error("Unexpected schema response");
        setSchema(attrs as FormSchema);
      })
      .catch((e) => {
        if (!alive) return;
        setLoadError(e.message ?? "Failed to load form");
      });
    return () => {
      alive = false;
    };
  }, [baseUrl, formSlug]);

  const steps: StepDef[] = useMemo(() => {
    if (!schema) return [];
    if (schema.use_multi_step && schema.steps) return schema.steps;
    // Single-step fallback — wrap fields in one synthetic step
    return [
      {
        key: "single",
        title: schema.name,
        description: null,
        fields: schema.fields ?? [],
      },
    ];
  }, [schema]);

  const currentStep = steps[step];

  const showSidebar = useMemo(() => {
    return steps.some((s) =>
      s.fields.some((f) =>
        f.field_type === "application_picker" ||
        f.field_type === "addon_picker" ||
        f.field_type === "catalogue_picker"
      )
    );
  }, [steps]);

  const validateStep = (idx: number): boolean => {
    const nextErrors: Record<string, string> = {};
    const fields = steps[idx]?.fields ?? [];
    for (const f of fields) {
      if (!f.required) continue;
      const val = data[f.key];
      // Consent must be explicitly TRUE — `false` (unticked) is the
      // "empty" state for the purpose of required-validation, mirroring
      // Laravel's `accepted` rule on the API side.
      if (f.field_type === "consent") {
        if (val !== true) {
          nextErrors[f.key] = "Please tick this to continue.";
        }
        continue;
      }
      const empty =
        val == null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0);
      if (empty) {
        nextErrors[f.key] = `${f.label} is required.`;
      }
      if (f.field_type === "email" && typeof val === "string" && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          nextErrors[f.key] = "Please enter a valid email.";
        }
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${baseUrl}/forms/${formSlug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          landing_page: typeof window !== "undefined" ? window.location.href : null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const detail =
          body?.errors?.[0]?.detail ??
          body?.errors?.[0]?.title ??
          `Submission failed (HTTP ${res.status}).`;
        setSubmitError(detail);
        return;
      }
      setSubmitted(true);
    } catch (e) {
      setSubmitError((e as Error).message ?? "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render states ──

  if (loadError) {
    return (
      <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
        <div className="max-w-[600px] mx-auto text-center">
          <p className="text-[15px] text-[#ef4444] font-[family-name:var(--font-dm-sans)]">
            Couldn&apos;t load the form: {loadError}
          </p>
        </div>
      </section>
    );
  }
  if (!schema || !currentStep) {
    return (
      <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="inline-block animate-pulse rounded-full w-9 h-9 bg-[#e5e7eb]" />
          <p className="text-[14px] text-[#6b7280] font-[family-name:var(--font-dm-sans)] mt-3">
            Loading…
          </p>
        </div>
      </section>
    );
  }

  // Submitted thank-you screen
  if (submitted) {
    // Both heading and body honour admin-defined templates with
    // {token} interpolation. Renderer fallback only kicks in when
    // schema fields are blank.
    const heading = interpolate(
      schema.success_heading ?? "Proposal Request Sent!",
      data
    );
    const body = interpolate(
      schema.success_message ??
        "Thanks {name}! Our team will review your selections and send a tailored proposal to {email} within 1 business day.",
      data
    );
    return (
      <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
        <div className="max-w-[640px] mx-auto">
          <StepIndicator steps={steps} currentStep={steps.length} />
          <div className="text-center mt-6">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ background: "#d1fae5" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L20 7"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[24px] text-[#0a0f1e] mb-2">
              {heading}
            </h3>
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] leading-[1.75] text-pretty">
              {body}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={formSlug === "build-ehswatch-package" ? "calculator" : `form-${formSlug}`}
      className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white"
    >
      <style>{`
        .calc-card:hover {
          border-color: #93c5fd !important;
          box-shadow: 0 4px 16px rgba(59,130,246,0.10) !important;
        }
        .addon-card:hover {
          border-color: #93c5fd !important;
        }
        .calc-input:focus {
          outline: none;
          border-color: #1d4ed8 !important;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.10);
        }
      `}</style>

      <div className="max-w-[1160px] mx-auto">
        <StepIndicator steps={steps} currentStep={step} />

        <div className={`grid gap-8 ${showSidebar ? "lg:grid-cols-[1fr_320px]" : ""}`}>
          {/* Form body */}
          <div>
            <div className="bg-white">
              <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[22px] text-[#0a0f1e] mb-2">
                Step {step + 1} — {currentStep.title}
              </h3>
              {currentStep.description && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#6b7280] mb-7">
                  {currentStep.description}
                </p>
              )}

              <div className="grid gap-5">
                {currentStep.fields.map((f) => (
                  <div
                    key={f.key}
                    className={f.full_width ? "" : "sm:max-w-[420px]"}
                  >
                    {f.field_type !== "application_picker" && f.field_type !== "addon_picker" && f.field_type !== "consent" && (
                      <label className="block font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#374151] mb-1.5">
                        {f.label}
                        {f.required && <span className="text-[#ef4444] ml-0.5">*</span>}
                      </label>
                    )}
                    <FieldRenderer
                      field={f}
                      value={data[f.key]}
                      onChange={(next) => setData((d) => ({ ...d, [f.key]: next }))}
                      catalogues={schema.picker_catalogues}
                      error={errors[f.key]}
                    />
                    {f.help_text && (
                      <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#9ca3af] mt-1.5">
                        {f.help_text}
                      </p>
                    )}
                    {errors[f.key] && (
                      <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#ef4444] mt-1.5">
                        {errors[f.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {submitError && (
                <div className="mt-6 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
                  <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#b91c1c]">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-gray-50"
                  style={{ borderColor: "#e5e7eb", color: "#374151" }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-white transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundImage:
                        "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                    }}
                  >
                    Continue
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-white transition-all duration-200 disabled:opacity-50"
                    style={{
                      backgroundImage:
                        "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                    }}
                  >
                    {submitting ? "Submitting…" : schema.submit_label ?? "Get My Proposal"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          {showSidebar && <PackageSidebar schema={schema} data={data} />}
        </div>
      </div>
    </section>
  );
}
