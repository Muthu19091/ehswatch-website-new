"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos    = useRef({ x: -100, y: -100 });
  const curr   = useRef({ x: -100, y: -100 });
  const prev   = useRef({ x: -100, y: -100 });
  const raf    = useRef<number>(0);
  const hovering = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const el = dotRef.current;
      if (el) {
        prev.current = { x: curr.current.x, y: curr.current.y };
        curr.current.x = lerp(curr.current.x, pos.current.x, 0.17);
        curr.current.y = lerp(curr.current.y, pos.current.y, 0.17);

        const dx = curr.current.x - prev.current.x;
        const dy = curr.current.y - prev.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Stretch in direction of travel — max 1.8x, compress perpendicular
        const stretch = hovering.current ? 1 : Math.min(1 + speed * 0.09, 1.8);
        const squeeze = hovering.current ? 1 : 1 / stretch;

        const size = hovering.current ? 38 : 16;

        el.style.left   = `${curr.current.x}px`;
        el.style.top    = `${curr.current.y}px`;
        el.style.width  = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${speed > 0.5 ? angle : 0}deg) scaleX(${stretch}) scaleY(${squeeze})`;
        el.style.opacity = hovering.current ? "0.55" : "1";
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };

    const attach = () => {
      document.querySelectorAll("a, button, [role=button]").forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot {
          pointer-events: none;
          position: fixed;
          top: 0; left: 0;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #f05a28;
          z-index: 99999;
          will-change: transform, left, top, width, height;
          transition: width 180ms ease, height 180ms ease;
        }
        /* Touch devices have no mouse — the effect bails but the dot element
           still mounts at 0,0. Hide it so no static orange dot shows on mobile. */
        @media (hover: none), (pointer: coarse) {
          .cursor-dot { display: none !important; }
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
