"use client";

import { useState, useRef } from "react";
import TurnstileField from "@/components/ui/TurnstileField";
import PhoneInput, { isPhoneField } from "@/components/ui/PhoneInput";
import type { CmsForm, CmsFormField } from "@/lib/types";

export type FormVariant = "contact" | "support";

/* Dropdown (<select>) options are shown alphabetically (A→Z), with two guards:
   - numeric collation keeps range/size values in their natural order
     (1, 2–5, 6–20 … and < 50, 50–200, 201–1000 …), so those dropdowns aren't
     scrambled into alphabetical nonsense;
   - catch-all values (Other, None, N/A, "Prefer not to say" …) are pushed last.
   Scoped to select fields only — radio/checkbox orders (e.g. Low→Urgent) are
   semantic and stay exactly as authored in the CMS. */
const CATCHALL_LAST = /^(others?|none|n\/?a|not applicable|prefer not)\b/i;
function sortOptions(opts: string[]): string[] {
  return [...opts].sort((a, b) => {
    const ca = CATCHALL_LAST.test(a.trim());
    const cb = CATCHALL_LAST.test(b.trim());
    if (ca !== cb) return ca ? 1 : -1;
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  });
}

interface DynamicCmsFormProps {
  formAttrs: CmsForm["attributes"];
  slug: string;
  variant?: FormVariant;
  onSuccess?: () => void;
}

/* ── Per-variant style tokens ── */
const STYLES: Record<FormVariant, {
  inputBase: string;
  wrapBase: string;
  wrapError: string;
  labelClass: string;
  showLabel: boolean;
}> = {
  contact: {
    // Boxed fields with a visible caption, matching the Pricing wizard (FE QA #7):
    // rounded border on white, label above each field.
    inputBase:
      "w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0a0f1e] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/10 transition-all",
    wrapBase: "",
    wrapError: "ring-2 ring-red-300 rounded-xl",
    labelClass:
      "block font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#374151] mb-1.5",
    showLabel: true,
  },
  support: {
    inputBase:
      "w-full rounded-[8px] border border-[#d1d9e6] bg-white px-4 py-[10px] font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0f1728] placeholder:text-[#a0aec0] focus:outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/10 transition-all",
    wrapBase: "",
    wrapError:
      "ring-2 ring-red-300 rounded-[8px]",
    labelClass:
      "block font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase mb-1.5",
    showLabel: true,
  },
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-[12px] text-red-500 font-[family-name:var(--font-dm-sans)]">
      {message}
    </p>
  );
}

