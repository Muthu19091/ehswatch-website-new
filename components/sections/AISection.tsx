"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { useInView } from "@/hooks/useInView";
import { basePath } from "@/lib/basePath";
import { normalizeUrl, isExternalUrl } from "@/lib/blocks";

// ─── Chat script ──────────────────────────────────────────────────────────────
const CHAT = [
  {
    role: "user" as const,
    label: "HSE LEAD",
    text: "Show me high-risk incidents in the last 6 months in Oman operations.",
    delay: 600,
  },
  {
    role: "iris" as const,
    label: "IRIS",
    text: "I found 18 high-risk incidents across Oman sites.\n7 related to working at height\n5 related to lifting operations\n4 related to electrical isolation\nWould you like a trend chart or site-wise breakdown?",
    delay: 2200,
    typingDelay: 900,
  },
  {
    role: "user" as const,
    label: "HSE LEAD",
    text: "Show site-wise breakdown.",
    delay: 4200,
  },
  {
    role: "iris" as const,
    label: "IRIS",
    text: "Site A: 8 | Site B: 6 | Site C: 4.\nSite A shows a 30% increase compared to the previous period.",
    delay: 6000,
    typingDelay: 4900,
  },
];

const LOOP_RESET = 9500;
const MAX_VISIBLE = 3;

interface AISectionProps {
  cmsHeading?: string;
  cmsBody?: string;
  cmsCtaLabel?: string;
  cmsCtaUrl?: string;
}

