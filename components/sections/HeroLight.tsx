"use client";

import Link from "next/link";
import HeroDashboard from "@/components/sections/HeroDashboard";
import GlareButton from "@/components/ui/GlareButton";

export default function HeroLight() {
  return (
    <section
      className="relative w-full pb-[60px] sm:pb-[80px] md:pb-[100px] overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, white 0%, white 85%, rgba(248,250,252,0.5) 100%)",
      }}
    >
      {/* ── Animated grid background (Product-page style) ── */}
      <style>{`
        .hero-grid-container {
          background-image:
            linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        @keyframes heroGridFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.6; }
        }
        .hero-grid-box {
          position: absolute;
          width: 48px;
          height: 48px;
        }
      `}</style>

      {/* Grid layer — explicit z-0 keeps it strictly behind all content.
          CSS mask-image punches a transparent ellipse over the text zone so
          animated squares never bleed into headings/CTAs — no column/row math needed. */}
      <div
        className="absolute inset-0 hero-grid-container pointer-events-none overflow-hidden"
        style={{
          zIndex: 0,
          maskImage: "radial-gradient(ellipse 55% 50% at 50% 45%, transparent 40%, black 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 55% 50% at 50% 45%, transparent 40%, black 70%)",
        }}
      >
        {/* 32 cols × 10 rows = 1600 px wide, covers any normal desktop viewport.
            The mask's transparent ellipse hides the center; visible squares are
            evenly spread across the left AND right edges automatically. */}
        {Array.from({ length: 320 }, (_, i) => {
          const COLS = 32;
          const row = Math.floor(i / COLS);
          const col = i % COLS;
          // Deterministic spread: every 17th index (both left + right columns get hits)
          const shouldAnimate = (i * 10) % 17 === 0;
          const colorVariant = i % 4;
          const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
          const animationDelay = (i * 0.45) % 4;
          const animationDuration = 4 + ((i * 2) % 6);
          return shouldAnimate ? (
            <div
              key={`hgb-${i}`}
              className="hero-grid-box"
              style={{
                left: `${col * 50 + 1}px`,
                top: `${row * 50 + 1}px`,
                backgroundColor: colors[colorVariant],
                animation: `heroGridFill ${animationDuration}s ease-in-out infinite`,
                animationDelay: `${animationDelay}s`,
              }}
            />
          ) : null;
        })}

        {/* Bottom fade so dashboard sits on clean white */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 70%, white 100%)",
          }}
        />
      </div>

      {/* ── Hero copy ── */}
      <div className="relative z-10 max-w-[948px] mx-auto px-5 sm:px-6 pt-[130px] sm:pt-[150px] md:pt-[170px] flex flex-col items-center text-center gap-2 sm:gap-3">
        <h1
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[48px] md:text-[62px] lg:text-[72px] leading-[1.06] text-gray-900 tracking-[-0.02em] animate-hero-rise"
          style={{ animationDelay: "60ms" }}
        >
          From Manual Chaos to{" "}
          <br className="hidden sm:block" />
          <span style={{ color: "#1d4ed8" }}>Smart Safety.</span>
        </h1>

        <p
          className="font-[family-name:var(--font-dm-sans)] font-medium text-[15px] sm:text-[17px] md:text-[19px] leading-relaxed text-gray-500 mt-2 max-w-[540px] px-4 animate-hero-rise"
          style={{ animationDelay: "180ms" }}
        >
          AI-powered EHS platform to streamline reporting everywhere.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center mt-4 sm:mt-5 animate-hero-rise"
          style={{ animationDelay: "300ms" }}
        >
          {/* Book a Demo */}
          <GlareButton
            href="#"
            className="px-8 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-white transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundImage:
                "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.35)",
            }}
          >
            Book a Demo
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </GlareButton>

          {/* Watch Demo */}
          <Link
            href="#"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] font-medium text-[15px] text-gray-700 hover:text-gray-900 transition-colors group"
          >
            <span className="flex items-center justify-center w-[34px] h-[34px] rounded-full border border-gray-300 group-hover:border-gray-500 group-hover:bg-gray-50 transition-all">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                <polygon points="3,1 13,7 3,13" fill="currentColor" />
              </svg>
            </span>
            Watch Demo
          </Link>
        </div>
      </div>

      {/* ── Dashboard image ── */}
      <div className="relative z-10 mt-[48px] sm:mt-[60px] md:mt-[72px] mx-auto max-w-[1100px] px-3 sm:px-5">
        <div
          className="relative rounded-[14px] sm:rounded-[22px] overflow-hidden shadow-[0_24px_64px_-12px_rgba(0,0,0,0.14)] sm:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.18)] border border-gray-200 bg-white animate-dashboard-reveal"
          style={{ animationDelay: "400ms" }}
        >
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
