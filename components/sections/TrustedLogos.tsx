"use client";

import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import type { CmsClientLogo } from "@/lib/types";
import { mediaUrl } from "@/lib/blocks";
import { useMarqueeDuration } from "@/hooks/useMarqueeDuration";

export default function TrustedLogos({ cmsLogos, cmsHeading }: { cmsLogos?: CmsClientLogo[]; cmsHeading?: string }) {
  // CMS-only: no hardcoded logos/heading. Hide the section when the CMS has no logos.
  const heading = cmsHeading?.trim() || "";
  // A ClientLogo with no image attached (logo_id null) must not crash the
  // page — l.attributes.logo can itself be null, so resolve defensively via
  // mediaUrl() (same helper every other section uses for CMS media) and drop
  // any entry that has no resolvable src rather than rendering a broken img.
  const CLIENT_LOGOS = (cmsLogos ?? [])
    .map((l) => ({ src: mediaUrl(l?.attributes?.logo), alt: l?.attributes?.name ?? "" }))
    .filter((l): l is { src: string; alt: string } => Boolean(l.src));
  // Hooks must run unconditionally on every render -- call this BEFORE the
  // early return below, even though its result goes unused when there are
  // no logos to show.
  const { trackRef, durationSeconds } = useMarqueeDuration(3);
  if (CLIENT_LOGOS.length === 0) return null;
  const TRACK = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <section className="bg-white pt-16 md:pt-[80px] pb-10 md:pb-[60px]">
      <div className="flex flex-col gap-6 md:gap-[42px]">
        {heading && (
        <Reveal variant="fade-in" duration={1100}>
          <p
            className="font-[family-name:var(--font-inter)] font-normal text-[14px] md:text-[18px] leading-normal text-[rgba(15,23,42,0.45)] tracking-[-0.18px] text-center px-4"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        </Reveal>
        )}

        <Reveal variant="fade-in" duration={1400} delay={200}>
        <div
          dir="ltr"
          translate="no"
          className="relative overflow-hidden notranslate"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-10 md:gap-[56px] items-center animate-marquee-slow whitespace-nowrap w-max"
            style={durationSeconds ? { animationDuration: `${durationSeconds}s` } : undefined}
          >
            {TRACK.map((logo, i) => (
              <div
                key={`${logo.alt}-${i}`}
                className="shrink-0 transition-opacity duration-300 ease-out"
                style={{ opacity: 0.5 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={100}
                  height={40}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
