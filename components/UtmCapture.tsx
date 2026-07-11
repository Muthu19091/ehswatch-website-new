"use client";

import { useEffect } from "react";
import { captureUtmFirstTouch } from "@/lib/utm";

/**
 * Invisible client component: captures first-touch UTM/attribution params on
 * mount (once per browser). Mounted globally in the root layout so attribution
 * is recorded on whatever page the visitor lands on, before they navigate to a
 * form. Renders nothing.
 */
export default function UtmCapture() {
  useEffect(() => {
    captureUtmFirstTouch();
  }, []);
  return null;
}
