/**
 * First-touch UTM / attribution capture (client-side).
 *
 * The Next.js frontend is decoupled from the CMS, so the CMS's own
 * UTM-capturing middleware never sees the visitor's landing URL. We capture
 * the attribution params here on first load, persist them to localStorage so
 * they survive SPA navigation to a form page, and attach them to every form
 * submission. The keys match exactly what the CMS FormSubmitController's
 * extractUtm() expects, so no backend change is needed.
 */

const STORAGE_KEY = "ehswatch_attribution";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | "landing_page", string>>;

/**
 * Read attribution params from the current URL and, if any are present and we
 * haven't already stored a first-touch, persist them. Safe to call on every
 * page load — it only writes once (first touch wins). No-op on the server.
 */
export function captureUtmFirstTouch(): void {
  if (typeof window === "undefined") return;
  try {
    // Already captured a first touch → keep it.
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const captured: Attribution = {};
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) captured[k] = v;
    }

    // Only persist if the landing URL actually carried attribution params.
    if (Object.keys(captured).length > 0) {
      captured.landing_page = window.location.href;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    }
  } catch {
    /* localStorage unavailable (private mode / blocked) — ignore */
  }
}

/** Return the stored first-touch attribution (empty object if none). */
export function getStoredUtm(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
