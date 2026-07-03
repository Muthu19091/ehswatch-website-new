"use client";

import { useState } from "react";
import { basePath } from "@/lib/basePath";
import TurnstileField from "@/components/ui/TurnstileField";
import type { CmsForm } from "@/lib/types";

const DARK = "#1B1B1B";
const DARK_MID = "rgba(27,27,27,0.8)";

interface BlogNewsletterProps {
  formAttrs?: CmsForm["attributes"] | null;
}

export default function BlogNewsletter({ formAttrs }: BlogNewsletterProps = {}) {
  const [email,        setEmail]        = useState("");
  const [consent,      setConsent]      = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [hovered,      setHovered]      = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const siteKey    = formAttrs?.captcha?.site_key ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";
  const submitLabel = formAttrs?.submit_label ?? "Subscribe";
  const successMsg  = formAttrs?.success_message ?? "Check your inbox for a confirmation.";

  /* find the consent checkboxes field, if the CMS has one */
  const consentField = formAttrs?.fields?.find(
    (f) => f.field_type === "checkboxes" && f.key === "consent"
  ) ?? null;
  const needsConsent = consentField?.required && !consent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !captchaToken || needsConsent) return;
    try {
      const { submitForm } = await import("@/lib/api");
      const data: Record<string, unknown> = { email, captcha_token: captchaToken };
      if (consentField) data.consent = consent ? ["Yes"] : [];
      await submitForm("newsletter", data);
    } finally {
      setSubmitted(true);
    }
  };

  return (
    <section className="px-6 md:px-8 pt-0 pb-12 md:pb-16">
      <style>{`
        .nl-input-dark::placeholder { color: rgba(27,27,27,0.6); }
        .nl-input-dark:focus { outline: none; }
      `}</style>

      <div
        className="max-w-[1320px] mx-auto px-10 md:px-20 py-14 md:py-16 flex items-center relative overflow-hidden"
        style={{
          borderRadius: "16px",
          backgroundImage: `url(${basePath}/images/blogs/Newsletter%20Background%203.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* right-edge fade */}
        <div
          className="absolute inset-y-0 right-0 pointer-events-none"
          style={{
            width: "30%",
            background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 70%, #ffffff 100%)",
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        />

        <div className="relative z-10 w-full">
          {submitted ? (
            /* ── Success ── */
            <div className="flex items-center gap-6 w-full">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(10,15,30,0.12)" }}
              >
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <path d="M5 11l4.5 4.5L17 7" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px]" style={{ color: DARK }}>
                  You&apos;re subscribed!
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[14px] mt-1" style={{ color: DARK_MID }}>
                  {successMsg}
                </p>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap items-center justify-center w-full gap-8 md:gap-12"
            >
              {/* Heading */}
              <h2
                className="font-[family-name:var(--font-gothic-a1)] font-bold text-[18px] sm:text-[19px] md:text-[20px] leading-[1.6] tracking-[-0.01em] shrink-0"
                style={{ color: DARK }}
              >
                <span className="block whitespace-nowrap">Get the latest EHSQ insights,</span>
                <span className="block whitespace-nowrap">product updates,</span>
                <span className="block whitespace-nowrap">and regulatory signals.</span>
              </h2>

              {/* Email + consent */}
              <div className="flex flex-col gap-3 w-full max-w-[340px]">
                <div className="pb-1" style={{ borderBottom: `1px solid rgba(27,27,27,0.35)` }}>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email Address"
                    className="nl-input-dark w-full bg-transparent font-[family-name:var(--font-dm-sans)] text-[15px]"
                    style={{ color: DARK }}
                  />
                </div>

                {/* CMS consent checkbox — shown only when the CMS field is present */}
                {consentField && (
                  <label
                    className="flex items-start gap-2 cursor-pointer font-[family-name:var(--font-dm-sans)] text-[12px] leading-[1.5]"
                    style={{ color: DARK_MID }}
                  >
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required={consentField.required}
                      className="mt-[2px] shrink-0 accent-[#ff7812]"
                    />
                    <span>{consentField.label}</span>
                  </label>
                )}

                <p className="font-[family-name:var(--font-dm-sans)] text-[12px]" style={{ color: DARK_MID }}>
                  Read more about how we protect your data.{" "}
                  <a href="#" className="font-semibold underline" style={{ color: DARK }}>Learn More</a>
                </p>
              </div>

              {/* Turnstile */}
              <TurnstileField siteKey={siteKey} onToken={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />

              {/* Subscribe button */}
              <button
                type="submit"
                disabled={!captchaToken || needsConsent}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="shrink-0 flex items-center gap-2 px-6 font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] transition-all duration-200"
                style={{
                  height: 48,
                  borderRadius: 8,
                  border: "none",
                  background: hovered
                    ? "linear-gradient(102.8deg, #ff8e37 0%, #ff6d00 100%)"
                    : "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                  color: "#ffffff",
                  opacity: (!captchaToken || needsConsent) ? 0.7 : 1,
                }}
              >
                {submitLabel}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
