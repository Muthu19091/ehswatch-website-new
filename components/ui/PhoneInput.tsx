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
      requestAnimationFrame(rtlFix);
    });

    // intl-tel-input pins the flag/dial-code container to the LEFT
    // (.iti__country-container { left: 0 }) and sets the input's padding-left
    // inline to the container's width — so `direction: rtl` alone can't move it.
    // Under RTL we want the country code on the RIGHT, matching the rest of the
    // Arabic form, so after init (and whenever the country changes, which resizes
    // the container) we flip the container to the right and move the reserved
    // space over to padding-right. No-op in LTR / English.
    const rtlFix = () => {
      const itiEl = el.closest(".iti") as HTMLElement | null;
      const container = itiEl?.querySelector(".iti__country-container") as HTMLElement | null;
      if (!itiEl || !container) return;
      if (getComputedStyle(itiEl).direction !== "rtl") return;
      container.style.left = "auto";
      container.style.right = "0";
      const w = container.offsetWidth;
      if (w > 0) {
        el.style.paddingRight = `${w}px`;
        el.style.paddingLeft = "16px";
      }
    };

    const sync = () => {
      const v = itiRef.current?.getNumber() ?? "";
      setFullNumber(v);
      onValueRef.current?.(v);
      requestAnimationFrame(rtlFix);
    };

    el.addEventListener("input", sync);
    el.addEventListener("countrychange", sync);
    // Catch the async country lookup + flag render settling after mount.
    const rtlTimers = [200, 600, 1200].map((t) => window.setTimeout(rtlFix, t));

    return () => {
      el.removeEventListener("input", sync);
      el.removeEventListener("countrychange", sync);
      rtlTimers.forEach(clearTimeout);
      itiRef.current?.destroy();
      itiRef.current = null;
    };
  }, []);

  const isSupport = variant === "support";

  return (
    <span className={isSupport ? "iti-wrap iti-support" : "iti-wrap iti-contact"}>
      <style>{`
        /* The number entry, the "+NN" dial-code prefix, and the country dropdown
           are inherently LTR — force those PARTS so digits, the prefix, and the
           country list always read correctly even in Arabic/RTL (FE QA #16).
           The WRAPPER itself follows the page direction, so under RTL the flag +
           dial-code sit on the RIGHT of the field (matching the other RTL form
           fields) instead of always on the left. */
        .iti-wrap .iti { direction: inherit; }
        /* Keep the flag + chevron + dial-code cluster in its natural LTR order so
           the gaps between them are correct even in Arabic (otherwise RTL leaves
           an uneven gap between the chevron and the flag). The cluster is still
           positioned on the RIGHT of the field in RTL by rtlFix() above. */
        .iti-wrap .iti__country-container { direction: ltr; }
        .iti-wrap input[type="tel"] { direction: ltr; }
        .iti-wrap .iti__country-list,
        .iti-wrap .iti__dropdown-content { direction: ltr; text-align: left; }
        .iti-wrap .iti__country { text-align: left; }
        /* intl-tel-input renders the "+91" dial-code prefix at 16px, larger than
           the 14px input/placeholder — match it (and keep it LTR) so it isn't
           oversized or reversed. */
        .iti-wrap .iti__selected-dial-code { direction: ltr; font-size: 14px; }
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
