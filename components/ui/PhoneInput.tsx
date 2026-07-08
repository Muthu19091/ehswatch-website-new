"use client";

import { useEffect, useRef, useState } from "react";
import "intl-tel-input/styles";
import type { FormVariant } from "./DynamicCmsForm";

interface Props {
  name: string;
  required?: boolean;
  placeholder?: string;
  variant?: FormVariant;
}

export default function PhoneInput({ name, required, placeholder, variant = "contact" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<any>(null);
  const [fullNumber, setFullNumber] = useState("");

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    let iti: any;

    import("intl-tel-input").then(({ default: intlTelInput }) => {
      if (!inputRef.current) return;
      iti = intlTelInput(inputRef.current, {
        // Detect the visitor's country from Cloudflare's same-origin trace
        // endpoint (site is CF-fronted); fall back to India when unavailable.
        initialCountry: "",
        initialCountryLookup: async () => {
          try {
            const t = await fetch(`${window.location.origin}/cdn-cgi/trace`).then((r) => r.text());
            const loc = t.match(/^loc=([A-Z]{2})$/m)?.[1];
            return (loc && loc !== "XX" ? loc.toLowerCase() : "in") as never;
          } catch {
            return "in" as never;
          }
        },
        separateDialCode: true,
        loadUtils: () => import("intl-tel-input/utils"),
      });
      itiRef.current = iti;
    });

    const sync = () => setFullNumber(itiRef.current?.getNumber() ?? "");

    el.addEventListener("input", sync);
    el.addEventListener("countrychange", sync);

    return () => {
      el.removeEventListener("input", sync);
      el.removeEventListener("countrychange", sync);
      itiRef.current?.destroy();
      itiRef.current = null;
    };
  }, []);

  const isSupport = variant === "support";

  return (
    <span className={isSupport ? "iti-wrap iti-support" : "iti-wrap iti-contact"}>
      {isSupport && (
        <style>{`
          .iti-support { display: block; width: 100%; }
          .iti-support .iti { width: 100%; }
          .iti-support input[type="tel"] {
            width: 100%;
            border-radius: 8px;
            border: 1px solid #d1d9e6;
            background: #fff;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-right: 16px;
            font-family: var(--font-dm-sans), sans-serif;
            font-size: 14px;
            color: #0f1728;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          .iti-support input[type="tel"]::placeholder { color: #a0aec0; }
          .iti-support input[type="tel"]:focus {
            border-color: #155eef;
            box-shadow: 0 0 0 2px rgba(21, 94, 239, 0.1);
          }
        `}</style>
      )}
      <input
        ref={inputRef}
        type="tel"
        required={required}
        placeholder={placeholder ?? "Phone number"}
      />
      <input type="hidden" name={name} value={fullNumber} />
    </span>
  );
}
