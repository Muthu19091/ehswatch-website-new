"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CmsTestimonial } from "@/lib/types";

interface TestimonialItem { quote: string; author: string }

const FALLBACK_TESTIMONIALS: TestimonialItem[] = [
  { quote: "Everything. Our field teams report incidents in minutes, not days.", author: "EHS Director, Construction Firm" },
  { quote: "EHSWatch transformed how we manage compliance — what used to take weeks now takes hours.", author: "Safety Manager, Oil & Gas" },
  { quote: "The mobile-first approach means our site workers actually use it. Adoption went through the roof.", author: "HSE Lead, Manufacturing" },
  { quote: "Real-time visibility across all our sites. We caught three potential incidents before they escalated.", author: "EHSQ Director, Logistics" },
  { quote: "Finally, a platform that speaks the language of safety professionals, not just developers.", author: "Compliance Officer, Utilities" },
];

function StarRow() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#f4a261">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials({ title, cmsItems }: { title?: React.ReactNode; cmsItems?: CmsTestimonial[] }) {
  const TESTIMONIALS: TestimonialItem[] = cmsItems && cmsItems.length > 0
    ? cmsItems.map((t) => ({ quote: t.attributes.quote, author: `${t.attributes.author_role}, ${t.attributes.author_company}` }))
    : FALLBACK_TESTIMONIALS;
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const posRef = useRef(0);
  const rafRef = useRef(0);

  // Seamless auto-scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const SPEED = 1.0; // px per frame

    const tick = () => {
      if (!paused) {
        posRef.current += SPEED;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  // Double the array for seamless loop
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section translate="no" className="bg-white py-12 md:py-[80px] overflow-hidden">
      {/* Heading */}
      <div className="px-4 md:px-6 text-center mb-8 md:mb-12">
        <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] leading-tight text-[#1b1b1b]">
          {title ?? <>What <span className="text-[#155eef]">Our Customers</span> Say</>}
        </h2>
      </div>

      {/* Scrolling track */}
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div ref={trackRef} className="flex gap-5 w-max will-change-transform">
          {items.map((t, i) => (
            <div
              key={i}
              className="relative w-[260px] sm:w-[320px] md:w-[380px] shrink-0 rounded-[16px] overflow-hidden border border-[#e8edf8] px-5 sm:px-8 py-6 sm:py-7"
              style={{
                background: "linear-gradient(135deg, #ffffff 60%, #eef4ff 100%)",
              }}
            >
              <div className="relative z-10 flex flex-col gap-4">
                <StarRow />
                <p className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] md:text-[15px] leading-[1.55] text-[#0a1628]">
                  {t.quote}
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[11px] tracking-[0.8px] uppercase text-[#155eef] font-semibold">
                  {t.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
