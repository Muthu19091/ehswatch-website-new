"use client";

import { useInView } from "@/hooks/useInView";
import CmsIcon, { type LucideIconName } from "@/components/ui/CmsIcon";

interface PainPointItem {
  label: string;
  description?: string;
  icon?: string;
}

interface PainPointsProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsItems?: PainPointItem[];
}

const FALLBACK_PAIN_POINTS: Array<{
  icon: string;
  label: string;
  bobDuration: string;
  amplitude: string;
  bobDelay: string;
}> = [
  { icon: "layers",       label: "Data scattered across platforms",  bobDuration: "3.2s", amplitude: "10px", bobDelay: "0s" },
  { icon: "clock-alert",  label: "Delayed reporting and follow-up",  bobDuration: "3.8s", amplitude: "8px",  bobDelay: "0.5s" },
  { icon: "eye-off",      label: "Limited visibility into problems", bobDuration: "3.5s", amplitude: "12px", bobDelay: "0.3s" },
  { icon: "shield-alert", label: "Reactive compliance checks",       bobDuration: "3.0s", amplitude: "6px",  bobDelay: "1.0s" },
];

// Bob animation values for CMS items (cycle through defaults)
const BOB_PARAMS = [
  { bobDuration: "3.2s", amplitude: "10px", bobDelay: "0s" },
  { bobDuration: "3.8s", amplitude: "8px",  bobDelay: "0.5s" },
  { bobDuration: "3.5s", amplitude: "12px", bobDelay: "0.3s" },
  { bobDuration: "3.0s", amplitude: "6px",  bobDelay: "1.0s" },
];

// Default icons per slot when a CMS item has no icon set
const SLOT_FALLBACK_ICONS: LucideIconName[] = ["layers", "clock-alert", "eye-off", "shield-alert"];

// Concentric ring sizes (px). 4 rings only. Largest first so smaller rings sit on top.
const RING_SIZES = [1060, 800, 570, 340];

export default function PainPoints({ cmsHeading, cmsSubheading, cmsItems }: PainPointsProps) {
  const { ref } = useInView<HTMLDivElement>({ threshold: 0.2 });

  // Build pain points from CMS or fallback
  const painPoints = (cmsItems && cmsItems.length > 0)
    ? cmsItems.map((item, i) => ({
        icon: item.icon,
        fallbackIcon: SLOT_FALLBACK_ICONS[i % SLOT_FALLBACK_ICONS.length],
        label: item.label.trim(),
        ...BOB_PARAMS[i % BOB_PARAMS.length],
      }))
    : FALLBACK_PAIN_POINTS.map((p, i) => ({
        ...p,
        fallbackIcon: SLOT_FALLBACK_ICONS[i],
      }));

  const [tl, tr, bl, br] = painPoints;

  // Heading: the CMS follows the "<span>highlight</span>" convention inside a
  // single heading string — split it into the dark line and the blue line.
  // Without a span, fall back to heading + subheading as two lines.
  const spanMatch = cmsHeading?.match(/^([\s\S]*?)<span[^>]*>([\s\S]*?)<\/span>/i);
  const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").trim();
  const headingLine1 = (spanMatch ? stripTags(spanMatch[1]) : cmsHeading && stripTags(cmsHeading)) || "Manual Safety Processes Are";
  const headingLine2 = (spanMatch ? stripTags(spanMatch[2]) : cmsSubheading) || "Slowing You Down";

  return (
    <section
      ref={ref}
      className="relative py-4 md:py-8 px-4 md:px-6 pb-10 md:pb-14 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 30% 40% at center, #eef4ff 0%, #f5f8ff 35%, #fafbff 65%, #ffffff 100%)",
      }}
    >
      {/* Bottom fade blend into metrics section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom, transparent 0%, #ffffff 100%)" }}
        aria-hidden
      />

      {/* Concentric rings — desktop only */}
      <div
        className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        {RING_SIZES.map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: `1px solid rgba(21,94,239,${0.05 + i * 0.03})`,
              animation: `ring-pulse ${7 + i * 0.3}s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-[1100px] mx-auto z-10">
        {/* Desktop layout */}
        <div className="hidden md:flex flex-col gap-5 lg:gap-[24px] items-center py-3 lg:py-6">
          <div className="flex justify-between w-full max-w-[850px]">
            {tl && <PainPill {...tl} />}
            {tr && <PainPill {...tr} />}
          </div>

          <div className="text-center">
            <p className="font-[family-name:var(--font-gothic-a1)] font-bold text-[24px] lg:text-[32px] leading-tight lg:leading-[48px] text-[#1b1b1b] tracking-[-0.5px] lg:tracking-[-0.6px]">
              {headingLine1}
            </p>
            <p className="font-[family-name:var(--font-gothic-a1)] font-bold text-[24px] lg:text-[32px] leading-tight lg:leading-[48px] text-[#155eef] tracking-[-0.5px] lg:tracking-[-0.6px]">
              {headingLine2}
            </p>
          </div>

          <div className="flex justify-between w-full max-w-[850px]">
            {bl && <PainPill {...bl} />}
            {br && <PainPill {...br} />}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col gap-6 items-center py-8">
          <div className="text-center">
            <p className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[30px] leading-tight text-[#1b1b1b] tracking-[-0.5px]">
              {headingLine1}
            </p>
            <p className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[30px] leading-tight text-[#155eef] tracking-[-0.5px]">
              {headingLine2}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-[400px]">
            {painPoints.map((p) => (
              <PainPill key={p.label} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PainPill({
  icon,
  fallbackIcon,
  label,
  bobDuration,
  amplitude,
  bobDelay,
}: {
  icon?: string;
  fallbackIcon: LucideIconName;
  label: string;
  bobDuration: string;
  amplitude: string;
  bobDelay: string;
}) {
  return (
    <div
      className="flex items-center gap-2 sm:gap-[10px] pl-2 sm:pl-[10px] pr-3 sm:pr-[16px] py-1.5 sm:py-[8px] rounded-full border border-[rgba(0,96,249,0.18)] bg-[rgba(255,255,255,0.94)] backdrop-blur-[3px] shadow-[0px_3px_8px_rgba(59,130,246,0.1)] shrink-0"
      style={{
        animation: `chip-sine ${bobDuration} ${bobDelay} ease-in-out infinite alternate`,
        ["--bob-amp" as string]: amplitude,
      }}
    >
      <div className="w-9 h-9 sm:w-[40px] sm:h-[40px] rounded-full bg-[#dbeafe] flex items-center justify-center shrink-0">
        <CmsIcon icon={icon} fallback={fallbackIcon} size={22} strokeWidth={2} color="#1d4ed8" />
      </div>
      <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[11px] sm:text-[12px] lg:text-[14px] leading-normal text-[#0a0f1e] tracking-[-0.2px] lg:tracking-[-0.3px] whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
