"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { basePath } from "@/lib/basePath";

/* ── Nav config ────────────────────────────────────────────────────
   hideOnScroll: true  → fades out when navbar collapses to pill
   hasDropdown: true   → renders a hover-dropdown
   ─────────────────────────────────────────────────────────────── */
const ALL_NAV = [
  { label: "About Us",  href: "/about",        hideOnScroll: true,  hasDropdown: false },
  { label: "Products",  href: "/product",      hideOnScroll: false, hasDropdown: false },
  { label: "IRIS",      href: "/iris",         hideOnScroll: false, hasDropdown: false },
  { label: "Solutions", href: "/solutions-v2", hideOnScroll: false, hasDropdown: false },
  { label: "Pricing",   href: "/pricing",      hideOnScroll: false, hasDropdown: false },
  { label: "Resources", href: "#",             hideOnScroll: false, hasDropdown: true  },
  { label: "Contact Us", href: "/contact-us",   hideOnScroll: true,  hasDropdown: false },
];

const RESOURCES_ITEMS = [
  { label: "Blog",         href: "/blog",         desc: "Safety insights & best practices", img: "/images/blogs/blog-2.png" },
  { label: "Case Studies", href: "/case-studies", desc: "See how teams use EHSWatch",       img: "/images/blogs/blog-3.png" },
];

const SCROLL_END = 480;  // px over which the full morph completes (higher = slower/smoother)
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(p: number) {
  // ease-in-out-sine — very gentle start and end, no harsh jump
  return -(Math.cos(Math.PI * p) - 1) / 2;
}

