"use client";

import { unescapeTypedTags } from "@/lib/text";
import { useState, useEffect } from "react";
import Link from "next/link";
import GlareButton from "@/components/ui/GlareButton";
import CmsIcon from "@/components/ui/CmsIcon";

// ─────────────────────────────────────────────────────────────────────────────
// Generic CMS-driven product-module detail page.
// Design lifted from the Action Tracker page; every section renders from the
// module's CMS content blocks and hides itself when the block is absent.
// ─────────────────────────────────────────────────────────────────────────────

export interface ModuleCta {
  label: string;
  href: string;
}

export interface ModuleTemplateProps {
  moduleName: string;
  hero: {
    eyebrow?: string;
    headline: string;
    subheadline?: string;
    boldTagline?: string;
    headlineAccent?: string;
    primaryCta?: ModuleCta;
    secondaryCta?: ModuleCta;
  };
  why?: {
    heading: string;
    bodyHtml: string;
    imageUrl?: string;
    cta?: ModuleCta;
  };
  features?: {
    heading: string;
    subheading?: string;
    items: Array<{ icon?: string | null; title: string; description: string }>;
  };
  apart?: {
    heading: string;
    items: string[];
    bodyHtml?: string;
  };
  faqs?: {
    heading: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta?: {
    headline: string;
    subhead?: string;
    cta?: ModuleCta;
    secondaryCta?: ModuleCta;
  };
  moreModules?: {
    heading: string;
    modules: Array<{ name: string; slug: string; desc: string; icon?: string | null; href?: string }>;
  };
  clientStrip?: {
    heading: string;
    subheading?: string;
    logos: Array<{ name: string; url: string }>;
  };
}

const FEATURE_COLORS = ["#155eef", "#059669", "#f59e0b", "#7c3aed", "#0891b2", "#6366f1"];
const MODULE_COLORS = ["#ef4444", "#6366f1", "#f59e0b", "#059669", "#0891b2"];

// Split a heading so its last 1–2 words render in blue (matches the design)
function splitHeadline(text: string, words = 1): [string, string] {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= words) return ["", text.trim()];
  return [parts.slice(0, -words).join(" ") + " ", parts.slice(-words).join(" ")];
}

function CTAButton({ href, label, variant = "primary" }: { href: string; label: string; variant?: "primary" | "ghost" }) {
  if (variant === "primary") {
    return (
      <GlareButton
        href={href}
        className="gap-2 px-8 py-[12px] rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[15px] text-white transition-all duration-200 hover:shadow-lg"
        style={{
          backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
          boxShadow: "0 4px 24px rgba(249,115,22,0.30)",
        }}
      >
        {label}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </GlareButton>
    );
  }
  return (
    <GlareButton
      href={href}
      fillColor="#FFA660"
      hoverTextColor="#ffffff"
      className="gap-2 px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] border transition-all duration-200"
      style={{ borderColor: "#d1d5db", color: "#374151" }}
    >
      {label}
    </GlareButton>
  );
}

function ExploreLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="self-start inline-block font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[1.6] no-underline transition-all duration-200"
      style={{
        color: hovered ? "#cc5700" : "#FF6D00",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
      }}
    >
      {/* Arrow flows inline right after the label so a long, wrapping CTA
          sentence keeps the arrow next to its last word instead of being
          pushed to the far right of the column. */}
      {label}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="inline-block align-middle ml-1.5">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function MoreModuleCard({ mod, color, isLast }: {
  mod: { name: string; slug: string; desc: string; icon?: string | null; href?: string };
  color: string;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex flex-col gap-3 px-5 sm:px-6 py-6 sm:py-8"
      style={{ borderRight: !isLast ? "1px solid #e5e7eb" : "none" }}
    >
      <div
        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ background: color + "14", color }}
      >
        <CmsIcon icon={mod.icon} size={20} strokeWidth={1.5} color={color} fallback="square-check" />
      </div>
      <h3 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug">
        {mod.name}
      </h3>
      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.65] flex-1 text-pretty">
        {mod.desc}
      </p>
      <Link
        href={mod.href ?? `/modules/${mod.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="mt-1 self-start inline-flex items-center gap-1 font-[family-name:var(--font-dm-sans)] font-medium text-[13px] no-underline transition-all duration-200"
        style={{
          color: hovered ? "#cc5700" : "#FF6D00",
          transform: hovered ? "translateX(3px)" : "translateX(0)",
        }}
      >
        <span>Explore</span>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

function FAQAccordion({ heading, items }: { heading: string; items: Array<{ question: string; answer: string }> }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
      <div className="max-w-[820px] mx-auto flex flex-col gap-8">
        {heading && (
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] md:text-[38px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
              {heading}
            </h2>
          </div>
        )}
        <div className="flex flex-col divide-y divide-[#e5eaf2]">
          {items.map((faq, i) => (
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
                  className="font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.8] text-[#6b7280] mt-3 text-pretty [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#FF6D00] [&_a]:underline"
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

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ModuleTemplate({
  moduleName,
  hero,
  why,
  features,
  apart,
  faqs,
  clientStrip,
  finalCta,
  moreModules,
}: ModuleTemplateProps) {
  // When the page is machine-translated to Arabic, the accent <span> below
  // would split the headline into two fragments that get translated
  // independently — producing wrong word order (FE QA #17). In Arabic we render
  // the headline as one text node so the whole sentence translates coherently.
  const [isArabic, setIsArabic] = useState(false);
  useEffect(() => {
    const check = () => setIsArabic(
      /(?:^|;\s*)googtrans=\/en\/ar/.test(document.cookie) ||
      /(?:^|;\s*)locale=ar/.test(document.cookie),
    );
    check();
    window.addEventListener("ehs-locale", check);
    return () => window.removeEventListener("ehs-locale", check);
  }, []);

  // FE-HO-12: highlight the CMS-chosen accent word (if set and present in the
  // headline); otherwise fall back to highlighting the last word.
  let headStart: string, headHighlight: string, headEnd = "";
  const accent = hero.headlineAccent?.trim();
  const accentIdx = accent ? hero.headline.toLowerCase().indexOf(accent.toLowerCase()) : -1;
  if (accent && accentIdx >= 0) {
    headStart = hero.headline.slice(0, accentIdx);
    headHighlight = hero.headline.slice(accentIdx, accentIdx + accent.length);
    headEnd = hero.headline.slice(accentIdx + accent.length);
  } else {
    [headStart, headHighlight] = splitHeadline(hero.headline);
  }
  const [apartStart, apartHighlight] = apart ? splitHeadline(apart.heading, 2) : ["", ""];

  return (
    <>
      <style>{`
        .mt-grid-container {
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes mtGridBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.6; }
        }
        .mt-grid-box {
          position: absolute;
          width: 48px;
          height: 48px;
        }
        @keyframes mtDiffFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mt-diff-item {
          opacity: 0;
          animation: mtDiffFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .mt-why-body p + p { margin-top: 1.25rem; }
        /* Rich text from the CMS (links, bold, lists) inside module sections */
        .mt-rich a { color: #1d4ed8; text-decoration: underline; text-underline-offset: 2px; }
        .mt-rich strong { color: #0a0f1e; }
        .mt-rich ul { list-style: disc; padding-left: 1.4rem; margin: 0.6rem 0; }
        .mt-rich ol { list-style: decimal; padding-left: 1.4rem; margin: 0.6rem 0; }
        .mt-rich li { margin-top: 0.35rem; }
        .mt-rich h2, .mt-rich h3, .mt-rich h4 { font-family: var(--font-gothic-a1), sans-serif; font-weight: 700; color: #0a0f1e; margin: 1.2rem 0 0.5rem; }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex items-center justify-center px-4 sm:px-6 pt-[90px] sm:pt-[120px] md:pt-[148px] pb-[60px] sm:pb-[80px] md:pb-[100px]"
        style={{
          minHeight: "58vh",
          background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden mt-grid-container pointer-events-none">
          {Array.from({ length: 200 }, (_, i) => {
            const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
            const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
            return shouldAnimate ? (
              <div
                key={`mt-gb-${i}`}
                className="mt-grid-box"
                style={{
                  left: `${(i % 20) * 50 + 1}px`,
                  top: `${Math.floor(i / 20) * 50 + 1}px`,
                  backgroundColor: colors[i % 4],
                  animation: `mtGridBoxFill ${4 + ((i * 2) % 6)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.3) % 12}s`,
                }}
              />
            ) : null;
          })}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 70%, white 100%)" }}
          />
        </div>

        <div className="relative z-20 max-w-[800px] w-full mx-auto text-center flex flex-col items-center gap-5 md:gap-6">
          {hero.eyebrow && (
            <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise">
              {hero.eyebrow}
            </span>
          )}
          <h1
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[50px] md:text-[58px] leading-[1.06] text-[#0a0f1e] tracking-[-0.03em] animate-hero-rise"
            style={{ animationDelay: "80ms" }}
          >
            {isArabic ? hero.headline : (
              <>
                {headStart}
                <span style={{ color: "#1d4ed8" }}>{headHighlight}</span>
                {headEnd}
              </>
            )}
          </h1>

          {hero.subheadline && (
            <p
              className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] md:text-[18px] text-[#4b5563] leading-[1.75] max-w-[860px] animate-hero-rise text-pretty"
              style={{ animationDelay: "180ms" }}
            >
              {hero.subheadline}
            </p>
          )}

          {hero.boldTagline && (
            <p
              className="font-[family-name:var(--font-gothic-a1)] font-bold text-[17px] sm:text-[19px] md:text-[20px] text-[#0a0f1e] leading-snug max-w-[720px] animate-hero-rise text-pretty"
              style={{ animationDelay: "240ms" }}
            >
              {hero.boldTagline}
            </p>
          )}

          {(hero.primaryCta || hero.secondaryCta) && (
            <div className="flex flex-col sm:flex-row gap-3 animate-hero-rise" style={{ animationDelay: "300ms" }}>
              {hero.primaryCta && <CTAButton href={hero.primaryCta.href} label={hero.primaryCta.label} variant="primary" />}
              {hero.secondaryCta && <CTAButton href={hero.secondaryCta.href} label={hero.secondaryCta.label} variant="ghost" />}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY ── */}
      {why && (
        <section className="py-[70px] md:py-[90px] px-4 md:px-6" style={{ background: "#F8FBFF" }}>
          <div className="max-w-[1160px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className={`flex flex-col gap-6 w-full ${why.imageUrl ? "lg:w-[40%]" : "max-w-[760px] mx-auto"}`}>
              <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
                {why.heading}
              </h2>
              <div
                className="mt-why-body font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.8] text-[#4b5563] text-pretty"
                dangerouslySetInnerHTML={{ __html: why.bodyHtml }}
              />
              {why.cta && <ExploreLink href={why.cta.href} label={why.cta.label} />}
            </div>
            {why.imageUrl && (
              <div className="w-full lg:w-[60%] rounded-2xl overflow-hidden">
                {/* Fixed 16:9 frame + cover so portrait/odd-ratio CMS images
                    render at a consistent size instead of blowing up the section. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={why.imageUrl}
                  alt={`${moduleName} dashboard`}
                  className="block w-full object-cover"
                  style={{ aspectRatio: "16 / 9" }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── KEY FEATURES ── */}
      {features && features.items.length > 0 && (
        <section id="features" className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
          <div className="max-w-[1160px] mx-auto">
            <div className="text-center mb-12 md:mb-16">
              {features.heading && (
                <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
                  {(() => {
                    const [s, h] = splitHeadline(features.heading, 2);
                    return (<>{s}<span style={{ color: "#1d4ed8" }}>{h}</span></>);
                  })()}
                </h2>
              )}
              {features.subheading && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] text-[#6b7280] mt-4 max-w-[500px] mx-auto text-pretty leading-[1.7]">
                  {features.subheading}
                </p>
              )}
            </div>

            {/* Single responsive grid with gap dividers — renders clean borders
                at 1 / 2 / 3 columns (was a rows-of-3 grid that broke on iPad). */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e7eb] border border-[#e5e7eb] rounded-[12px] overflow-hidden">
              {features.items.map((feat, i) => {
                const color = FEATURE_COLORS[i % FEATURE_COLORS.length];
                return (
                  <div key={i} className="flex flex-col gap-3 px-5 sm:px-7 py-6 sm:py-8 bg-white">
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: color + "14", color }}
                    >
                      <CmsIcon icon={feat.icon} size={22} strokeWidth={1.6} color={color} fallback="square-check" />
                    </div>
                    <h3 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[15px] text-[#0a0f1e] leading-snug">
                      {feat.title}
                    </h3>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.65] flex-1 text-pretty">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── WHAT SETS IT APART ── */}
      {apart && (apart.items.length > 0 || apart.bodyHtml) && (
        <section className="py-[70px] md:py-[90px] px-4 md:px-6" style={{ background: "#F8FBFF" }}>
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {apart.heading && (
              <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
                {apartStart}
                <span style={{ color: "#1d4ed8" }}>{apartHighlight}</span>
              </h2>
            )}
            {apart.items.length > 0 ? (
              <div className="flex flex-col gap-4">
                {apart.items.map((item, i) => (
                  <div key={i} className="mt-diff-item flex items-start gap-3" style={{ animationDelay: `${i * 150}ms` }}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "#93c5fd" }}
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M2 5.5l2.8 2.8L9 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p
                      className="mt-rich font-[family-name:var(--font-dm-sans)] text-[14px] sm:text-[15px] leading-[1.75] text-[#374151] text-pretty"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="mt-rich mt-why-body font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.8] text-[#4b5563] text-pretty"
                dangerouslySetInnerHTML={{ __html: apart.bodyHtml! }}
              />
            )}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {/* ── CLIENT STRIP (logo marquee) — above the FAQ ── */}
      {clientStrip && clientStrip.logos.length > 0 && (
        <section className="bg-white pt-14 md:pt-[72px] pb-8 md:pb-[52px] px-4 md:px-6">
          <div className="max-w-[1160px] mx-auto flex flex-col items-center text-center gap-4 md:gap-6">
            {clientStrip.heading && (
              <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] sm:text-[26px] md:text-[32px] leading-tight tracking-[-0.02em] text-[#0a0f1e] max-w-[780px]">
                {clientStrip.heading}
              </h2>
            )}
            {clientStrip.subheading && (
              <p className="font-[family-name:var(--font-dm-sans)] text-[14px] md:text-[15px] leading-[1.7] text-[#6b7280] max-w-[640px] text-pretty">
                {clientStrip.subheading}
              </p>
            )}
            <div
              dir="ltr"
              translate="no"
              className="notranslate relative overflow-hidden w-full mt-2"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
              }}
            >
              <div className="flex gap-10 md:gap-[56px] items-center animate-marquee-slow whitespace-nowrap w-max">
                {[...clientStrip.logos, ...clientStrip.logos, ...clientStrip.logos].map((logo, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${logo.name}-${i}`}
                    src={logo.url}
                    alt={logo.name}
                    className="h-8 md:h-10 w-auto object-contain shrink-0"
                    style={{ opacity: 0.55 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {faqs && faqs.items.length > 0 && <FAQAccordion heading={faqs.heading} items={faqs.items} />}

      {/* ── FINAL CTA ── */}
      {finalCta && (
        <section className="py-[70px] md:py-[90px] px-4 md:px-6" style={{ background: "#f1f7ff" }}>
          <div className="max-w-[700px] mx-auto text-center flex flex-col items-center gap-6">
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[42px] leading-tight tracking-[-0.025em] text-[#0a0f1e]">
              {finalCta.headline}
            </h2>
            {finalCta.subhead && (
              <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.8] text-[#4b5563] max-w-[560px] text-pretty">
                {finalCta.subhead}
              </p>
            )}
            {(finalCta.cta || finalCta.secondaryCta) && (
              <div className="flex flex-col sm:flex-row gap-3">
                {finalCta.cta && <CTAButton href={finalCta.cta.href} label={finalCta.cta.label} variant="primary" />}
                {finalCta.secondaryCta && <CTAButton href={finalCta.secondaryCta.href} label={finalCta.secondaryCta.label} variant="ghost" />}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── EXPLORE MORE MODULES ── */}
      {moreModules && moreModules.modules.length > 0 && (
        <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
          <div className="max-w-[1160px] mx-auto">
            {moreModules.heading && (
              <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-center mb-10 md:mb-14 text-[#0a0f1e]">
                {(() => {
                  const [s, h] = splitHeadline(moreModules.heading, 2);
                  return (<>{s}<span style={{ color: "#1d4ed8" }}>{h}</span></>);
                })()}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              {moreModules.modules.map((mod, i) => (
                <MoreModuleCard
                  key={mod.slug}
                  mod={mod}
                  color={MODULE_COLORS[i % MODULE_COLORS.length]}
                  isLast={i === moreModules.modules.length - 1}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
