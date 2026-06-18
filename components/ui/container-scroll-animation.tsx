"use client";
import React, { useRef, useState } from "react";
import {
  useScroll,
  useTransform,
  motion,
  MotionValue,
  useMotionValueEvent,
} from "framer-motion";

// ─── ContainerScroll ─────────────────────────────────────────────────────────
export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Start true (mobile-first) so the very first render never applies
  // desktop rotateX/scale on a mobile screen before useEffect runs
  const [isMobile, setIsMobile] = useState(true);
  const [isFlat,   setIsFlat]   = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Detect "fully flat" — triggers idle float animation
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIsFlat(v > 0.85);
  });

  // Tilt flattens over first 75% of scroll
  const rotate    = useTransform(scrollYProgress, [0, 0.75], isMobile ? [10, 0] : [14, 0]);
  const scale     = useTransform(scrollYProgress, [0, 0.75], isMobile ? [0.8, 0.95] : [1.03, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div
      ref={containerRef}
      className="h-[60rem] md:h-[80rem] flex items-start justify-center relative px-2 md:px-20 pt-[77px] md:pt-[98px]"
    >
      <div className="w-full relative" style={{ perspective: "1200px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale} translate={translate} isFlat={isFlat}>
          {children}
        </Card>
      </div>
    </div>
  );
};

// ─── Header ──────────────────────────────────────────────────────────────────
export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => (
  <motion.div
    style={{ translateY: translate }}
    className="max-w-5xl mx-auto text-center"
  >
    {titleComponent}
  </motion.div>
);

// ─── Card ────────────────────────────────────────────────────────────────────
export const Card = ({
  rotate,
  scale,
  isFlat,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  isFlat: boolean;
  children: React.ReactNode;
}) => (
  // Outer: handles scroll-driven 3D tilt + scale
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow: "0 2px 8px rgba(0,0,0,0.03), 0 8px 20px rgba(0,0,0,0.04)",
    }}
    className="max-w-5xl mt-4 md:mt-6 mx-auto h-[30rem] md:h-[40rem] w-full"
  >
    {/* Inner: idle float once flat */}
    <motion.div
      className="w-full h-full border-2 border-[#d1d5db] bg-white rounded-[22px] overflow-hidden"
      animate={
        isFlat
          ? {
              y: [0, -7, 0],
              boxShadow: [
                "0 2px 8px rgba(0,0,0,0.03), 0 8px 20px rgba(0,0,0,0.04)",
                "0 6px 20px rgba(0,0,0,0.05), 0 16px 36px rgba(0,0,0,0.05)",
                "0 2px 8px rgba(0,0,0,0.03), 0 8px 20px rgba(0,0,0,0.04)",
              ],
            }
          : { y: 0 }
      }
      transition={
        isFlat
          ? {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
            }
          : { duration: 0.4, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  </motion.div>
);
