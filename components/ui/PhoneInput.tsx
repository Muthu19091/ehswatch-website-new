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
        initialCountry: "us",
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
