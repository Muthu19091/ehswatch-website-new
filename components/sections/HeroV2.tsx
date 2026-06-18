"use client";

import Link from "next/link";
import HeroDashboard from "@/components/sections/HeroDashboard";
import DotGrid from "@/components/ui/DotGrid";
import GlareButton from "@/components/ui/GlareButton";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroV2() {
  return (
    <section className="relative w-full bg-white overflow-hidden">

      {/* DotGrid background */}
      <div className="absolute inset-0 z-0">
        <DotGrid />
      </div>

      {/* White radial mask behind text */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% 18%, rgba(255,255,255,0.88) 30%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0) 78%)",
        }}
      />

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
        style={{
          height: "220px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, #ffffff 100%)",
        }}
      />

      <div className="relative z-20">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center text-center gap-3 px-4 pb-16 md:pb-8">
              <h1
                className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[48px] md:text-[62px] lg:text-[72px] xl:text-[77px] leading-[1.1] text-[#0f172a] tracking-[0.2px] lg:tracking-[0.5px] animate-hero-rise"
                style={{ animationDelay: "60ms" }}
              >
                From Manual Chaos to <br className="hidden sm:block" /> Smart Safety.
              </h1>

              <p
                className="font-[family-name:var(--font-dm-sans)] font-medium text-[15px] sm:text-[17px] lg:text-[20px] leading-relaxed text-[#475569] max-w-[580px] animate-hero-rise text-pretty"
                style={{ animationDelay: "180ms" }}
              >
                AI-powered EHS platform to streamline reporting everywhere.
              </p>

              <div
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center mt-2 animate-hero-rise"
                style={{ animationDelay: "300ms" }}
              >
                <GlareButton
                  href="#"
                  className="px-7 py-[10px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[16px] sm:text-[18px] text-white whitespace-nowrap"
                  style={{
                    background: "linear-gradient(102deg, #ffa964 0%, #ff8e37 34%, #ff7812 50%, #ff6d00 120%)",
                  }}
                >
                  Book a Demo
                </GlareButton>

                <Link
                  href="#"
                  className="flex items-center gap-2 font-[family-name:var(--font-dm-sans)] font-medium text-[15px] sm:text-[17px] text-[#0f172a] whitespace-nowrap group"
                >
                  <span className="flex items-center justify-center w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] rounded-full border border-[#0f172a]/25 group-hover:bg-[#0f172a]/5 transition-colors">
                    <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                      <polygon points="3,1 13,7 3,13" fill="#0f172a" />
                    </svg>
                  </span>
                  Watch Demo
                </Link>
              </div>
            </div>
          }
        >
          <HeroDashboard />
        </ContainerScroll>
      </div>

    </section>
  );
}
