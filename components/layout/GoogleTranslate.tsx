"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { basePath } from "@/lib/basePath";

/* ────────────────────────────────────────────────────────────────────────────
   First-party Arabic translator.

   Replaces the old client-side Google Translate widget. The widget failed
   whenever the visitor's browser/network blocked translate.google.com (Edge
   tracking-prevention, proxies, AV, extensions) and caused a layout shift
   because it swapped text in after paint.

   Here the browser talks ONLY to our own origin (/api/translate); our SERVER
   calls Google, so blocking on the client's network is irrelevant. A cloak
   (see globals.css / layout.tsx) hides the page until the first swap completes,
   so the visitor never sees the English→Arabic reflow.

   Authored strings and brand terms are left to <ArabicOverrides /> — anything
   it (or the author) marks translate="no" / [data-ar-en] / .notranslate is
   skipped here.
   ──────────────────────────────────────────────────────────────────────── */

const isArabic = () =>
  /(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie) ||
  /(?:^|;\s*)locale=ar/.test(document.cookie);

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "SVG", "CANVAS",
  "CODE", "PRE", "TEXTAREA", "INPUT", "SELECT", "OPTION",
]);
const KEEP = new Set(["IRIS", "EHSWatch", "EN", "AR"]);
const hasLetters = (s: string) => /[A-Za-z]/.test(s);

const reveal = () => document.documentElement.classList.remove("gt-cloak");

interface MTNode extends Text {
  __mt?: string; // the Arabic value we last wrote (to detect React resets)
}

export default function GoogleTranslate() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isArabic()) {
      reveal();
      return;
    }

    // Text-node mutations upset React's reconciliation; make the mismatched-
    // parent case a no-op instead of a crash (same guard the widget used).
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
    const dict = new Map<string, string>(); // trimmed EN -> AR

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
        const lead = raw.match(/^\s*/)?.[0] ?? "";
        const trail = raw.match(/\s*$/)?.[0] ?? "";
        n.nodeValue = lead + ar + trail;
        n.__mt = ar;
      }
    };

    const run = async (nodes: MTNode[]) => {
      const need = [
        ...new Set(nodes.map((n) => (n.nodeValue || "").trim()).filter((t) => t && !dict.has(t))),
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
          need.forEach((t) => dict.set(t, t)); // keep English on failure
        }
      }
      if (!cancelled) swap(nodes);
    };

    (async () => {
      try { await run(collect()); } finally { reveal(); }
    })();

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => { raf = 0; run(collect()); });
    };
    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    const timers = [400, 1200, 2500].map((ms) => window.setTimeout(schedule, ms));
    // Backstop: never keep the page hidden longer than this even if the API
    // hangs. The normal reveal happens as soon as the first pass resolves.
    const safety = window.setTimeout(reveal, 5000);

    return () => {
      cancelled = true;
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
