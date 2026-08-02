"use client";

import { useEffect, useRef, useState } from "react";
import "intl-tel-input/styles";
import type { FormVariant } from "./DynamicCmsForm";

interface Props {
  name: string;
  required?: boolean;
  placeholder?: string;
  variant?: FormVariant;
  /** Called with the full E.164 number whenever it changes (for controlled forms). */
  onValue?: (value: string) => void;
  /** Seed the field (controlled forms re-mounting the widget across steps). */
  defaultValue?: string;
}

/**
 * A field is treated as a phone field — and gets the country-code widget — when
 * its CMS type is phone/tel OR its name/label looks like a phone field. This
 * keeps the dial-code selector on every form's phone field regardless of how
 * the field_type was configured in the CMS.
 */
export function isPhoneField(field: {
  field_type?: string | null;
  label?: string | null;
  key?: string | null;
}): boolean {
  // Country-code widget shows ONLY for the explicit "phone" field type
  // (and its "tel" synonym) — never for "phone_plain" or a name/label guess.
  const t = (field.field_type || "").toLowerCase();
  return t === "phone" || t === "tel";
}

export default function PhoneInput({ name, required, placeholder, variant = "contact", onValue, defaultValue }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<any>(null);
  const onValueRef = useRef(onValue);
  onValueRef.current = onValue;
  const [fullNumber, setFullNumber] = useState(defaultValue ?? "");

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    let iti: any;

    import("intl-tel-input").then(({ default: intlTelInput }) => {
      if (!inputRef.current) return;
      iti = intlTelInput(inputRef.current, {
        // Detect the visitor's country from Cloudflare's same-origin trace
        // endpoint (site is CF-fronted); fall back to India when unavailable.
        initialCountry: "",
        initialCountryLookup: async () => {
          try {
            const t = await fetch(`${window.location.origin}/cdn-cgi/trace`).then((r) => r.text());
            const loc = t.match(/^loc=([A-Z]{2})$/m)?.[1];
            return (loc && loc !== "XX" ? loc.toLowerCase() : "in") as never;
          } catch {
            return "in" as never;
          }
        },
        separateDialCode: true,
        loadUtils: () => import("intl-tel-input/utils"),
      });
      itiRef.current = iti;
      // Seed a previously-entered value when the widget re-mounts (wizard steps).
      if (defaultValue) {
        try { iti.setNumber(defaultValue); } catch { /* ignore */ }
      }
    });

    const sync = () => {
      const v = itiRef.current?.getNumber() ?? "";
      setFullNumber(v);
      onValueRef.current?.(v);
    };

    el.addEventListener("input", sync);
    el.addEventListener("countrychange", sync);

    return () => {
      el.removeEventListener("input", sync);
      el.removeEventListener("countrychange", sync);
      itiRef.current?.destroy();
      itiRef.current = null;
    };
  }, []);

  const isSupport = variant === "support";

  return (
    <span dir="ltr" className={isSupport ? "iti-wrap iti-support" : "iti-wrap iti-contact"}>
      <style>{`
        /* Phone numbers + the country dropdown are inherently LTR — force it so
           the widget and its country list render correctly in Arabic/RTL (FE QA #16). */
        .iti-wrap, .iti-wrap * { direction: ltr; }
        .iti-wrap .iti__country-list, .iti-wrap .iti__dropdown-content { text-align: left; }
        /* intl-tel-input renders the "+91" dial-code prefix at 16px, larger than
           the 14px input/placeholder — match it so it isn't oversized. */
        .iti-wrap .iti__selected-dial-code { font-size: 14px; }
        .iti-support { display: block; width: 100%; }
        .iti-support .iti { width: 100%; }
        .iti-support input[type="tel"] {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #d1d9e6;
          background: #fff;
          padding-top: 10px;
          padding-bottom: 10px;
          padding-right: 16px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          color: #0f1728;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .iti-support input[type="tel"]::placeholder { color: #a0aec0; }
        .iti-support input[type="tel"]:focus {
          border-color: #155eef;
          box-shadow: 0 0 0 2px rgba(21, 94, 239, 0.1);
        }

        /* Contact variant — boxed to match the other contact fields (rounded
           border on white, the Pricing-style boxed inputs). */
        .iti-contact { display: block; width: 100%; }
        .iti-contact .iti { width: 100%; }
        .iti-contact input[type="tel"] {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #fff;
          padding-top: 12px;
          padding-bottom: 12px;
          padding-right: 16px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 14px;
          color: #0a0f1e;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .iti-contact input[type="tel"]::placeholder { color: #9ca3af; }
        .iti-contact input[type="tel"]:focus {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.1);
        }
      `}</style>
      <input
        ref={inputRef}
        type="tel"
        required={required}
        placeholder={placeholder ?? "Phone number"}
      />
      <input type="hidden" name={name} value={fullNumber} />
    </span>
  );
}
