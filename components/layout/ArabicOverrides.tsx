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
  // Same phrase as authored in Title Case on the Pricing page (exact-match keyed).
  "Speak to Our Team to Find the Right Configuration for Your Organisation.":
    "تحدث إلى فريقنا للعثور على الإعداد المناسب لمؤسستك.",
  "AI-powered EHS platform to streamline reporting everywhere.":
    "منصة الصحة والسلامة والبيئة المدعومة بالذكاء الاصطناعي، تمكّن الفرق من العمل بأمان، والامتثال للوائح، وإدارة العمليات بكفاءة.",
  // Footer summary (both EHSQ and EHS wordings) — authored Arabic per client.
  "AI-powered EHSQ platform helping teams stay safe, compliant, and in control.":
    "منصة الصحة والسلامة والبيئة المدعومة بالذكاء الاصطناعي، تمكّن الفرق من العمل بأمان، والامتثال للوائح، وإدارة العمليات بكفاءة.",
  "AI-powered EHS platform helping teams stay safe, compliant, and in control.":
    "منصة الصحة والسلامة والبيئة المدعومة بالذكاء الاصطناعي، تمكّن الفرق من العمل بأمان، والامتثال للوائح، وإدارة العمليات بكفاءة.",
  "Turn Findings Into Results": "حوّل النتائج إلى نتائج قابلة للتنفيذ",
  "Why Traditional EHS Systems Fall Short": "لماذا تقصر أنظمة الصحة والسلامة والبيئة التقليدية؟",
  "What Sets EHSWatch Action Tracker Apart": "ما الذي يميز نظام EHSWatch Action Tracker؟",
  "About IRIS": "عن IRIS",
  "EHSWatch: One Platform for Everyday Safety": "EHSWatch: منصة واحدة للسلامة اليومية",
  // Header / footer navigation labels (authored Arabic).
  "Company": "الشركة",
  "Home": "الصفحة الرئيسية",
  "About Us": "من نحن",
  "Product": "منتجات",
  "Products": "منتجات",
  "Pricing": "الأسعار",
  "Case Studies": "دراسات",
  "Blogs": "مقالات",
  "Support": "الدعم",
  // Contact/Support form heading + submit button (authored Arabic).
  "Get in Touch with Our Team": "تواصل مع فريقنا",
  "Submit": "إرسال",
  // Industries CTA heading — use قطاعك (sector), not عملك (work), per client.
  "Does EHSWatch work for your industry?": "هل يعمل EHSWatch في قطاعك؟",
  // Footer copyright — keep © 2026 EHSWatch, translate the rest.
  "© 2026 EHSWatch. All rights reserved.":
    "© 2026 EHSWatch. جميع الحقوق محفوظة.",
  // Home WorkEnvironments CTA — client-authored Arabic (machine output was weaker).
  "See How EHSWatch Fits Your Industry": "انظر كيف يناسب EHSWatch صناعتك.",
};

// Form field labels — label-scoped so "Company" here → اسم الشركة (a form field),
// distinct from the footer/nav "Company" → الشركة above. Applied to the label's
// own text node so a required-field asterisk (a sibling <span>) is preserved.
// Curated HTML titles: keyed on the English textContent, value is the Arabic
// innerHTML. Applied ONLY in Arabic (English keeps its server-rendered markup),
// so we can render a multi-line heading with its highlight span intact.
const EN_TO_AR_HTML: Record<string, string> = {
  "EHSQ Insights, Beyond The Dashboard":
    '\u0645\u0642\u0627\u0644\u0627\u062a EHSQ<br /><span style="color:#1d4ed8">\u0645\u0627 \u0648\u0631\u0627\u0621 \u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062a</span>',
};

const LABEL_EN_TO_AR: Record<string, string> = {
  "Your name": "الاسم الكامل",
  "Full name": "الاسم الكامل",
  "Full Name": "الاسم الكامل",
  "Name": "الاسم الكامل",
  "Company": "اسم الشركة",
  "Company Name": "اسم الشركة",
};

// Overrides whose text starts with a Latin brand ("EHSWatch: …"): force the
// element to LTR so the brand stays on the left and the Arabic phrase follows,
// instead of the brand being reordered to the right by the RTL page.
const FORCE_LTR = new Set([
  "EHSWatch: One Platform for Everyday Safety",
  // NB: "About IRIS" (→ عن IRIS) is intentionally NOT forced LTR — natural RTL
  // puts عن on the right and IRIS on the left, as the client wants.
]);

