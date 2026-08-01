"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { basePath } from "@/lib/basePath";

/* ────────────────────────────────────────────────────────────────────────────
   First-party Arabic translator.

   The browser talks ONLY to our own origin (/api/translate); our SERVER calls
   Google, so it works even when the visitor's network/browser blocks Google
   directly. A cloak (globals.css / layout.tsx) hides the page only while the
   text is being swapped, so there's no visible English→Arabic reflow.

   Switching language is LIVE — no page reload. The <LanguageSwitcher/> fires an
   "ehs-locale" event; we translate the current DOM in place (Arabic) or restore
   the saved English (back to English).
   ──────────────────────────────────────────────────────────────────────── */

const isArabic = () =>
  /(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie) ||
  /(?:^|;\s*)locale=ar/.test(document.cookie);

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "SVG", "CANVAS",
  "CODE", "PRE", "TEXTAREA", "INPUT",
  // NOTE: SELECT/OPTION are intentionally NOT skipped — we translate an option's
  // DISPLAY text only; its value attribute (what forms submit / filters compare)
  // is left untouched, so form logic keeps working.
]);
const KEEP = new Set(["IRIS", "EHSWatch", "EN", "AR"]);
const hasLetters = (s: string) => /[A-Za-z]/.test(s);

const cloak = () => document.documentElement.classList.add("gt-cloak");
const reveal = () => document.documentElement.classList.remove("gt-cloak");

interface MTNode extends Text {
  __mt?: string; // Arabic value we last wrote (to detect React resets)
  __en?: string; // original English value (to restore on switch-back)
}

export default function GoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    // Guard React reconciliation against our text-node mutations.
    const w = window as unknown as { __mtGuard?: boolean };
    if (!w.__mtGuard) {
      w.__mtGuard = true;
      const origRemove = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(this: Node, c: T): T {
        if (c.parentNode !== this) return c;
        return origRemove.call(this, c) as T;
      };
      const origInsert = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(this: Node, n: T, r: Node | null): T {
        if (r && r.parentNode !== this) return n;
        return origInsert.call(this, n, r) as T;
      };
    }

    let cancelled = false;
    const dict = new Map<string, string>();        // trimmed EN -> AR
    const swapped = new Set<MTNode>();             // nodes we translated (for revert)
    // Elements whose `placeholder` we translated. Attributes aren't text nodes,
    // so the TreeWalker never sees them — handled separately here.
    type PhEl = HTMLElement & { __enPh?: string; __mtPh?: string };
    const swappedPh = new Set<PhEl>();

    const collect = (): MTNode[] => {
      const out: MTNode[] = [];
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const n = node as MTNode;
          const t = (n.nodeValue || "").trim();
          if (!t || !hasLetters(t) || KEEP.has(t)) return NodeFilter.FILTER_REJECT;
          if (n.__mt && t === n.__mt) return NodeFilter.FILTER_REJECT; // already ours
          const p = n.parentElement;
          if (!p || SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
          if (p.closest('[translate="no"], .notranslate, [data-ar-en], [contenteditable="true"]'))
            return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let cur: Node | null;
      while ((cur = tw.nextNode())) out.push(cur as MTNode);
      return out;
    };

    const swap = (nodes: MTNode[]) => {
      for (const n of nodes) {
        const raw = n.nodeValue || "";
        const t = raw.trim();
        const ar = dict.get(t);
        if (!ar || ar === t) continue;
        if (n.__en === undefined) n.__en = raw; // remember English for revert
        const lead = raw.match(/^\s*/)?.[0] ?? "";
        const trail = raw.match(/\s*$/)?.[0] ?? "";
        n.nodeValue = lead + ar + trail;
        n.__mt = ar;
        swapped.add(n);
      }
    };

    // Collect / swap translatable `placeholder` attributes (search inputs etc.).
    const collectPh = (): PhEl[] => {
      const out: PhEl[] = [];
      document.querySelectorAll<HTMLElement>("[placeholder]").forEach((el) => {
        const e = el as PhEl;
        const ph = el.getAttribute("placeholder") || "";
        const t = ph.trim();
        if (!t || !hasLetters(t) || KEEP.has(t)) return;
        if (e.__mtPh && ph === e.__mtPh) return; // already ours
        if (el.closest('[translate="no"], .notranslate')) return;
        out.push(e);
      });
      return out;
    };

    const swapPh = (els: PhEl[]) => {
      for (const el of els) {
        const ph = el.getAttribute("placeholder") || "";
        const ar = dict.get(ph.trim());
        if (!ar || ar === ph.trim()) continue;
        if (el.__enPh === undefined) el.__enPh = ph; // remember English
        el.setAttribute("placeholder", ar);
        el.__mtPh = ar;
        swappedPh.add(el);
      }
    };

    const run = async (nodes: MTNode[], phEls: PhEl[] = []) => {
      const need = [
        ...new Set(
          [
            ...nodes.map((n) => (n.nodeValue || "").trim()),
            ...phEls.map((el) => (el.getAttribute("placeholder") || "").trim()),
          ].filter((t) => t && !dict.has(t)),
        ),
      ];
      if (need.length) {
        try {
          const res = await fetch(`${basePath}/api/translate/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texts: need, target: "ar" }),
          });
          const data = (await res.json()) as { t?: string[] };
          const arr = Array.isArray(data?.t) ? data.t : [];
          need.forEach((t, i) => dict.set(t, arr[i] ?? t));
        } catch {
          need.forEach((t) => dict.set(t, t));
        }
      }
      if (!cancelled) { swap(nodes); swapPh(phEls); }
    };

    // useCloak: true only for the first paint, so the initial view never shows
    // the English→Arabic reflow. A manual toggle swaps live (no cloak/blank).
    const applyAr = async (useCloak: boolean) => {
      if (useCloak) cloak();
      try { await run(collect(), collectPh()); } finally { if (useCloak) reveal(); }
    };

    const revertEn = () => {
      swapped.forEach((n) => {
        if (n.__en !== undefined) { n.nodeValue = n.__en; n.__mt = undefined; }
      });
      swappedPh.forEach((el) => {
        if (el.__enPh !== undefined) { el.setAttribute("placeholder", el.__enPh); el.__mtPh = undefined; }
      });
      reveal();
    };

    // Initial state (from cookie / SSR) — cloak so the first view has no shift.
    if (isArabic()) applyAr(true);
    else reveal();

    // Live switch from the language button — no reload, no blank.
    const onLocale = (e: Event) => {
      const to = (e as CustomEvent).detail;
      if (to === "ar") applyAr(false);
      else revertEn();
    };
    window.addEventListener("ehs-locale", onLocale);

    // Translate late-arriving / re-rendered content — only while Arabic is on.
    let raf = 0;
    const schedule = () => {
      if (raf || !isArabic()) return;
      raf = window.requestAnimationFrame(() => { raf = 0; if (isArabic()) run(collect(), collectPh()); });
    };
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    const timers = [400, 1200, 2500].map((ms) => window.setTimeout(schedule, ms));
    const safety = window.setTimeout(reveal, 5000);

    return () => {
      cancelled = true;
      window.removeEventListener("ehs-locale", onLocale);
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
