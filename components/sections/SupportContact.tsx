"use client";

import React, { useState } from "react";
import GlareButton from "@/components/ui/GlareButton";
import PhoneInput from "@/components/ui/PhoneInput";

/* ── shared input style ── */
const inputClass =
  "w-full rounded-[8px] border border-[#d1d9e6] bg-white px-4 py-[10px] font-[family-name:var(--font-dm-sans)] text-[14px] text-[#0f1728] placeholder:text-[#a0aec0] focus:outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/10 transition-all";

/* ── Contact info items ── */
const CONTACT_INFO = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155eef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Address",
    value: "Level 14, 25 Innovation Drive,\nSydney NSW 2000, Australia",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155eef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email ID",
    value: "support@ehswatch.com",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155eef" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    label: "Phone Number",
    value: "+1 (800) 123-4567",
  },
];

/* ── Contact support form ── */
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[#eef4ff] flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#155eef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] text-[#0f1728]">Message Sent</h3>
        <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#64748b] max-w-[300px]" style={{ textWrap: "pretty" } as React.CSSProperties}>
          Our team will get back to you within 1 business day.
        </p>
        <button onClick={() => setSubmitted(false)} className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#155eef] hover:underline cursor-pointer">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Full Name <span className="text-[#e53e3e]">*</span></label>
          <input required type="text" placeholder="Jane Smith" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Email Address <span className="text-[#e53e3e]">*</span></label>
          <input required type="email" placeholder="jane@company.com" className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Company</label>
          <input type="text" placeholder="Acme Corp" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Phone Number</label>
          <PhoneInput name="phone" variant="support" placeholder="98765 43210" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Topic <span className="text-[#e53e3e]">*</span></label>
        <select required defaultValue="" className={inputClass}>
          <option value="" disabled>Select a topic</option>
          <option>Technical Issue</option>
          <option>Billing & Pricing</option>
          <option>Feature Request</option>
          <option>Documentation</option>
          <option>General Enquiry</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Message <span className="text-[#e53e3e]">*</span></label>
        <textarea required rows={5} placeholder="Describe your issue or question in detail…" className={inputClass + " resize-none"} />
      </div>
      <div className="pt-1">
        <GlareButton fillColor="#FFA660" hoverTextColor="#ffffff" type="submit" className="inline-flex items-center gap-2 px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#ff7812] border border-[#ff7812] bg-transparent cursor-pointer">
          Send Message
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#ff7812" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </GlareButton>
      </div>
    </form>
  );
}

/* ── Portal login form ── */
function LoginForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Email Address <span className="text-[#e53e3e]">*</span></label>
        <input required type="email" placeholder="jane@company.com" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold text-[#374151] tracking-wide uppercase">Password <span className="text-[#e53e3e]">*</span></label>
        <input required type="password" placeholder="••••••••" className={inputClass} />
      </div>
      <div className="flex items-center justify-between pt-1">
        <GlareButton fillColor="#FFA660" hoverTextColor="#ffffff" type="submit" className="inline-flex items-center gap-2 px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#ff7812] border border-[#ff7812] bg-transparent cursor-pointer">
          Log In to Portal
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#ff7812" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </GlareButton>
        <a href="#" className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#155eef] hover:underline">Forgot password?</a>
      </div>
    </form>
  );
}

/* ── Main export ── */
export default function SupportContact({
  contactEmail,
  contactPhone,
  contactAddress,
}: { contactEmail?: string | null; contactPhone?: string | null; contactAddress?: string | null } = {}) {
  const [active, setActive] = useState<"contact" | "portal">("contact");

  // Override the static contact values with CMS Settings → Contact when present
  const contactInfo = CONTACT_INFO.map((item) => {
    if (item.label === "Email ID" && contactEmail) return { ...item, value: contactEmail };
    if (item.label === "Phone Number" && contactPhone) return { ...item, value: contactPhone };
    if (item.label === "Address" && contactAddress) return { ...item, value: contactAddress };
    return item;
  });

  return (
    <section className="bg-white py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-[1160px] mx-auto">

        {/* ── Pill tabs ── */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-1.5 bg-[#f1f5f9] rounded-full p-1.5">
            {(["contact", "portal"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={[
                  "px-6 py-2.5 rounded-full font-[family-name:var(--font-dm-sans)] text-[14px] font-medium transition-all duration-200 cursor-pointer",
                  active === key ? "text-white" : "text-[#64748b] hover:text-[#0f1728]",
                ].join(" ")}
                style={active === key ? { backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)" } : {}}
              >
                {key === "contact" ? "Contact Support" : "Support Portal"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Panel — no card, just the two-column layout ── */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

            {/* Left — info */}
            <div className="flex flex-col gap-6 justify-center">
              <div>
                <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] md:text-[26px] leading-snug text-[#0f1728] mb-3">
                  {active === "contact" ? "Contact Support" : "Support Portal"}
                </h2>
                <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.75] text-[#64748b]" style={{ textWrap: "pretty" } as React.CSSProperties}>
                  {active === "contact"
                    ? "Questions, support, or a closer look at EHSWatch? Have an urgent issue, a technical question, or need documentation? Feel free to reach out to the team with your concern."
                    : "Log in to our portal to track your requests and access the full EHSWatch resource library — including guides, release notes and how-to videos."}
                </p>
              </div>

              {active === "contact" ? (
                /* Contact info items */
                <div className="flex flex-col gap-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "#eef4ff" }}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-dm-sans)] text-[10px] tracking-[0.8px] uppercase font-semibold text-[#155eef] mb-0.5">{item.label}</p>
                        <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.6] text-[#374151] whitespace-pre-line">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Portal bullet points */
                <div className="flex flex-col gap-3">
                  {[
                    "Track open and resolved support tickets",
                    "Access product documentation and release notes",
                    "Download onboarding guides and how-to resources",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-[9px] w-[5px] h-[5px] rounded-full bg-[#155eef]" />
                      <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.75] text-[#374151]" style={{ textWrap: "pretty" } as React.CSSProperties}>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — form */}
            <div>
              {active === "contact" ? <ContactForm /> : <LoginForm />}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
