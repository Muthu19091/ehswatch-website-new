"use client";

import { useEffect, useState } from "react";

function readLocaleCookie(): "en" | "ar" {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  return m?.[1] === "ar" ? "ar" : "en";
}

function setLocaleCookie(locale: "en" | "ar") {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export default function LanguageSwitcher({ lightHero = false }: { lightHero?: boolean }) {
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    setLang(readLocaleCookie());
    // Signals the pre-hydration click fallback (inline script in layout.tsx)
    // that React handlers are live and it should stand down.
    (window as unknown as { __lsHydrated?: boolean }).__lsHydrated = true;
  }, []);


  const toggle = () => {
    const next: "en" | "ar" = lang === "en" ? "ar" : "en";
    // locale cookie only drives lang= / dir=rtl; googtrans persists the
    // choice so the next page load translates automatically.
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

    // Flip direction/lang immediately.
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";

    setLang(next);
    // Live switch — no page reload. The translator (GoogleTranslate) listens
    // for this and translates the current DOM in place / restores English.
    window.dispatchEvent(new CustomEvent("ehs-locale", { detail: next }));
  };

  return (
    <button
      type="button"
      translate="no"
      className="notranslate"
      data-lang-switch=""
      onClick={toggle}
      aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
      title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "6px 10px",
        borderRadius: "8px",
        border: `1px solid ${lightHero ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.18)"}`,
        background: lightHero ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.08)",
        color: lightHero ? "#374151" : "rgba(255,255,255,0.85)",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: "var(--font-dm-sans, sans-serif)",
        letterSpacing: "0.04em",
        transition: "background 0.2s, border-color 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
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

      <span>{lang === "en" ? "EN" : "AR"}</span>

      {/* Swap arrows */}
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.6 }}>
        <path
          d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span style={{ opacity: 0.5 }}>{lang === "en" ? "AR" : "EN"}</span>
    </button>
  );
}