export default function Navbar({
  lightHero = false,
}: {
  lightHero?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [ctaFill, setCtaFill] = useState({ x: 0, y: 0, on: false });

  const headerRef          = useRef<HTMLElement>(null);
  const navRef             = useRef<HTMLElement>(null);
  const logoWhiteRef       = useRef<HTMLImageElement>(null);
  const logoDarkRef        = useRef<HTMLImageElement>(null);
  const linkRefs           = useRef<(HTMLElement | null)[]>([]);
  const ctaRef             = useRef<HTMLAnchorElement>(null);
  const hamburgerStrokeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastT = -1;

    const apply = () => {
      const header = headerRef.current;
      const nav    = navRef.current;
      if (!header || !nav) { raf = 0; return; }

      // On mobile/tablet, always use a solid white background — skip the scroll animation
      if (window.innerWidth <= 1024) {
        nav.style.background     = "rgba(255,255,255,0.97)";
        nav.style.boxShadow      = "0 2px 12px rgba(0,0,0,0.07)";
        nav.style.backdropFilter = "blur(12px)";
        if (hamburgerStrokeRef.current) {
          hamburgerStrokeRef.current.setAttribute("stroke", "rgb(40,40,40)");
        }
        raf = 0; return;
      }

      const raw = Math.min(1, Math.max(0, window.scrollY / SCROLL_END));
      const t   = ease(raw);

      if (Math.abs(t - lastT) < 0.001) { raf = 0; return; }
      lastT = t;

      // ── Header outer padding ──────────────────────────────────
      header.style.paddingLeft  = `${lerp(0, 20, t)}px`;
      header.style.paddingRight = `${lerp(0, 20, t)}px`;
      header.style.paddingTop   = `${lerp(0, 12, t)}px`;

      // ── Nav pill shape ────────────────────────────────────────
      nav.style.paddingLeft    = `${lerp(40, 16, t)}px`;
      nav.style.paddingRight   = `${lerp(40, 10, t)}px`;
      nav.style.paddingTop     = nav.style.paddingBottom = `${lerp(14, 7, t)}px`;
      nav.style.maxWidth       = `${lerp(2400, 860, t)}px`;
      nav.style.borderRadius   = `${lerp(0, 9999, t)}px`;
      nav.style.gap            = `${lerp(0, 0, t)}px`;   // gap handled per-link via padding
      nav.style.background     = `rgba(255,255,255,${lerp(0, 0.92, t)})`;
      nav.style.boxShadow      = `0 8px 32px rgba(0,0,0,${lerp(0, 0.10, t)})`;
      nav.style.backdropFilter = `blur(${lerp(0, 12, t)}px)`;

      // ── Logo crossfade ────────────────────────────────────────
      if (logoWhiteRef.current) logoWhiteRef.current.style.opacity = `${lerp(lightHero ? 0 : 1, 0, t)}`;
      if (logoDarkRef.current)  logoDarkRef.current.style.opacity  = `${lerp(lightHero ? 1 : 0, 1, t)}`;

      // ── Nav links ─────────────────────────────────────────────
      const linkStart = lightHero ? 30 : 255;
      const lc      = Math.round(lerp(linkStart, 30, t));
      const lColor  = `rgb(${lc},${lc},${lc})`;
      const lShadow = (!lightHero && t < 0.3) ? "0 1px 4px rgba(0,0,0,0.4)" : "none";
      // Link padding stays fixed — only hideOnScroll items collapse
      const LINK_PX = 14;

      linkRefs.current.forEach((el, i) => {
        if (!el) return;
        const cfg = ALL_NAV[i];

        el.style.color      = lColor;
        el.style.textShadow = lShadow;

        if (cfg.hideOnScroll) {
          // Fade + collapse width to zero
          el.style.opacity       = `${lerp(1, 0, t)}`;
          el.style.maxWidth      = `${lerp(160, 0, t)}px`;
          el.style.paddingLeft   = `${lerp(LINK_PX, 0, t)}px`;
          el.style.paddingRight  = `${lerp(LINK_PX, 0, t)}px`;
          el.style.overflow      = "hidden";
          el.style.pointerEvents = t > 0.6 ? "none" : "auto";
        } else {
          // Spacing unchanged — pill effect comes from outer nav shrinking
          el.style.paddingLeft  = `${LINK_PX}px`;
          el.style.paddingRight = `${LINK_PX}px`;
        }
      });

      // ── CTA button: secondary (outline) at top → primary (fill) on scroll ──
      if (ctaRef.current) {
        const cta = ctaRef.current;
        // Background: transparent → orange
        cta.style.background    = `rgba(255,109,0,${lerp(0, 1, t)})`;
        // Text: orange → white
        const tg = Math.round(lerp(109, 255, t));
        const tb = Math.round(lerp(0,   255, t));
        cta.style.color         = `rgb(255,${tg},${tb})`;
        // Border: visible orange → transparent
        cta.style.borderColor   = `rgba(255,109,0,${lerp(0.65, 0, t)})`;
        cta.style.paddingLeft   = `${lerp(20, 14, t)}px`;
        cta.style.paddingRight  = `${lerp(20, 14, t)}px`;
        cta.style.paddingTop    = `${lerp(9,  7,  t)}px`;
        cta.style.paddingBottom = `${lerp(9,  6,  t)}px`;
        cta.style.fontSize      = "14px";
      }

      // ── Hamburger ─────────────────────────────────────────────
      if (hamburgerStrokeRef.current) {
        const hStart = lightHero ? 64 : 255;
        const g = Math.round(lerp(hStart, 64, t));
        hamburgerStrokeRef.current.setAttribute("stroke", `rgb(${g},${g},${g})`);
      }

      raf = 0;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initColor = lightHero ? "rgb(30,30,30)" : "rgb(255,255,255)";
  const initShadow = lightHero ? "none" : "0 1px 4px rgba(0,0,0,0.4)";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
      style={{ paddingLeft: 0, paddingRight: 0, paddingTop: 0 }}
    >
      <nav
        ref={navRef as React.RefObject<HTMLElement>}
        className="flex items-center w-full border border-transparent"
        style={{
          paddingLeft: "40px", paddingRight: "40px",
          paddingTop: "14px", paddingBottom: "14px",
          maxWidth: "2400px", borderRadius: "0px",
          background: "rgba(255,255,255,0)", boxShadow: "none", gap: "24px",
          willChange: "padding, max-width, border-radius, background",
        }}
      >
        {/* ── Logo ──────────────────────────────────────────── */}
        <Link href="/" className="shrink-0 relative w-[90px] h-[26px] lg:w-[110px] lg:h-[30px]">
          <Image
            ref={logoWhiteRef as React.RefObject<HTMLImageElement>}
            src={basePath + "/images/hero/logo.png"}
            alt="EHSWatch" fill sizes="110px"
            className="object-contain object-left"
            style={{ opacity: lightHero ? 0 : 1 }}
            priority
          />
          <Image
            ref={logoDarkRef as React.RefObject<HTMLImageElement>}
            src={basePath + "/images/hero/logo.png"}
            alt="" fill sizes="110px"
            className="object-contain object-left"
            style={{ opacity: lightHero ? 1 : 0 }}
            priority
          />
        </Link>

        {/* ── Desktop links ─────────────────────────────────── */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          {ALL_NAV.map((link, i) =>
            link.hasDropdown ? (
              /* Resources — hover dropdown */
              <div
                key={link.label}
                ref={(el) => { linkRefs.current[i] = el; }}
                className="relative group shrink-0 pointer-events-auto"
                style={{
                  color: initColor, textShadow: initShadow,
                  fontSize: "15px", paddingLeft: "14px", paddingRight: "14px",
                }}
              >
                <button
                  className="flex items-center gap-[5px] py-2 font-medium tracking-[-0.24px] rounded-[40px] whitespace-nowrap font-[family-name:var(--font-dm-sans)] hover:opacity-75 transition-opacity cursor-pointer"
                  style={{ color: "inherit", fontSize: "inherit", background: "none", border: "none" }}
                >
                  {link.label}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="group-hover:rotate-180 transition-transform duration-200">
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown panel — 2-column */}
                <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_20px_56px_rgba(0,0,0,0.14)] border border-[#f0f2f5] p-4 w-[480px] opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                  {/* caret */}
                  <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-[#f0f2f5] rotate-45" />
                  <div className="grid grid-cols-2 gap-3">
                    {RESOURCES_ITEMS.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="group/card flex flex-col gap-2.5 rounded-xl overflow-hidden transition-all duration-200"
                      >
                        {/* Thumbnail image */}
                        <div className="w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={basePath + item.img}
                            alt={item.label}
                            className="w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-300"
                          />
                        </div>
                        {/* Text */}
                        <div className="px-1 pb-2 flex flex-col gap-1">
                          <span className="font-[family-name:var(--font-gothic-a1)] font-bold text-[13px] text-[#0f172a]">
                            {item.label}
                          </span>
                          <span className="font-[family-name:var(--font-dm-sans)] text-[11.5px] text-[#64748b] leading-[1.5]" style={{ textWrap: "pretty" } as React.CSSProperties}>
                            {item.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Regular link */
              <Link
                key={link.label}
                href={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                className="py-2 font-medium tracking-[-0.24px] rounded-[40px] whitespace-nowrap font-[family-name:var(--font-dm-sans)] hover:opacity-75 transition-opacity shrink-0"
                style={{
                  color: initColor, textShadow: initShadow,
                  paddingLeft: "14px", paddingRight: "14px", fontSize: "15px",
                  overflow: link.hideOnScroll ? "hidden" : undefined,
                }}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="flex-1 lg:hidden" />

        {/* ── Desktop CTA ───────────────────────────────────── */}
        <Link
          href="#"
          ref={ctaRef}
          onMouseEnter={(e) => {
            const r = ctaRef.current?.getBoundingClientRect();
            if (r) setCtaFill({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
          }}
          onMouseLeave={(e) => {
            const r = ctaRef.current?.getBoundingClientRect();
            if (r) setCtaFill({ x: e.clientX - r.left, y: e.clientY - r.top, on: false });
          }}
          className="hidden sm:inline-flex shrink-0 items-center relative overflow-hidden font-medium tracking-[-0.24px] rounded-full whitespace-nowrap font-[family-name:var(--font-dm-sans)] border-[1.5px]"
          style={{
            background: "rgba(255,109,0,0)",
            color: "rgb(255,109,0)",
            borderColor: "rgba(255,109,0,0.65)",
            paddingLeft: "20px", paddingRight: "20px",
            paddingTop: "9px", paddingBottom: "9px",
            fontSize: "15px",
            willChange: "padding, background, color, border-color",
            transform: "translateZ(0)",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: ctaFill.x, top: ctaFill.y,
              width: 260, height: 260, marginLeft: -130, marginTop: -130,
              borderRadius: "9999px", background: "#FF6D00",
              transform: `scale(${ctaFill.on ? 1 : 0})`,
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
              pointerEvents: "none", zIndex: 0,
            }}
          />
          <span className="relative z-[1]" style={{ color: ctaFill.on ? "#ffffff" : undefined, transition: "color 0.25s ease" }}>
            Book Demo
          </span>
        </Link>

        {/* ── Mobile hamburger ──────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5"
          aria-label="Toggle menu"
          style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
        >
          <svg
            ref={hamburgerStrokeRef}
            width="20" height="20" viewBox="0 0 24 24"
            stroke={lightHero ? "rgb(64,64,64)" : "rgb(255,255,255)"}
            strokeWidth="2" strokeLinecap="round" fill="none"
          >
            {open ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            )}
          </svg>
        </button>
      </nav>

      {/* ── Mobile menu ───────────────────────────────────────── */}
      <div
        className={`lg:hidden absolute top-[72px] left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-1 transition-all duration-300 origin-top z-50 ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {ALL_NAV.map((link) =>
          link.hasDropdown ? (
            <div key={link.label}>
              <button
                type="button"
                onClick={() => setResourcesOpen((o) => !o)}
                className="w-full px-4 py-3 text-[15px] font-medium text-[#404143] rounded-lg hover:bg-gray-50 font-[family-name:var(--font-dm-sans)] cursor-pointer flex items-center justify-between"
              >
                {link.label}
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ transform: resourcesOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                >
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
              {resourcesOpen && (
                <div className="pl-4 flex flex-col gap-0.5 mt-1">
                  {RESOURCES_ITEMS.map((item) => (
                    <Link key={item.label} href={item.href} onClick={() => { setOpen(false); setResourcesOpen(false); }}
                      className="px-4 py-2.5 text-[13.5px] font-medium text-[#64748b] rounded-lg hover:bg-gray-50 hover:text-[#155eef] font-[family-name:var(--font-dm-sans)]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={link.label} href={link.href} onClick={() => setOpen(false)}
              className="px-4 py-3 text-[15px] font-medium text-[#404143] rounded-lg hover:bg-gray-50 font-[family-name:var(--font-dm-sans)]">
              {link.label}
            </Link>
          )
        )}
        <Link href="#" onClick={() => setOpen(false)}
          className="sm:hidden mt-2 px-4 py-3 text-center border border-[rgba(255,109,0,0.65)] text-[#ff6d00] rounded-full font-medium text-[15px] font-[family-name:var(--font-dm-sans)] hover:bg-orange-50 transition-colors">
          Book Demo
        </Link>
      </div>
    </header>
  );
}
