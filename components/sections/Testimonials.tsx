"use client";

import React, { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote: "EHSWatch standardised EHS processes across our 12 companies, eliminated paper workflows, and gave us real-time visibility with exceptionally clear dashboards and a fast, reliable mobile app.",
    author: "Muhammad Fahad A — SR. QHSE ADVISOR, BARIK GROUP",
  },
  {
    quote: "We use EHSWatch for daily observations and inspections. It meets our expectations across many features, and the training metrics are especially valuable for tracking expiries and active courses.",
    author: "Afad K — HSE OFFICER, AL BARAKA OILFIELD SERVICES",
  },
  {
    quote: "We use EHSWatch to manage inspections, report observations and track incidents. Real-time corrective action reporting lets us assign tasks immediately from site, ensuring nothing is missed.",
    author: "Dijin D — HSE ENGINEER, POWER CHINA – HDEC",
  },
  {
    quote: "EHSWatch is far more efficient than other tools we've used. It saves time, reduces paperwork and ensures a faster, more reliable way of working.",
    author: "Mohammed Al Harthy — HSE MANAGER, AL SUMRI TRANSPORT CO.",
  },
  {
    quote: "We customised EHSWatch to match our needs and can extract data from anywhere, at any time. Regular updates help maintain smooth operations.",
    author: "GK Yuvaraj P — OMAN NATIONAL ENGINEERING AND INVESTMENT CO.",
  },
  {
    quote: "EHSWatch gives us a single platform for incidents, observations, audits, file management and inspections. Automated workflows and real-time dashboards speed up corrective-action tracking, and the mobile app makes field reporting simple.",
    author: "Anish R — SPECIAL OILFIELD SERVICES",
  },
  {
    quote: "EHSWatch is well structured and easy to follow. It simplifies monthly and yearly data summaries and progress tracking.",
    author: "Amwaj A — QUALITY ASSURANCE ENGINEER, OMAN CABLES",
  },
  {
    quote: "EHSWatch is customisable to our business needs, easy to navigate and user-friendly.",
    author: "Asif Ali — QUALITY MANAGER, SPECIAL OILFIELD SERVICES",
  },
  {
    quote: "EHSWatch gives us a single, well-organised platform for reporting, tracking and resolving safety issues. It streamlines workflows, improves transparency and enhances communication among teams.",
    author: "Basma — HSE OFFICER, OMAN CABLES",
  },
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

export default function Testimonials({ title }: { title?: React.ReactNode }) {
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
    <section className="bg-white py-12 md:py-[80px] overflow-hidden">
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
