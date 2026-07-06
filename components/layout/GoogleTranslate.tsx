"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; includedLanguages?: string; autoDisplay?: boolean },
          elementId: string,
        ) => unknown;
      };
    };
  }
}

const wantsArabic = () => /(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie);

/**
 * Poll for Google's hidden language <select> (it appears a beat after the
 * widget script initialises) and apply the given language. Retries for a few
 * seconds so a fresh page load reliably translates even on a slow script load.
 */
function applyLanguage(lang: "en" | "ar", attempts = 20) {
  const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
  if (combo) {
    if (combo.value !== lang) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
    }
    return;
  }
  if (attempts > 0) setTimeout(() => applyLanguage(lang, attempts - 1), 250);
}

/**
 * Headless Google Translate integration.
 *
 * The widget element is rendered OFF-SCREEN (not display:none) — Google's
 * combo will not initialise or operate inside a display:none host, which was
 * why translation silently failed after load. All of Google's visible chrome
 * (banner, tooltip, balloon) is suppressed via CSS instead.
 */
export default function GoogleTranslate() {
  const pathname = usePathname();

  // Re-apply the chosen language after client-side navigation (Next swaps page
  // content without a reload, so new pages arrive untranslated).
  useEffect(() => {
    if (wantsArabic()) applyLanguage("ar");
  }, [pathname]);

  useEffect(() => {
    if (document.getElementById("gt-script")) {
      if (wantsArabic()) applyLanguage("ar");
      return;
    }

    // Google Translate re-parents text nodes into <font> wrappers, which makes
    // React's removeChild/insertBefore throw during re-renders. These guards
    // turn the mismatched-parent case into a no-op instead of a crash.
    if (!(window as unknown as { __gtDomGuard?: boolean }).__gtDomGuard) {
      (window as unknown as { __gtDomGuard?: boolean }).__gtDomGuard = true;
      const origRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
        if (child.parentNode !== this) return child;
        return origRemoveChild.call(this, child) as T;
      };
      const origInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
        if (ref && ref.parentNode !== this) return node;
        return origInsertBefore.call(this, node, ref) as T;
      };
    }

    // Suppress Google's visible chrome (but NOT the combo/host element itself)
    const style = document.createElement("style");
    style.id = "gt-style";
    style.textContent = `
      .goog-te-banner-frame, .goog-te-banner-frame.skiptranslate, iframe.skiptranslate,
      #goog-gt-tt, .goog-te-balloon-frame, .goog-te-spinner-pos { display: none !important; visibility: hidden !important; }
      body { top: 0 !important; position: static !important; }
      .goog-text-highlight { background: none !important; box-shadow: none !important; }
      font { background: none !important; box-shadow: none !important; }
    `;
    document.head.appendChild(style);

    window.googleTranslateElementInit = () => {
      try {
        const TE = window.google?.translate?.TranslateElement;
        if (TE) {
          new TE(
            { pageLanguage: "en", includedLanguages: "en,ar", autoDisplay: false },
            "google_translate_element",
          );
          // Apply the persisted choice once the combo is ready
          if (wantsArabic()) applyLanguage("ar");
        }
      } catch {
        /* network-blocked or script race — site simply stays untranslated */
      }
    };

    const s = document.createElement("script");
    s.id = "gt-script";
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // Off-screen but rendered — the widget needs a laid-out host to initialise.
  return (
    <div
      id="google_translate_element"
      aria-hidden
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    />
  );
}
