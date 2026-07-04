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

/**
 * Headless Google Translate integration.
 *
 * Loads the translate element into a hidden container; the actual language
 * choice is driven by the `googtrans` cookie, which LanguageSwitcher sets
 * before reloading. All of Google's own UI (top banner, tooltips, balloon)
 * is suppressed so the site design stays untouched.
 */
export default function GoogleTranslate() {
  const pathname = usePathname();

  // Re-translate after client-side navigation: Next swaps the page content
  // without a reload, so newly rendered pages arrive in English. When the
  // googtrans cookie says Arabic, nudge the widget once the new DOM settles.
  useEffect(() => {
    if (!/(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie)) return;
    const timer = setTimeout(() => {
      const combo = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
      if (combo) {
        combo.value = "ar";
        combo.dispatchEvent(new Event("change"));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (document.getElementById("gt-script")) return;

    // Google Translate re-parents text nodes into <font> wrappers, which
    // makes React's removeChild/insertBefore throw during re-renders
    // (animated sections re-render constantly). These guards make those
    // operations no-ops when the node has been moved, instead of crashing.
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
