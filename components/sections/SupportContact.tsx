"use client";

import React from "react";
import DynamicCmsForm from "@/components/ui/DynamicCmsForm";
import type { CmsForm } from "@/lib/types";

/* ── Icons ── */
const AddressIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155eef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const EmailIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155eef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155eef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

interface ContactInfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

interface SupportContactProps {
  heading?: string;      // form_embed heading (may contain <span>)
  subheading?: string;   // form_embed subheading / description
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  formAttrs: CmsForm["attributes"] | null;
  formSlug: string;
}

export default function SupportContact({
  heading,
  subheading,
  contactEmail,
  contactPhone,
  contactAddress,
  formAttrs,
  formSlug,
}: SupportContactProps) {
  // Contact info is driven by CMS Settings → Contact; each item is only shown
  // when its value exists, and is rendered as a working link.
  const info: ContactInfoItem[] = [
    contactAddress
      ? { icon: AddressIcon, label: "Address", value: contactAddress, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactAddress)}`, external: true }
      : null,
    contactEmail
      ? { icon: EmailIcon, label: "Email ID", value: contactEmail, href: `mailto:${contactEmail}` }
      : null,
    contactPhone
      ? { icon: PhoneIcon, label: "Phone Number", value: contactPhone, href: `tel:${contactPhone.replace(/\s+/g, "")}` }
      : null,
  ].filter(Boolean) as ContactInfoItem[];

  // CMS-only: no hardcoded fallback heading/copy.
  const headingHtml = (heading?.trim() || "").replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">');
  const desc = subheading?.trim() || "";

  return (
    <section id="contact-form" className="bg-white py-12 md:py-20 px-4 md:px-6 scroll-mt-24">
      <div className="max-w-[1160px] mx-auto">
        <div className={`grid grid-cols-1 gap-10 md:gap-16${formAttrs ? " md:grid-cols-2" : ""}`}>

          {/* Left — heading, copy, contact info */}
          <div className="flex flex-col gap-6 justify-center">
            {(headingHtml || desc) && (
            <div>
              {headingHtml && (
                <h2
                  className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] md:text-[28px] leading-snug text-[#0f1728] mb-3"
                  dangerouslySetInnerHTML={{ __html: headingHtml }}
                />
              )}
              {desc && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.75] text-[#64748b]" style={{ textWrap: "pretty" } as React.CSSProperties}>
                  {desc}
                </p>
              )}
            </div>
            )}

            {info.length > 0 && (
              <div className="flex flex-col gap-5">
                {info.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "#eef4ff" }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-dm-sans)] text-[10px] tracking-[0.8px] uppercase font-semibold text-[#155eef] mb-0.5">{item.label}</p>
                      <a
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.6] text-[#374151] whitespace-pre-line hover:text-[#155eef] transition-colors"
                      >
                        {item.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — the real CMS support form (renders only when the form is active) */}
          {formAttrs && (
            <div>
              <DynamicCmsForm formAttrs={formAttrs} slug={formSlug} variant="support" />
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
