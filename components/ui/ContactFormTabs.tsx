"use client";

import { useState } from "react";
import DynamicCmsForm from "@/components/ui/DynamicCmsForm";
import type { CmsForm } from "@/lib/types";

export interface FormTab {
  key: string;
  label: string;
  slug: string;
  formAttrs: CmsForm["attributes"];
}

/**
 * Contact-Us form area with a tab switch between multiple CMS forms
 * (e.g. Support / Contact). Client component because the active tab is
 * interactive state. Each form keeps its own slug so it submits to the right
 * endpoint; remounting on switch (keyed by slug) gives each a fresh state.
 */
export default function ContactFormTabs({ forms }: { forms: FormTab[] }) {
  const [active, setActive] = useState(0);
  if (!forms || forms.length === 0) return null;
  const current = forms[Math.min(active, forms.length - 1)];

  return (
    <div className="ct-form-col mt-20 lg:mt-0">
      {forms.length > 1 && (
        <div
          role="tablist"
          aria-label="Choose a form"
          className="inline-flex gap-1 mb-7 p-1 rounded-full"
          style={{ background: "#f3f4f6", border: "1px solid #e5e7eb" }}
        >
          {forms.map((f, i) => {
            const on = i === active;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className="px-6 py-2 rounded-full text-[14px] font-medium font-[family-name:var(--font-dm-sans)] transition-all cursor-pointer whitespace-nowrap"
                style={{
                  background: on ? "#ffffff" : "transparent",
                  color: on ? "#0a0f1e" : "#6b7280",
                  boxShadow: on ? "0 1px 4px rgba(10,15,30,0.12)" : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}
      <DynamicCmsForm key={current.slug} formAttrs={current.formAttrs} slug={current.slug} variant="contact" />
    </div>
  );
}