// ─── IRIS Chat widget ─────────────────────────────────────────────────────────
function IrisChat({ active }: { active: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!active) return;
    setVisibleCount(0);
    setShowTyping(false);

    const timers: ReturnType<typeof setTimeout>[] = [];

    CHAT.forEach((msg, i) => {
      if (msg.role === "iris" && msg.typingDelay !== undefined) {
        timers.push(setTimeout(() => setShowTyping(true), msg.typingDelay));
      }
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
          if (msg.role === "iris") setShowTyping(false);
        }, msg.delay)
      );
    });

    timers.push(
      setTimeout(() => {
        setVisibleCount(0);
        setShowTyping(false);
      }, LOOP_RESET)
    );

    return () => timers.forEach(clearTimeout);
  }, [active]);

  const all = CHAT.slice(0, visibleCount);
  const visible = all.slice(-MAX_VISIBLE);

  return (
    <div
      className="w-full rounded-[18px] overflow-hidden border border-[#dde6f5]"
      style={{
        background: "linear-gradient(180deg, #e8f1ff 0%, #f4f8ff 30%, #ffffff 70%)",
        boxShadow: "0 12px 40px rgba(21,94,239,0.10), 0 4px 16px rgba(21,94,239,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 border-b border-[#dde6f5]"
        style={{ background: "rgba(232,241,255,0.7)", backdropFilter: "blur(8px)" }}
      >
        {/* IRIS Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={basePath + "/images/iris-logo.png"}
          alt="IRIS"
          className="h-[28px] w-auto object-contain shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-[family-name:var(--font-dm-sans)] text-[9.5px] text-[#6b7280] tracking-[0.2px]">
            EHSQ AI AGENT · <span className="text-[#22c55e] font-medium">ONLINE</span>
          </p>
        </div>
        <span className="font-[family-name:var(--font-dm-sans)] text-[10px] text-[#9ca3af] shrink-0">11:02 AM</span>
      </div>

      {/* Messages area — 260 × 1.2 = 312px */}
      <div className="px-3 py-3 flex flex-col gap-2 h-[312px] justify-end overflow-hidden"
        style={{ background: "transparent" }}
      >
        {visible.map((msg, i) => (
          <div
            key={`${visibleCount}-${i}`}
            className={`flex flex-col gap-0.5 ${msg.role === "user" ? "items-end" : "items-start"}`}
            style={{ animation: "chat-appear 0.32s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-[8.5px] font-semibold tracking-[0.6px] text-[#9ca3af] uppercase px-1">
              {msg.label}
            </span>
            {msg.role === "user" ? (
              <div className="bg-[#155eef] rounded-[10px] rounded-tr-[3px] px-3 py-2 max-w-[85%]">
                <p className="font-[family-name:var(--font-dm-sans)] text-[11.5px] leading-[1.45] text-white">{msg.text}</p>
              </div>
            ) : (
              <div className="bg-[#f4f7fb] rounded-[10px] rounded-tl-[3px] px-3 py-2 max-w-[90%] border border-[#eaeff7]">
                <p className="font-[family-name:var(--font-dm-sans)] text-[11.5px] leading-[1.55] text-[#1b2437] whitespace-pre-line">{msg.text}</p>
              </div>
            )}
          </div>
        ))}

        {showTyping && (
          <div
            className="flex flex-col gap-0.5 items-start"
            style={{ animation: "chat-appear 0.28s ease both" }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-[8.5px] font-semibold tracking-[0.6px] text-[#9ca3af] uppercase px-1">IRIS</span>
            <div className="bg-[#f4f7fb] rounded-[10px] rounded-tl-[3px] px-3 py-2 border border-[#eaeff7] flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]"
                  style={{ animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-2 rounded-full px-3 py-2 border border-[#e4e9f2] bg-[#f8fafc] focus-within:border-[#155eef] transition-colors cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask IRIS anything…"
            className="flex-1 bg-transparent font-[family-name:var(--font-dm-sans)] text-[11px] text-[#374151] placeholder-[#9ca3af] outline-none"
          />
          <button
            className="w-6 h-6 rounded-full bg-[#155eef] flex items-center justify-center shrink-0 hover:bg-[#1a4fd6] transition-colors"
            onClick={() => setInputValue("")}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Parse <li><strong>X</strong> — rest</li> from CMS body HTML ─────────────
// CMS body arrives as HTML — after stripping tags, entities like &amp; and
// &nbsp; would otherwise render literally in JSX text.
function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function parseFeatures(html: string): Array<{ label: string; color: string }> {
  const colors = ["#155eef", "#7c3aed", "#0891b2", "#f97316"];
  const liMatches = html.match(/<li>[\s\S]*?<\/li>/g) || [];
  return liMatches.slice(0, 4).map((li, i) => {
    const strongMatch = li.match(/<strong>(.*?)<\/strong>/);
    const label = strongMatch ? strongMatch[1] : li.replace(/<[^>]+>/g, "").trim();
    return { label: decodeEntities(label), color: colors[i % colors.length] };
  });
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function AISection({ cmsHeading, cmsBody, cmsCtaLabel, cmsCtaUrl }: AISectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setActive(false);
    const t = setTimeout(() => setActive(true), 50);
    const loop = setInterval(() => {
      setActive(false);
      setTimeout(() => setActive(true), 50);
    }, LOOP_RESET + 200);
    return () => {
      clearTimeout(t);
      clearInterval(loop);
    };
  }, [inView]);

  // CMS-only: no hardcoded copy/features/CTA.
  const headingText = cmsHeading?.trim() || "";

  // Features are parsed from the CMS body's <li> items (none → no list).
  const features = (cmsBody && cmsBody.includes("<li>")) ? parseFeatures(cmsBody) : [];

  // Intro paragraph: first <p> of the CMS body (empty if none).
  const introMatch = cmsBody ? cmsBody.match(/<p>(.*?)<\/p>/) : null;
  const introParagraph = introMatch ? decodeEntities(introMatch[1].replace(/<[^>]+>/g, "")) : "";

  const ctaLabel = cmsCtaLabel?.trim() || "";
  const ctaUrl   = cmsCtaUrl ? normalizeUrl(cmsCtaUrl) : "";

  // Nothing configured for this block → hide the section (widget included).
  if (!headingText && !introParagraph && features.length === 0 && !ctaLabel) return null;

  return (
    <section ref={ref} className="bg-white py-12 md:py-[80px] px-4 md:px-6 overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 lg:gap-[60px]">

          {/* Left: text */}
          <Reveal variant="slide-right" duration={750} className="flex flex-col gap-4 md:gap-[18px] w-full md:max-w-[480px] min-w-0">
            <div className="flex flex-col gap-4 md:gap-[18px]">
            {headingText && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[40px] lg:text-[46px] leading-tight md:leading-[1.3] text-[#1b1b1b]">
              {headingText.includes("Safety Team") ? (
                <>
                  {headingText.split("Safety Team")[0]}
                  <span className="text-[#155eef]">Safety Team</span>
                  {headingText.split("Safety Team")[1]}
                </>
              ) : (
                headingText
              )}
            </h2>
            )}
            {introParagraph && (
            <p className="font-[family-name:var(--font-dm-sans)] text-[14px] md:text-[16px] lg:text-[17px] leading-relaxed text-[#727272] tracking-[-0.18px]">
              {introParagraph}
            </p>
            )}
            {features.length > 0 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-3 mt-2">
              {features.map(({ label, color }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <span
                    className="shrink-0 rounded-full mt-[5px]"
                    style={{ width: 6, height: 6, background: color, flexShrink: 0 }}
                  />
                  <span className="font-[family-name:var(--font-dm-sans)] text-[12.5px] md:text-[13px] font-medium text-[#2d3748] leading-snug tracking-[-0.1px]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            )}
            {ctaLabel && (() => {
              const ctaClass = "self-start mt-1 font-[family-name:var(--font-dm-sans)] text-[13px] md:text-[14px] font-semibold text-[#f97316] hover:text-[#ea6c00] transition-colors";
              // External URL → plain anchor in a new tab. Internal → Next Link so
              // the app basePath (/ehswatch-stage) is prepended (a plain <a> is not).
              return isExternalUrl(ctaUrl) ? (
                <a href={ctaUrl || "#"} target="_blank" rel="noopener noreferrer" className={ctaClass}>
                  {ctaLabel}
                </a>
              ) : (
                <Link href={ctaUrl || "#"} className={ctaClass}>
                  {ctaLabel}
                </Link>
              );
            })()}
            </div>
          </Reveal>

          {/* Right: standalone chat card */}
          <Reveal variant="slide-left" duration={750} delay={120} className="w-full md:max-w-[460px] min-w-0">
            <IrisChat active={active} />
          </Reveal>

        </div>
      </div>
    </section>
  );
}
