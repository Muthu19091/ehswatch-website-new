"use client";

import { useEffect } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Arabic translation overrides.

   The site translates to Arabic via Google Translate (machine). For a curated
   set of strings the client has authored, we override the machine output:
   we tag the matching elements translate="no" (so Google leaves them) and
   inject the authored Arabic when Arabic is active — restoring the English when
   it isn't. Everything else keeps using Google Translate.

   Keyed on the ENGLISH source so it's robust and reversible. One entry
   (industries subheadline) has no stable English source, so it's matched on
   the machine Arabic instead (AR_FIX).
   ──────────────────────────────────────────────────────────────────────── */

// English source (whitespace-normalised) → authored Arabic.
const EN_TO_AR: Record<string, string> = {
  "Back": "رجوع",
  "Step 1": "الخطوة الأولى",
  "Step 2": "الخطوة الثانية",
  "Step 3": "الخطوة الثالثة",
  "Step 4": "الخطوة الرابعة",
  "Explore": "استكشاف",
  "What is the minimum term for a contract?": "ما هو الحد الأدنى لمدة العقد؟",
  "Speak to our team to find the right configuration for your organisation.":
    "تحدث إلى فريقنا للعثور على الإعداد المناسب لمؤسستك.",
  "AI-powered EHS platform to streamline reporting everywhere.":
    "منصة الصحة والسلامة والبيئة المدعومة بالذكاء الاصطناعي، تمكّن الفرق من العمل بأمان، والامتثال للوائح، وإدارة العمليات بكفاءة.",
  "Turn Findings Into Results": "حوّل النتائج إلى نتائج قابلة للتنفيذ",
  "Why Traditional EHS Systems Fall Short": "لماذا تقصر أنظمة الصحة والسلامة والبيئة التقليدية؟",
  "What Sets EHSWatch Action Tracker Apart": "ما الذي يميز نظام EHSWatch Action Tracker؟",
};

// Machine-Arabic → corrected Arabic (used when there's no stable English key).
const AR_FIX: Record<string, string> = {
  "تعرّف على كيف يناسب برنامج EHSWatch قطاعك الصناعي":
    "تعرّف على كيفية ملاءمة برنامج EHSWatch لنشاطك الصناعي.",
};

// Terms that must stay in English (never translated/transliterated).
const KEEP_ENGLISH = new Set(["IRIS"]);

// Only look at elements that hold short, translatable text.
const CANDIDATE = "h1,h2,h3,h4,p,span,a,button,li,label,div";

const norm = (s: string | null) => (s ?? "").replace(/\s+/g, " ").trim();
const isArabic = () => /(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie) || /(?:^|;\s*)locale=ar/.test(document.cookie);

export default function ArabicOverrides() {
  useEffect(() => {
    let raf = 0;

    const apply = () => {
      const ar = isArabic();
      const els = document.querySelectorAll<HTMLElement>(CANDIDATE);
      els.forEach((el) => {
        const text = norm(el.textContent);
        if (!text) return;

        // Keep-English terms (e.g. IRIS): pin them translate="no".
        if (KEEP_ENGLISH.has(text)) {
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          return;
        }

        // English-keyed overrides.
        const enHit = Object.prototype.hasOwnProperty.call(EN_TO_AR, text) ? text : el.getAttribute("data-ar-en");
        if (enHit && EN_TO_AR[enHit] !== undefined) {
          if (!el.getAttribute("data-ar-en")) el.setAttribute("data-ar-en", enHit);
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          const want = ar ? EN_TO_AR[enHit] : enHit;
          if (norm(el.textContent) !== want) el.textContent = want;
          return;
        }

        // Machine-Arabic corrections (only meaningful while Arabic is on).
        if (ar && AR_FIX[text] !== undefined) {
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          el.textContent = AR_FIX[text];
        }
      });
    };

    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    apply();
    // Re-apply as Google Translate mutates the DOM and on client navigation.
    const obs = new MutationObserver(schedule);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    // A few timed passes catch Google's late first translation.
    const timers = [300, 800, 1500, 2500, 4000].map((t) => window.setTimeout(apply, t));

    return () => {
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
