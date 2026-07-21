"use client";

import { useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

// Cloudflare's "always passes" dummy site key. When this (or no key) is the
// resolved key, the widget renders a "For testing only. If seen, report to
// site owner" banner and provides no real protection.
const TEST_SITE_KEY = "1x00000000000000000000AA";

interface TurnstileFieldProps {
  siteKey?: string;
  onToken: (token: string) => void;
  onExpire?: () => void;
}

export default function TurnstileField({ siteKey: propKey, onToken, onExpire }: TurnstileFieldProps) {
  const siteKey = propKey ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? TEST_SITE_KEY;

  // No real Turnstile key configured yet → don't render the test widget (hides
  // the "For testing only" banner) and auto-satisfy the token so forms still
  // submit. The moment a real site key is set (NEXT_PUBLIC_TURNSTILE_SITE_KEY
  // or the CMS form's captcha.site_key), the real widget renders and normal
  // verification applies.
  const isTestKey = !siteKey || siteKey === TEST_SITE_KEY;

  useEffect(() => {
    if (isTestKey) onToken("test-key-bypass");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTestKey]);

  if (isTestKey) return null;

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={onExpire}
      options={{ size: "normal" }}
    />
  );
}