// Some ancestor forces LTR on the IRIS "About" heading, which lays "عن IRIS"
// the wrong way (عن on the left). Pin these to RTL so عن sits on the right and
// IRIS on the left when translating.
const FORCE_RTL = new Set([
  "About IRIS",
]);

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

// True when a descendant ELEMENT holds the exact same text — i.e. this element
// is just a wrapper. We must NOT setTextContent on it (that would wipe the inner
// heading/span and its styling); let the more specific inner element handle it.
const isWrapperFor = (el: Element, text: string) =>
  Array.from(el.querySelectorAll("h1,h2,h3,h4,p,span,a,button,li,label"))
    .some((c) => c !== el && norm(c.textContent) === text);

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

        // Form field labels: translate ONLY the label's own text node so a
        // trailing required-asterisk span survives, using the label-scoped map.
        if (el.tagName === "LABEL") {
          const tn = Array.from(el.childNodes).find(
            (n) => n.nodeType === 3 && (n.textContent || "").trim(),
          ) as Text | undefined;
          const stored = el.getAttribute("data-ar-label");
          const cur = tn ? norm(tn.textContent) : "";
          const key =
            stored && LABEL_EN_TO_AR[stored] !== undefined
              ? stored
              : LABEL_EN_TO_AR[cur] !== undefined
                ? cur
                : null;
          if (tn && key) {
            if (!stored) el.setAttribute("data-ar-label", key);
            el.setAttribute("translate", "no");
            el.classList.add("notranslate");
            const want = ar ? LABEL_EN_TO_AR[key] : key;
            if (norm(tn.textContent) !== want) tn.textContent = want;
            return;
          }
        }

        // Curated HTML overrides (multi-line titles w/ highlight) — Arabic only.
        if (ar && Object.prototype.hasOwnProperty.call(EN_TO_AR_HTML, text)) {
          if (el.getAttribute("data-ar-html") !== "1") {
            el.setAttribute("translate", "no");
            el.classList.add("notranslate");
            el.setAttribute("data-ar-html", "1");
            el.innerHTML = EN_TO_AR_HTML[text];
          }
          return;
        }

        // English-keyed overrides.
        const enHit = Object.prototype.hasOwnProperty.call(EN_TO_AR, text) ? text : el.getAttribute("data-ar-en");
        if (enHit && EN_TO_AR[enHit] !== undefined) {
          // Skip wrapper containers — target the inner element so we keep its styling.
          if (isWrapperFor(el, enHit)) return;
          if (!el.getAttribute("data-ar-en")) el.setAttribute("data-ar-en", enHit);
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          // Keep a Latin-brand-led header reading left-to-right in both languages.
          if (FORCE_LTR.has(enHit)) el.setAttribute("dir", "ltr");
          else if (FORCE_RTL.has(enHit)) el.setAttribute("dir", "rtl");
          const want = ar ? EN_TO_AR[enHit] : enHit;
          if (norm(el.textContent) !== want) el.textContent = want;
          return;
        }

        // Machine-Arabic corrections (only meaningful while Arabic is on).
        if (ar && AR_FIX[text] !== undefined && !isWrapperFor(el, text)) {
          el.setAttribute("translate", "no");
          el.classList.add("notranslate");
          el.textContent = AR_FIX[text];
        }
      });

      // Brand consistency: the machine transliterates "IRIS" to "ايريس" inside
      // sentences (KEEP_ENGLISH only catches a standalone "IRIS"). Replace every
      // "ايريس" back to "IRIS" and pin the node so it is not re-transliterated.
      if (ar) {
        const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const hits: Text[] = [];
        let node: Node | null;
        while ((node = tw.nextNode())) {
          if (node.nodeValue && node.nodeValue.indexOf("ايريس") !== -1) hits.push(node as Text);
        }
        hits.forEach((t) => {
          t.nodeValue = (t.nodeValue as string).replace(/ايريس/g, "IRIS");
          const pe = t.parentElement;
          if (pe) { pe.setAttribute("translate", "no"); pe.classList.add("notranslate"); }
        });
      }
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
