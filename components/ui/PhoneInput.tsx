"use client";

import { useEffect, useRef, useState } from "react";
import "intl-tel-input/styles";
import type { FormVariant } from "./DynamicCmsForm";
import { withBasePath } from "@/lib/basePath";
// Kept as a defense-in-depth CSS fallback beneath the <img>-based fix below
// -- costs nothing, and covers the (hopefully unreachable) case where JS
// injection itself somehow fails on some future device.
import flagsPng from "intl-tel-input/dist/img/flags.png";
import flagsPng2x from "intl-tel-input/dist/img/flags@2x.png";
// Client confirmed (real device, Redmi Note 8 Pro, AND a flagship Galaxy S20
// via BrowserStack): flags still blank after THREE rounds of CSS fallbacks
// (-webkit-image-set(), a plain url() to the library's .webp, then importing
// its .png directly). DevTools on the real device confirmed every individual
// piece was correct -- the image request succeeds (200, exact right byte
// size), the element has a real, non-zero box (20x15px), background-image
// resolves to a valid URL, background-position/-size compute to sane values
// -- yet nothing paints. Failing identically on both a budget 2019 phone and
// a 2020 flagship (while every desktop OS works) points at mobile Chrome's
// handling of CSS background-image sprites specifically, not device
// capability or our CSS syntax -- Data Saver/Lite Mode's image-compression
// proxy has documented quirks exactly there, and is enabled by default on
// many Indian carrier/budget-device configurations.
//
// Rather than a 4th CSS patch, sidestepping the whole class of bug: render
// actual <img> elements (individual per-country SVGs, no sprite, no CSS
// background-image at all) instead of trusting intl-tel-input's own sprite
// rendering. <img> is exactly what Data Saver's proxy is built to handle
// well -- it's CSS background-images that have historically been the
// problem case. See injectFlagImages() below.
const FLAG_SRC = (iso2: string): string => withBasePath(`/flags/${iso2}.svg`);

/**
 * intl-tel-input renders every flag via a CSS background-image sprite
 * (.iti__flag). Finds every such element currently in the DOM -- the
 * selected-country display AND, once opened, every row in the dropdown
 * list -- and overlays a real <img> inside each one, sourced from an
 * individual per-country SVG (see FLAG_SRC). Idempotent (checks
 * data-img-injected) so it's safe to call repeatedly from a MutationObserver
 * as the dropdown list mounts/unmounts and the selected country changes.
 */
