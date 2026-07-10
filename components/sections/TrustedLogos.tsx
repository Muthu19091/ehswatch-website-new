"use client";

import Reveal from "@/components/ui/Reveal";
import Image from "next/image";
import { basePath } from "@/lib/basePath";
import type { CmsClientLogo } from "@/lib/types";

const FALLBACK_LOGOS = [
  { src: basePath + "/images/clients/al-sumri.png",      alt: "Al Sumri" },
  { src: basePath + "/images/clients/albaraka.png",      alt: "AlBaraka" },
  { src: basePath + "/images/clients/bunduq.png",        alt: "Bunduq" },
  { src: basePath + "/images/clients/dct.png",           alt: "DCT" },
  { src: basePath + "/images/clients/ewowdm.png",        alt: "EWOWDM" },
  { src: basePath + "/images/clients/emirates-post.png", alt: "Emirates Post" },
  { src: basePath + "/images/clients/ndc.png",           alt: "NDC" },
  { src: basePath + "/images/clients/oapil.png",         alt: "OAPIL" },
  { src: basePath + "/images/clients/omifco.png",        alt: "OMIFCO" },
  { src: basePath + "/images/clients/oneic.png",         alt: "ONEIC" },
  { src: basePath + "/images/clients/opal.png",          alt: "OPAL" },
  { src: basePath + "/images/clients/oman-cables.png",   alt: "Oman Cables" },
  { src: basePath + "/images/clients/power-china.png",   alt: "Power China" },
  { src: basePath + "/images/clients/qia.png",           alt: "QIA" },
  { src: basePath + "/images/clients/sos.png",           alt: "SOS" },
  { src: basePath + "/images/clients/synergies.png",     alt: "Synergies" },
];

export default function TrustedLogos({ cmsLogos }: { cmsLogos?: CmsClientLogo[] }) {
  const CLIENT_LOGOS = cmsLogos && cmsLogos.length > 0
    ? cmsLogos.map((l) => ({ src: l.attributes.logo.attributes.url, alt: l.attributes.name }))
    : FALLBACK_LOGOS;
  const TRACK = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];
  return (
    <section translate="no" className="bg-white pt-16 md:pt-[80px] pb-10 md:pb-[60px]">
      <div className="flex flex-col gap-6 md:gap-[42px]">
        <Reveal variant="fade-in" duration={1100}>
          <p className="font-[family-name:var(--font-inter)] font-normal text-[14px] md:text-[18px] leading-normal text-[rgba(15,23,42,0.45)] tracking-[-0.18px] text-center px-4">
            Trusted by Teams Across Industries
          </p>
        </Reveal>

        <Reveal variant="fade-in" duration={1400} delay={200}>
        <div
          dir="ltr"
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          }}
        >
          <div className="flex gap-10 md:gap-[56px] items-center animate-marquee-slow whitespace-nowrap w-max">
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
