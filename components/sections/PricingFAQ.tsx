"use client";

import { unescapeTypedTags } from "@/lib/text";
import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface PricingFAQProps {
  heading?: string;
  items?: FaqItem[];
}

export default function PricingFAQ({
  heading,
  items,
}: PricingFAQProps = {}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // CMS-only: no hardcoded FAQ fallback. Hide the section when empty.
  const faqs = items && items.length > 0 ? items : [];
  const displayHeading = heading?.trim() || "";
  if (faqs.length === 0) return null;

  return (
    <section className="py-[60px] md:py-[80px] px-4 md:px-6 bg-white">
      <div className="max-w-[760px] mx-auto flex flex-col gap-8">
        {displayHeading && (
        <div className="text-center">
          <h2
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] md:text-[38px] leading-tight tracking-[-0.025em] text-[#0a0f1e]"
            dangerouslySetInnerHTML={{ __html: displayHeading }}
          />
        </div>
        )}
        <div className="flex flex-col divide-y divide-[#e5eaf2]">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] sm:text-[16px] text-[#0a0f1e]">
                  {faq.question}
                </span>
                <div
                  className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center transition-colors duration-200"
                  style={{ background: openIdx === i ? "#1d4ed8" : "#e5eaf2" }}
                >
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
                  >
                    <path d="M2 4l4 4 4-4" stroke={openIdx === i ? "white" : "#374151"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
              {openIdx === i && (
                /* CMS answers may contain HTML (paragraphs, lists, links) */
                <div
                  className="font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.75] text-[#6b7280] mt-3 text-pretty [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[var(--brand-primary)] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: unescapeTypedTags(faq.answer) }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