function injectFlagImages(root: HTMLElement, getSelectedIso2: () => string | undefined): void {
  root.querySelectorAll<HTMLElement>(".iti__flag").forEach((flagEl) => {
    // Dropdown list rows carry their own country on the parent <li
    // data-iso2="..">; the selected-country display has no such row, so
    // it falls back to the widget's current selection -- which DOES change
    // (the user picking a new country), so this re-syncs the <img> rather
    // than a simple "already injected, skip forever" marker.
    const li = flagEl.closest<HTMLElement>("li[data-iso2]");
    // Defensive: a bad getSelectedIso2() call previously threw here and
    // silently aborted injection for every OTHER flag on the page too
    // (Array.prototype.forEach doesn't catch per-iteration) -- one bad
    // element should never take the rest down with it.
    let iso2: string | undefined;
    try {
      iso2 = li?.getAttribute("data-iso2") ?? getSelectedIso2() ?? undefined;
    } catch {
      iso2 = undefined;
    }
    if (!iso2) return;
    const existing = flagEl.querySelector<HTMLImageElement>("img[data-flag-img]");
    if (existing) {
      if (existing.getAttribute("data-flag-img") !== iso2) {
        existing.setAttribute("data-flag-img", iso2);
        existing.src = FLAG_SRC(iso2);
      }
      return;
    }
    const img = document.createElement("img");
    img.setAttribute("data-flag-img", iso2);
    img.src = FLAG_SRC(iso2);
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    img.style.cssText = "display:block;width:100%;height:100%;object-fit:cover;border-radius:1px;";
    flagEl.appendChild(img);
  });
}

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
  const wrapRef = useRef<HTMLSpanElement>(null);
  const itiRef = useRef<any>(null);
  const onValueRef = useRef(onValue);
  onValueRef.current = onValue;
  const [fullNumber, setFullNumber] = useState(defaultValue ?? "");

  useEffect(() => {
    const el = inputRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    let iti: any;

    // Runs on every DOM change inside the widget -- covers the initial
    // selected-country flag (mounts once) and the dropdown list's flags
    // (mount fresh each time it's opened, per intl-tel-input's own lazy
    // rendering), without needing to hook every possible open/close event.
    const runInject = () => injectFlagImages(wrap, () => itiRef.current?.getSelectedCountry()?.iso2);
    const flagObserver = new MutationObserver(runInject);
    flagObserver.observe(wrap, { childList: true, subtree: true });

    import("intl-tel-input").then(({ default: intlTelInput }) => {
      if (!inputRef.current) return;
      iti = intlTelInput(inputRef.current, {
        // Client-caught (DevTools console, live device test): this used to
        // try detecting the visitor's country via Cloudflare's /cdn-cgi/trace
        // endpoint, which only exists on a Cloudflare-proxied site. This
        // deployment sits behind plain nginx, not Cloudflare (confirmed: no
        // cf-ray header) -- the fetch 404s on every single page load,
        // logging a console error, and the detection ALWAYS silently fell
        // back to India anyway. Just defaulting to India directly is
        // honest about what actually happens today and drops the wasted
        // request + error. Real geo-detection would need an actual
        // geo-IP service wired in, out of scope for this fix.
        initialCountry: "in",
        separateDialCode: true,
        loadUtils: () => import("intl-tel-input/utils"),
        // Client-caught (Android): the library's own auto-generated example-
        // number placeholder rendered a malformed value
        // ("+91 -1 000 000 000") -- likely a race with the async utils/
        // country-detection above. Overriding it to always return our own
        // simple placeholder sidesteps the whole class of bug rather than
        // chasing the exact metadata glitch.
        customPlaceholder: () => placeholder ?? "Phone number",
      });
      itiRef.current = iti;
      // Seed a previously-entered value when the widget re-mounts (wizard steps).
      if (defaultValue) {
        try { iti.setNumber(defaultValue); } catch { /* ignore */ }
      }
      // The MutationObserver above only fires on FUTURE DOM changes; this
      // widget's own init mutation may already have landed by the time the
      // dynamic import resolves, so run once directly too (idempotent).
      runInject();
    });

    const sync = () => {
      const v = itiRef.current?.getNumber() ?? "";
      setFullNumber(v);
      onValueRef.current?.(v);
      // Re-syncs the selected-country <img> to whatever the user just
      // picked -- the dropdown rows never change country once rendered,
      // but the closed/selected display does, every time.
      runInject();
    };

    el.addEventListener("input", sync);
    el.addEventListener("countrychange", sync);

    return () => {
      el.removeEventListener("input", sync);
      el.removeEventListener("countrychange", sync);
      flagObserver.disconnect();
      itiRef.current?.destroy();
      itiRef.current = null;
    };
  }, []);

  const isSupport = variant === "support";

  return (
    <span ref={wrapRef} className={isSupport ? "iti-wrap iti-support" : "iti-wrap iti-contact"}>
      <style>{`
        /* The number entry, the "+NN" dial-code prefix, and the country dropdown
           are inherently LTR — force those PARTS so digits, the prefix, and the
           country list always read correctly even in Arabic/RTL (FE QA #16).
           The whole widget is forced LTR so the flag + dial-code stay on the
           LEFT of the field and the number reads left-to-right, even in Arabic
           (a phone number is inherently LTR; the client asked the country code
           NOT to shift to the right in RTL). */
        .iti-wrap .iti { direction: ltr; }
        /* Keep the flag + chevron + dial-code cluster in its natural LTR order. */
        .iti-wrap .iti__country-container { direction: ltr; }
        .iti-wrap input[type="tel"] { direction: ltr; }
        .iti-wrap .iti__country-list,
        .iti-wrap .iti__dropdown-content { direction: ltr; text-align: left; }
        .iti-wrap .iti__country { text-align: left; }
        /* intl-tel-input renders the "+91" dial-code prefix at 16px, larger than
           the 14px input/placeholder — match it (and keep it LTR) so it isn't
           oversized or reversed. */
        .iti-wrap .iti__selected-dial-code { direction: ltr; font-size: 14px; }
        /* Client-caught (Android, confirmed on a real Redmi Note 8 Pro):
           flags still blank after BOTH a -webkit-image-set() fallback AND a
           plain url() referencing the library's own .webp asset -- the file
           itself is valid (checked: correct magic bytes, correct
           Content-Type: image/webp) and this works fine on desktop, so it
           was never a CSS syntax problem. Likely webp-specific: either a
           genuinely old browser build, or (common on budget Indian Android
           devices) Chrome's Data Saver / Lite mode routing images through a
           compression proxy with known quirks around CSS background-images
           specifically. .png has zero format ambiguity anywhere -- true
           universal base layer, imported directly rather than trusting the
           library's own (webp-only) CSS vars. Declaration order is the
           fallback chain, weakest-first: .png url() (true universal) ->
           .webp url() -> -webkit-image-set() -> the library's own bare
           image-set() elsewhere in its stylesheet (modern browsers,
           sharpest, already later in the cascade). */
        .iti-wrap .iti__flag {
          background-image: url(${flagsPng.src});
          background-image: var(--iti-path-flags-1x);
          background-image: -webkit-image-set(var(--iti-path-flags-1x) 1x, var(--iti-path-flags-2x) 2x);
        }
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .iti-wrap .iti__flag { background-image: url(${flagsPng2x.src}); }
        }
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
