"use client";

import { useEffect } from "react";

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

/**
 * Headless Google Translate integration.
 *
 * Loads the translate element into a hidden container; the actual language
 * choice is driven by the `googtrans` cookie, which LanguageSwitcher sets
 * before reloading. All of Google's own UI (top banner, tooltips, balloon)
 * is suppressed so the site design stays untouched.
 */
export default function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById("gt-script")) return;

    // Suppress every piece of Google Translate chrome
    const style = document.createElement("style");
    style.id = "gt-style";
    style.textContent = `
      .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame,
      iframe.skiptranslate, .goog-te-spinner-pos { display: none !important; }
      body { top: 0 !important; }
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

  return <div id="google_translate_element" style={{ display: "none" }} aria-hidden />;
}