function FieldWidget({
  field,
  variant,
  error,
  pickerCatalogues,
}: {
  field: CmsFormField;
  variant: FormVariant;
  error?: string;
  pickerCatalogues?: Record<string, Array<{ slug: string; name: string }>>;
}) {
  const { inputBase, wrapBase, wrapError, labelClass, showLabel } = STYLES[variant];
  const wrapClass = error ? wrapError : wrapBase;
  const inputClass = error
    ? inputBase.replace(/border-\[#[0-9a-fA-F]+\]/, "border-red-400")
    : inputBase;
  const placeholder = field.placeholder ?? field.label;

  const label = showLabel ? (
    <label className={labelClass}>
      {field.label}
      {field.required && <span className="text-[#e53e3e] ml-0.5">*</span>}
    </label>
  ) : null;

  const helpText = field.help_text ? (
    <p className="mt-1 text-[12px] text-[#6b7280] font-[family-name:var(--font-dm-sans)]">
      {field.help_text}
    </p>
  ) : null;

  if (field.field_type === "textarea") {
    return (
      <div>
        {label}
        <div className={wrapClass}>
          <textarea
            name={field.key}
            placeholder={placeholder}
            rows={5}
            className={inputBase + " resize-none"}
          />
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  if (field.field_type === "select") {
    return (
      <div>
        {label}
        <div className={`relative ${wrapClass}`}>
          <select
            name={field.key}
            defaultValue=""
            className={inputBase + " cursor-pointer appearance-none pr-10"}
          >
            <option value="" disabled>
              {field.placeholder ?? `Select ${field.label}`}
            </option>
            {/* Options sorted A→Z (see sortOptions above). Placeholder is untouched. */}
            {sortOptions(field.options ?? []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* Custom chevron — appearance-none hides the native one. */}
          <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  if (field.field_type === "radio") {
    return (
      <div>
        <label className={labelClass}>
          {field.label}
          {field.required && <span className="text-[#e53e3e] ml-0.5">*</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#374151] cursor-pointer"
            >
              <input type="radio" name={field.key} value={opt} className="accent-[#155eef]" />
              {opt}
            </label>
          ))}
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  if (field.field_type === "checkboxes") {
    return (
      <div>
        <label className={labelClass}>
          {field.label}
          {field.required && <span className="text-[#e53e3e] ml-0.5">*</span>}
        </label>
        <div className="flex flex-col gap-2">
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#374151] cursor-pointer"
            >
              <input type="checkbox" name={field.key} value={opt} className="accent-[#155eef]" />
              {opt}
            </label>
          ))}
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  if (field.field_type === "consent") {
    return (
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name={field.key} value="true" className="mt-0.5 accent-[#155eef]" />
          <span className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#374151] leading-[1.6]">
            {field.label}
            {field.required && <span className="text-[#e53e3e] ml-0.5">*</span>}
          </span>
        </label>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  /* phone / tel (by type OR field name) → intl-tel-input widget */
  if (isPhoneField(field)) {
    return (
      <div>
        {label}
        <div className={wrapClass}>
          <PhoneInput
            name={field.key}
            required={field.required}
            placeholder={placeholder}
            variant={variant}
          />
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  if (field.field_type === "date") {
    return (
      <div>
        {label}
        <div className={wrapClass}>
          <input type="date" name={field.key} className={inputClass} />
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  /* Plain phone — no country picker (the `phone` type gets the intl widget
     above via isPhoneField). type="tel" gives a numeric keypad on mobile. */
  if (field.field_type === "phone_plain") {
    return (
      <div>
        {label}
        <div className={wrapClass}>
          <input type="tel" name={field.key} placeholder={placeholder} className={inputClass} />
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  if (field.field_type === "file") {
    return (
      <div>
        {label}
        <div className={wrapClass}>
          <input
            type="file"
            name={field.key}
            className={inputClass + " cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-[#eef2f7] file:px-3 file:py-1.5 file:text-[13px] file:font-medium file:text-[#374151]"}
          />
        </div>
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  /* Pricing/catalogue pickers — multi-select from the inlined picker_catalogues
     (application_picker -> applications, addon_picker -> addons,
     catalogue_picker -> the field's catalogue_slug). Submits an array of slugs. */
  if (
    field.field_type === "application_picker" ||
    field.field_type === "addon_picker" ||
    field.field_type === "catalogue_picker"
  ) {
    const catKey =
      field.field_type === "application_picker" ? "applications"
      : field.field_type === "addon_picker" ? "addons"
      : (field.catalogue_slug ?? "");
    const items = pickerCatalogues?.[catKey] ?? [];
    return (
      <div>
        <label className={labelClass}>
          {field.label}
          {field.required && <span className="text-[#e53e3e] ml-0.5">*</span>}
        </label>
        {items.length === 0 ? (
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280]">
            No options available.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((it) => (
              <label
                key={it.slug}
                className="flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#374151] cursor-pointer"
              >
                <input type="checkbox" name={field.key} value={it.slug} className="accent-[#155eef]" />
                {it.name}
              </label>
            ))}
          </div>
        )}
        {helpText}
        <FieldError message={error} />
      </div>
    );
  }

  /* text, email, url, number */
  const htmlType =
    field.field_type === "email" ? "email"
    : field.field_type === "url" ? "url"
    : field.field_type === "number" ? "number"
    : "text";

  return (
    <div>
      {label}
      <div className={wrapClass}>
        <input
          type={htmlType}
          name={field.key}
          placeholder={placeholder}
          className={inputClass}
        />
      </div>
      {helpText}
      <FieldError message={error} />
    </div>
  );
}

/* Field width is driven SOLELY by the CMS `full_width` toggle, for every field
   type: on → spans the full row (col-span-2), off → half width (col-span-1) and
   packs 2-up in the grid. No field type is force-full anymore. */

/* ── Client-side validation ── */
function validateFields(
  fields: CmsFormField[],
  fd: FormData,
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (field.field_type === "hidden") continue;
    if (!field.required) continue;

    const label = field.label || field.key;

    if (["checkboxes", "application_picker", "addon_picker", "catalogue_picker"].includes(field.field_type)) {
      if (fd.getAll(field.key).length === 0) {
        errors[field.key] = `Please select at least one option for ${label}.`;
      }
      continue;
    }

    if (field.field_type === "consent") {
      if (!fd.get(field.key)) {
        errors[field.key] = `You must accept ${label} to continue.`;
      }
      continue;
    }

    const val = ((fd.get(field.key) as string) ?? "").trim();

    if (!val) {
      errors[field.key] = `${label} is required.`;
      continue;
    }

    if (field.field_type === "email") {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRe.test(val)) {
        errors[field.key] = "Enter a valid email address.";
      }
    }

    if (isPhoneField(field) && val.replace(/\D/g, "").length < 7) {
      errors[field.key] = "Enter a valid phone number.";
    }
  }

  return errors;
}

export default function DynamicCmsForm({
  formAttrs,
  slug,
  variant = "contact",
  onSuccess,
}: DynamicCmsFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // Multi-step: the API sends steps[] (each with its own fields) instead of
  // fields[]. All steps stay mounted (hidden with CSS) so a single FormData
  // read at submit time captures every step's inputs.
  const steps =
    formAttrs.use_multi_step && (formAttrs.steps?.length ?? 0) > 0
      ? formAttrs.steps!
      : null;
  const allFields = steps
    ? steps.flatMap((s) => s.fields ?? [])
    : (formAttrs.fields ?? []);
  const visibleFields = allFields.filter((f) => f.field_type !== "hidden");
  const isLastStep = !steps || stepIdx === steps.length - 1;

  const stepOfField = (key: string): number => {
    if (!steps) return 0;
    return Math.max(0, steps.findIndex((s) => (s.fields ?? []).some((f) => f.key === key)));
  };

  const scrollToField = (key: string) => {
    const el = formRef.current?.querySelector(`[name="${key}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const goBack = () => {
    setServerError(null);
    setStepIdx((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    if (!steps || !formRef.current) return;
    setServerError(null);
    const fd = new FormData(formRef.current);
    const stepFields = (steps[stepIdx].fields ?? []).filter((f) => f.field_type !== "hidden");
    const stepErrors = validateFields(stepFields, fd);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      scrollToField(Object.keys(stepErrors)[0]);
      return;
    }
    setErrors({});
    setStepIdx((i) => Math.min(steps.length - 1, i + 1));
  };
  const successHeading = formAttrs.success_heading || "Message Received";
  const successMessage =
    formAttrs.success_message || "Thank you! We'll be in touch shortly.";
  const submitLabel = formAttrs.submit_label || "Send Message";
  const siteKey =
    formAttrs.captcha?.site_key ||
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    "1x00000000000000000000AA";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const fd = new FormData(e.currentTarget);

    /* Client-side validation */
    const fieldErrors = validateFields(visibleFields, fd);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      /* Jump to the step holding the first error, then scroll to it */
      const firstKey = Object.keys(fieldErrors)[0];
      if (steps) setStepIdx(stepOfField(firstKey));
      scrollToField(firstKey);
      return;
    }
    setErrors({});

    if (!captchaToken) {
      setServerError("Please complete the CAPTCHA verification.");
      return;
    }

    /* Build payload — seed with captured first-touch UTM/attribution so the
       CMS records lead source (extractUtm reads these top-level keys). */
    const { getStoredUtm } = await import("@/lib/utm");
    const utm = getStoredUtm();
    // Hidden UTM/attribution fields carry CMS placeholder tokens like
    // "{utm_source}". Resolve them against the captured first-touch
    // attribution; drop any token that stays unresolved so we never submit
    // the literal "{utm_source}" string (which would clobber the real value
    // seeded from getStoredUtm()).
    const resolveVal = (key: string, raw: FormDataEntryValue | null): FormDataEntryValue | null => {
      if (typeof raw === "string") {
        const m = raw.trim().match(/^\{([a-zA-Z_][\w]*)\}$/);
        if (m) {
          const u = utm as Record<string, string | undefined>;
          return u[m[1]] ?? u[key] ?? null;
        }
      }
      return raw;
    };
    const ARRAY_TYPES = new Set(["checkboxes", "application_picker", "addon_picker", "catalogue_picker"]);
    const hasFileField = allFields.some((f) => f.field_type === "file");

    let payload: Record<string, unknown> | FormData;
    if (hasFileField) {
      // A file field is present — send multipart so the actual bytes reach the
      // server (FormSubmitController stores them on the private disk). Arrays go
      // as key[] (Laravel parses them back into an array), files as the File.
      const p = new FormData();
      p.append("captcha_token", captchaToken);
      for (const [k, v] of Object.entries(utm)) {
        if (v != null && v !== "") p.append(k, String(v));
      }
      for (const field of allFields) {
        if (ARRAY_TYPES.has(field.field_type)) {
          for (const v of fd.getAll(field.key)) p.append(`${field.key}[]`, v as string | Blob);
        } else {
          const val = resolveVal(field.key, fd.get(field.key));
          if (val instanceof File) {
            if (val.size > 0 && val.name) p.append(field.key, val, val.name);
          } else if (val !== null) {
            p.append(field.key, val as string);
          }
        }
      }
      payload = p;
    } else {
      const data: Record<string, unknown> = { captcha_token: captchaToken, ...utm };
      for (const field of allFields) {
        if (ARRAY_TYPES.has(field.field_type)) {
          data[field.key] = fd.getAll(field.key);
        } else {
          const val = resolveVal(field.key, fd.get(field.key));
          if (val !== null && !(val instanceof File)) data[field.key] = val;
        }
      }
      payload = data;
    }

    setSubmitting(true);
    try {
      const { submitForm } = await import("@/lib/api");
      const result = await submitForm(slug, payload);

      if (!result.ok && result.errors) {
        /* Map server validation errors back to fields */
        const serverFieldErrors: Record<string, string> = {};
        for (const err of result.errors) {
          const pointer = err.source?.pointer?.replace(/^\//, "") ?? "";
          if (pointer) serverFieldErrors[pointer] = err.detail ?? err.title;
          else setServerError(err.detail ?? err.title ?? "Submission failed.");
        }
        if (Object.keys(serverFieldErrors).length > 0) {
          setErrors(serverFieldErrors);
          const firstKey = Object.keys(serverFieldErrors)[0];
          if (steps) setStepIdx(stepOfField(firstKey));
          scrollToField(firstKey);
        }
        return;
      }

      setSubmitted(true);
      onSuccess?.();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[#EEF4FF] flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] text-[#0a0f1e]">
          {successHeading}
        </h3>
        <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] max-w-[320px] leading-[1.7]">
          {successMessage}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            formRef.current?.reset();
            setCaptchaToken(null);
            setErrors({});
            setStepIdx(0);
          }}
          className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#1d4ed8] hover:underline cursor-pointer"
        >
          Submit another response
        </button>
      </div>
    );
  }

  const gapClass = variant === "contact" ? "gap-10" : "gap-4";

  const renderRows = (fields: CmsFormField[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
      {fields
        .filter((f) => f.field_type !== "hidden")
        .map((field) => (
          <div key={field.key} className={field.full_width ? "sm:col-span-2" : ""}>
            <FieldWidget
              field={field}
              variant={variant}
              error={errors[field.key]}
              pickerCatalogues={formAttrs.picker_catalogues}
            />
          </div>
        ))}
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className={`flex flex-col ${gapClass}`}>
      {steps ? (
        <>
          {/* Step indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            {steps.map((s, i) => (
              <div key={s.key ?? i} className="flex items-center gap-2">
                {i > 0 && <span className="w-6 h-[1.5px] bg-[#e5e7eb] inline-block" />}
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold font-[family-name:var(--font-dm-sans)]"
                  style={{
                    background: i <= stepIdx ? "#1d4ed8" : "#eef2f7",
                    color: i <= stepIdx ? "#fff" : "#94a3b8",
                    transition: "background 0.25s ease",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold hidden sm:inline"
                  style={{ color: i === stepIdx ? "#0a0f1e" : "#94a3b8" }}
                >
                  {s.title || `Step ${i + 1}`}
                </span>
              </div>
            ))}
          </div>

          {/* Step description */}
          {steps[stepIdx].description && (
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] -mt-4">
              {steps[stepIdx].description}
            </p>
          )}

          {/* All steps stay mounted so FormData sees every input; only the
              active one is visible */}
          {steps.map((s, i) => (
            <div key={s.key ?? i} className={i === stepIdx ? `flex flex-col ${gapClass}` : "hidden"}>
              {renderRows(s.fields ?? [])}
            </div>
          ))}
        </>
      ) : (
        renderRows(visibleFields)
      )}

      {/* Hidden fields render as real <input type="hidden"> (they are filtered
          out of the visible rows) so their configured default value is captured
          by FormData at submit. */}
      {allFields
        .filter((f) => f.field_type === "hidden")
        .map((f) => (
          <input key={f.key} type="hidden" name={f.key} defaultValue={f.default_value ?? ""} />
        ))}

      <div className={isLastStep ? "" : "hidden"}>
        <TurnstileField
          siteKey={siteKey}
          onToken={setCaptchaToken}
          onExpire={() => setCaptchaToken(null)}
        />
      </div>

      {serverError && (
        <p className="text-[13px] text-red-500 font-[family-name:var(--font-dm-sans)]">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-3">
        {steps && stepIdx > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-[#374151] border border-[#e5e7eb] hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        )}

        {!isLastStep ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-white transition-all duration-200 cursor-pointer"
            style={{
              backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
            }}
          >
            Continue
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-white transition-all duration-200"
            style={{
              backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Sending…" : submitLabel}
            {!submitting && (
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
