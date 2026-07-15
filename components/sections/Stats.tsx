"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { useInView } from "@/hooks/useInView";

interface CmsStatItem {
  value: string;
  suffix?: string | null;
  label: string;
}

interface StatsCmsProps {
  cmsItems?: CmsStatItem[] | undefined;
  cmsHeading?: string | undefined;
}

// ─── Hardcoded fallback data ───────────────────────────────────────────────────
const FALLBACK_STATS = [
  { target: 20,    display: (n: number) => `${Math.round(n)}`,                                                                     suffix: "+", label: "Years of proven expertise in EHS management" },
  { target: 25000, display: (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 25000 ? 0 : 1)}K` : `${Math.round(n)}`),       suffix: "+", label: "Professionals across industries rely on our platform daily" },
  { target: 95,    display: (n: number) => `${Math.round(n)}`,                                                                     suffix: "%", label: "Users rate us highly for ease of use and workflow impact" },
  { target: 60,    display: (n: number) => `${Math.round(n)}`,                                                                     suffix: "%", label: "Reduction in incident reporting time across teams" },
];

// ─── Parse a CMS value string like "25,000+" or "95" into a numeric target ───
function parseTarget(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
}

// ─── Determine suffix from CMS explicit suffix field or infer from value string ───
function parseSuffix(value: string, suffix?: string | null): string {
  if (suffix) return suffix;
  if (value.endsWith("+")) return "+";
  if (value.endsWith("%")) return "%";
  return "";
}

// ─── Format display value: use K notation for large numbers ──────────────────
function makeDisplay(target: number): (n: number) => string {
  if (target >= 1000) {
    return (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= target ? 0 : 1)}K` : `${Math.round(n)}`);
  }
  return (n: number) => `${Math.round(n)}`;
}

const DURATION = 2000;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function Counter({
  target,
  display,
  start,
  delay,
}: {
  target: number;
  display: (n: number) => string;
  start: boolean;
  delay: number;
}) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;
    let raf = 0;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, elapsed / DURATION);
      setValue(target * easeOut(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, delay]);

  return <>{display(value)}</>;
}

export default function Stats({ cmsItems, cmsHeading }: StatsCmsProps = {}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const heading = cmsHeading?.trim();

  // Build the stats array: use CMS data if available, else hardcoded fallback
  const stats =
    cmsItems && cmsItems.length > 0
      ? cmsItems.map((item) => {
          const target = parseTarget(item.value || "0");
          const suffix = parseSuffix(item.value || "", item.suffix);
          const display = makeDisplay(target);
          return { target, display, suffix, label: item.label || "" };
        })
      : FALLBACK_STATS.map((s) => ({
          target: s.target,
          display: s.display,
          suffix: s.suffix,
          label: s.label,
        }));

  return (
    <section ref={ref} className="bg-white py-10 md:py-[73px]">
      {heading && (
        <div className="max-w-[1280px] mx-auto px-6 md:px-[32px] mb-8 md:mb-12 text-center">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] md:text-[38px] leading-tight text-[#0a1628] tracking-[-0.02em]">
            {heading}
          </h2>
        </div>
      )}
      <div className="max-w-[1280px] mx-auto px-6 md:px-[32px] grid grid-cols-2 md:grid-cols-4 gap-y-10">
        {stats.map((stat, i) => (
          <Reveal
            key={`stat-${i}-${stat.label}`}
            variant={i % 2 === 0 ? "slide-right" : "slide-left"}
            delay={i * 100}
            duration={700}
            className="flex flex-col gap-2 md:gap-[13.3px] items-center px-2 md:px-[40px] py-2 md:py-[16px]"
          >
            <div className="flex items-baseline tabular-nums" translate="no">
              <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[34px] sm:text-[44px] md:text-[56px] lg:text-[66px] leading-none tracking-[-1px] sm:tracking-[-1.5px] md:tracking-[-2.97px] text-[#0a1628]">
                <Counter target={stat.target} display={stat.display} start={inView} delay={i * 120} />
              </span>
              <span className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[18px] sm:text-[24px] md:text-[30px] lg:text-[34px] leading-none tracking-[-0.4px] md:tracking-[-0.68px] text-[#0a1628]">
                {stat.suffix}
              </span>
            </div>

            <div className="flex flex-col items-center max-w-[140px] sm:max-w-[190px]">
              <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[12px] md:text-[14px] lg:text-[16px] leading-tight md:leading-[24.1px] text-[#404040] text-center">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
