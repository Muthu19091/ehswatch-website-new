"use client";

import { useEffect, useRef, useState } from "react";

type LangCode = "en" | "ar";

// Add a language here (code + label + short) and it appears in the menu — the
// UI scales without further changes. `code` must match the `locale` cookie value
// the site understands (today: en / ar).
const LANGUAGES: { code: LangCode; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "AR" },
];

function readLocaleCookie(): LangCode {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  return m?.[1] === "ar" ? "ar" : "en";
}

function setLocaleCookie(locale: LangCode) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function LanguageSwitcher({ lightHero = false }: { lightHero?: boolean }) {
  const [lang, setLang] = useState<LangCode>("en");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(readLocaleCookie());
    // Signals the pre-hydration click fallback (inline script in layout.tsx)
    // that React handlers are live and it should stand down.
    (window as unknown as { __lsHydrated?: boolean }).__lsHydrated = true;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const applyLocale = (next: LangCode) => {
    setOpen(false);
    if (next === lang) return;
    // locale cookie drives lang=/dir=rtl; googtrans persists the choice so the
    // next page load translates automatically.
    setLocaleCookie(next);
    const host = window.location.hostname;
    if (next === "ar") {
      document.cookie = "googtrans=/en/ar; path=/; SameSite=Lax";
      document.cookie = `googtrans=/en/ar; path=/; domain=${host}; SameSite=Lax`;
    } else {
      for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
        document.cookie = `googtrans=; path=/; max-age=0${domain}`;
      }
    }
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    setLang(next);
    // Live switch — no reload. GoogleTranslate listens and translates in place.
    window.dispatchEvent(new CustomEvent("ehs-locale", { detail: next }));
  };

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const border = lightHero ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.18)";
  const bg = lightHero ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.08)";
  const color = lightHero ? "#374151" : "rgba(255,255,255,0.85)";

  return (
    <div
      ref={wrapRef}
      data-lang-switch=""
      translate="no"
      className="notranslate"
      style={{ position: "relative", flexShrink: 0 }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        title="Select language"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 10px",
          borderRadius: "8px",
          border: `1px solid ${border}`,
          background: bg,
          color,
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: "var(--font-dm-sans, sans-serif)",
          letterSpacing: "0.04em",
          transition: "background 0.2s, border-color 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        {/* Globe icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>

        <span>{current.short}</span>

        {/* Chevron */}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          style={{ opacity: 0.7, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: "160px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 12px 32px rgba(10,15,30,0.16)",
            padding: "6px",
            zIndex: 70,
          }}
        >
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => applyLocale(l.code)}
                dir={l.code === "ar" ? "rtl" : "ltr"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: active ? "#f3f4f6" : "transparent",
                  color: "#0a0f1e",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: active ? 600 : 500,
                  fontFamily: "var(--font-dm-sans, sans-serif)",
                  textAlign: "start",
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget.style.background = "#f9fafb"); }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget.style.background = "transparent"); }}
              >
                <span>{l.label}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", opacity: 0.75, fontSize: "12px", fontWeight: 600 }}>
                  {l.short}
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3.5 3.5L13 4.5" stroke="var(--brand-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
