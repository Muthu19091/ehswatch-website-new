"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Isomorphic layout effect: use the real layout effect on the client (measures
// before paint, so the overflow collapse never flashes) and fall back to a
// no-warn effect during SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { createPortal } from "react-dom";
import { basePath } from "@/lib/basePath";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import BookmarksMenu from "@/components/layout/BookmarksMenu";

/* ── Nav config ────────────────────────────────────────────────────
   hideOnScroll: true  → fades out when navbar collapses to pill
   hasDropdown: true   → renders a hover-dropdown
   ─────────────────────────────────────────────────────────────── */
const ALL_NAV = [
  { label: "About Us",  href: "/about",        hideOnScroll: false, hasDropdown: false },
  { label: "Products",  href: "/product",      hideOnScroll: false, hasDropdown: false },
  { label: "IRIS",      href: "/iris",         hideOnScroll: false, hasDropdown: false },
  { label: "Industries", href: "/industries",   hideOnScroll: false, hasDropdown: false },
  { label: "Pricing",   href: "/pricing",      hideOnScroll: false, hasDropdown: false },
  { label: "Resources", href: "#",             hideOnScroll: false, hasDropdown: true  },
  { label: "Contact Us", href: "/contact-us",   hideOnScroll: true,  hasDropdown: false },
];

const RESOURCES_ITEMS = [
  { label: "Blog",         href: "/blog",         desc: "Safety insights & best practices", img: "/images/blogs/blog-2.png" },
  { label: "Case Studies", href: "/case-studies", desc: "See how teams use EHSWatch",       img: "/images/blogs/blog-3.png" },
];

const SCROLL_END = 480;  // px over which the full morph completes (higher = slower/smoother)
// Must match Tailwind's `lg:` breakpoint (min-width: 1024px) exactly. The desktop
// nav row is `hidden lg:flex`, so at *exactly* 1024 the desktop layout is showing
// and the scroll morph below has to run — hence `< DESKTOP_MIN`, not `<=`.
const DESKTOP_MIN = 1024;
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function ease(p: number) {
  // ease-in-out-sine — very gentle start and end, no harsh jump
  return -(Math.cos(Math.PI * p) - 1) / 2;
}

interface CmsNavItem {
  label: string;
  href: string;
  newTab?: boolean;
  hideOnScroll?: boolean;
  hasDropdown: boolean;
  children?: { label: string; href: string; desc?: string; img?: string }[];
}

export default function NavbarClient({
  lightHero = false,
  cmsNav,
  cmsCta,
  cmsCtas,
  cmsLogo,
  shrinkOnScroll = true,
}: {
  lightHero?: boolean;
  cmsNav?: CmsNavItem[];
  cmsCta?: { label: string; href: string };
  cmsCtas?: { label: string; href: string; style?: string; newTab?: boolean }[];
  cmsLogo?: { url: string; alt?: string; href?: string };
  shrinkOnScroll?: boolean;
}) {
  const allNavItems = cmsNav && cmsNav.length > 0 ? cmsNav : ALL_NAV;
  // Keep the row from overflowing the logo/CTA: show a safe number of items
  // inline and collapse the rest into a "More" dropdown. Beyond this the header
  // would overlap regardless of viewport.
  // BUG-130 — Priority+ nav: never hide a heading behind a fixed cap. Every
  // item renders inline on the server and first paint (inlineCount defaults to
  // the full list); on the client we measure how many actually fit the current
  // width and collapse ONLY the genuine overflow into the "More" dropdown.
  const [inlineCount, setInlineCount] = useState(allNavItems.length);
  const [measuring, setMeasuring] = useState(true);
  // While measuring we render the FULL list so every item is measurable; the
  // layout effect below computes how many fit and collapses the overflow BEFORE
  // the browser paints, so there's no visible flash of the full row.
  const renderCount = measuring ? allNavItems.length : Math.min(inlineCount, allNavItems.length);
  const navItems = allNavItems.slice(0, renderCount);
  const overflowItems = allNavItems.slice(renderCount);
  const ctaList = (cmsCtas && cmsCtas.length > 0)
    ? cmsCtas
    : (cmsCta ? [{ label: cmsCta.label, href: cmsCta.href } as { label: string; href: string; newTab?: boolean }] : []);
  const primaryCta = ctaList[0];
  const secondaryCtas = ctaList.slice(1);
  const ctaLabel = primaryCta?.label || "Book Demo";
  const ctaHref  = primaryCta?.href  || "#";
  const logoSrc  = cmsLogo?.url;
  const logoAlt  = cmsLogo?.alt  || "EHSWatch";
  const logoHref = cmsLogo?.href || "/";
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  // Mounted flag so the mobile menu can be portaled to <body> only on the
  // client (document.body doesn't exist during SSR).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Desktop dropdowns open on hover (CSS) — this adds click/tap toggling so
  // they also work on touch screens, where hover never fires
  const [deskOpen, setDeskOpen] = useState<number | "more" | null>(null);

  useEffect(() => {
    if (deskOpen === null) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.("[data-desk-dropdown]")) setDeskOpen(null);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [deskOpen]);

  const deskPanelClass = (isOpen: boolean) =>
    isOpen
      ? "opacity-100 visible pointer-events-auto translate-y-0"
      : "opacity-0 invisible pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0";
  const [ctaFill, setCtaFill] = useState({ x: 0, y: 0, on: false });

  const headerRef          = useRef<HTMLElement>(null);
  const navRef             = useRef<HTMLElement>(null);
  const navListRef         = useRef<HTMLDivElement>(null);
  const logoWhiteRef       = useRef<HTMLImageElement>(null);
  const rightClusterRef    = useRef<HTMLDivElement>(null);
  const logoDarkRef        = useRef<HTMLImageElement>(null);
  const linkRefs           = useRef<(HTMLElement | null)[]>([]);
  const ctaRef             = useRef<HTMLAnchorElement>(null);
  const hamburgerStrokeRef = useRef<SVGSVGElement>(null);

  // BUG-130 — priority+ nav. Measured in a LAYOUT effect (runs after commit,
  // before paint) so there is no race with React's render and no flash: when
  // `measuring` is true the full list is in the DOM, we read each item's width
  // against the width-constrained links container, then collapse only the true
  // overflow into "More". Budget is the links container (the outer bar grows
  // with its own overflow, so it never reports overflow).
  useIsoLayoutEffect(() => {
    if (!measuring) return;
    if (allNavItems.length === 0) { setMeasuring(false); return; }
    const MORE_RESERVE = 88; // approx px width of the "More" button incl. padding
    const box = navListRef.current;
    const els = linkRefs.current;
    if (!box) { setMeasuring(false); return; }
    // Stable budget: the outer bar AND the links container both grow with their
    // own overflow, so their clientWidth is unusable. Derive the space actually
    // available to the links from the viewport minus the fixed logo + right
    // cluster (their offsetWidth is position-independent, so a spilling row
    // doesn't corrupt it). Assume symmetric header padding via the logo's left.
    const vw = document.documentElement.clientWidth || window.innerWidth;
    if (vw < 1024) { setMeasuring(false); return; } // desktop nav hidden below lg
    // The pill is width:auto (shrinks to content) with a scroll-driven maxWidth
    // that morphs 2400px (top) -> 1160px (scrolled), so its own clientWidth is
    // useless as a budget. The real space the links can take is the pill's
    // achievable width -- min(current maxWidth, viewport - header padding) --
    // minus the fixed logo and right cluster. All inputs are stable offsetWidths
    // / the computed maxWidth (never corrupted by a spilling row), so the fit is
    // monotonic in width and follows the scroll morph.
    const HPAD = 24; // header horizontal padding per side (approx, desktop)
    let pillMax = Infinity;
    const navEl = navRef.current;
    if (navEl) {
      const mw = parseFloat(getComputedStyle(navEl).maxWidth);
      if (Number.isFinite(mw) && mw > 0) pillMax = mw;
    }
    const pillAvail = Math.min(pillMax, vw - HPAD * 2);
    const logoBox = logoWhiteRef.current?.parentElement as HTMLElement | null;
    const logoW = logoBox?.offsetWidth ?? 120;
    const ctaW = rightClusterRef.current?.offsetWidth ?? 0;
    const GAP = 32; // breathing room so the last item never touches the CTA
    const budget = pillAvail - logoW - ctaW - GAP;
    if (budget <= 0) { setMeasuring(false); return; }
    const widths: number[] = [];
    for (let k = 0; k < allNavItems.length; k++) {
      const el = els[k];
      if (!el) { setMeasuring(false); return; }
      widths.push(el.getBoundingClientRect().width);
    }
    const total = widths.reduce((a, b) => a + b, 0);
    let count = allNavItems.length;
    if (total > budget) {
      let used = MORE_RESERVE;
      count = 0;
      for (let k = 0; k < widths.length; k++) {
        if (used + widths[k] <= budget) { used += widths[k]; count += 1; }
        else break;
      }
      count = Math.max(1, count);
    }
    setInlineCount(count);
    setMeasuring(false);
  }, [measuring, allNavItems.length]);

  // Re-measure when the available width settles after a resize or the header's
  // scroll-morph transition. A ResizeObserver on the links container fires every
  // frame during the CSS width transition, so debounce until it stops moving.
  useEffect(() => {
    let timer = 0;
    const remeasure = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => setMeasuring(true), 140) as unknown as number;
    };
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => remeasure())
      : null;
    // Observe the STABLE full-width header, not the links container: collapsing
    // items changes the container width (the top-state pill is width:auto), which
    // would re-fire the observer and oscillate back to the full list.
    if (ro && headerRef.current) ro.observe(headerRef.current);
    window.addEventListener("resize", remeasure);
    // First paint can measure before web fonts load, when every item is ~0px
    // wide (so nothing looks like overflow and the collapse is skipped). Force
    // fresh measures once fonts are ready and after a couple of settle delays,
    // so the correct collapse never waits for a user scroll/resize.
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setMeasuring(true)).catch(() => {});
    }
    window.addEventListener("load", remeasure);
    // Re-measure a handful of times over the first ~1.8s. The first paint may
    // land before fonts load or before the pill morph settles (item widths then
    // read small, so the collapse is skipped); repeated passes converge to the
    // settled layout at every width. useLayoutEffect measures before paint, so
    // these extra passes never flash the full row.
    let passes = 0;
    const settle = window.setInterval(() => {
      setMeasuring(true);
      passes += 1;
      if (passes >= 6) window.clearInterval(settle);
    }, 300);
    return () => {
      clearTimeout(timer);
      clearInterval(settle);
      ro?.disconnect();
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastT = -1;

    const apply = () => {
      const header = headerRef.current;
      const nav    = navRef.current;
      if (!header || !nav) { raf = 0; return; }

      // On mobile/tablet, always use a solid white background — skip the scroll animation.
      // Everything the desktop branch below writes must be reset here, or rotating an
      // iPad from landscape (mid-morph pill) to portrait strands the pill shape and the
      // filled CTA on the tablet bar.
      if (window.innerWidth < DESKTOP_MIN) {
        header.style.paddingLeft = header.style.paddingRight = header.style.paddingTop = "0px";

        nav.style.background     = "rgba(255,255,255,0.97)";
        nav.style.boxShadow      = "0 2px 12px rgba(0,0,0,0.07)";
        nav.style.backdropFilter = "blur(12px)";
        nav.style.paddingLeft    = nav.style.paddingRight  = "40px";
        nav.style.paddingTop     = nav.style.paddingBottom = "14px";
        nav.style.maxWidth       = "2400px";
        nav.style.borderRadius   = "0px";

        // Solid white bar → always the dark logo, whatever the hero is
        if (logoWhiteRef.current) logoWhiteRef.current.style.opacity = "0";
        if (logoDarkRef.current)  logoDarkRef.current.style.opacity  = "1";

        linkRefs.current.forEach((el) => {
          if (!el) return;
          el.style.color        = "rgb(30,30,30)";
          el.style.textShadow   = "none";
          el.style.opacity      = "1";
          el.style.maxWidth     = "none";
          el.style.paddingLeft  = el.style.paddingRight = "9px";
          el.style.pointerEvents = "auto";
        });

        if (ctaRef.current) {
          const cta = ctaRef.current;
          cta.style.background    = "rgba(255,109,0,0)";
          cta.style.color         = "rgb(255,109,0)";
          cta.style.borderColor   = "rgba(255,109,0,0.65)";
          cta.style.paddingLeft   = cta.style.paddingRight  = "20px";
          cta.style.paddingTop    = cta.style.paddingBottom = "9px";
          cta.style.fontSize      = "15px";
        }

        if (hamburgerStrokeRef.current) {
          hamburgerStrokeRef.current.setAttribute("stroke", "rgb(40,40,40)");
        }

        // Force the desktop branch to re-apply from scratch on the way back up —
        // otherwise rotating to landscape at an unchanged scrollY hits the
        // `t === lastT` early-return below and the tablet styles stay stuck.
        lastT = -1;
        raf = 0; return;
      }

      const raw = Math.min(1, Math.max(0, window.scrollY / SCROLL_END));
      const t   = ease(raw);

      if (Math.abs(t - lastT) < 0.001) { raf = 0; return; }
      lastT = t;

      // Shrink-on-scroll OFF (CMS) → keep the bar full-size (no padding/width/
      // radius shrink) but still solidify for readability: size uses sizeT
      // (pinned to 0), colour/background keep the real t.
      const sizeT = shrinkOnScroll ? t : 0;

      // ── Header outer padding ──────────────────────────────────
      header.style.paddingLeft  = `${lerp(0, 20, sizeT)}px`;
      header.style.paddingRight = `${lerp(0, 20, sizeT)}px`;
      header.style.paddingTop   = `${lerp(0, 12, sizeT)}px`;

      // ── Nav pill shape ────────────────────────────────────────
      nav.style.paddingLeft    = `${lerp(40, 16, sizeT)}px`;
      nav.style.paddingRight   = `${lerp(40, 10, sizeT)}px`;
      nav.style.paddingTop     = nav.style.paddingBottom = `${lerp(14, 7, sizeT)}px`;
      nav.style.maxWidth       = `${lerp(2400, 1160, sizeT)}px`;   // wide enough to keep all nav links (incl. Support) visible in the collapsed pill
      nav.style.borderRadius   = `${lerp(0, 9999, sizeT)}px`;
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
      // Link padding stays fixed — only hideOnScroll items collapse.
      // Matches the static per-link padding so it doesn't jump on scroll.
      const LINK_PX = 9;

      linkRefs.current.forEach((el, i) => {
        if (!el) return;
        const cfg = navItems[i];

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
    // Crossing the DESKTOP_MIN boundary (iPad rotation, desktop window resize) swaps
    // which branch of apply() is correct, so width changes must re-run it too — scroll
    // alone would leave the old branch's styles in place until the user happened to scroll.
    const onResize = () => { lastT = -1; onScroll(); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
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
        {/* ── Logo — CMS header logo, else Site Settings brand logo. No hardcoded fallback. ── */}
        {logoSrc && (
        <Link href={logoHref} className="shrink-0 relative w-[90px] h-[26px] lg:w-[110px] lg:h-[30px]">
          <Image
            ref={logoWhiteRef as React.RefObject<HTMLImageElement>}
            src={logoSrc}
            alt={logoAlt} fill sizes="110px"
            className="object-contain object-left"
            style={{ opacity: lightHero ? 0 : 1 }}
            priority
          />
          <Image
            ref={logoDarkRef as React.RefObject<HTMLImageElement>}
            src={logoSrc}
            alt="" fill sizes="110px"
            className="object-contain object-left"
            style={{ opacity: lightHero ? 1 : 0 }}
            priority
          />
        </Link>
        )}

        {/* ── Desktop links ─────────────────────────────────── */}
        <div ref={navListRef} className="hidden lg:flex items-center justify-center flex-1 min-w-0">
          {navItems.map((link, i) =>
            link.hasDropdown ? (
              /* Resources — hover dropdown */
              <div
                key={link.label}
                ref={(el) => { linkRefs.current[i] = el; }}
                data-desk-dropdown
                className="relative group shrink-0 pointer-events-auto pb-[10px] -mb-[10px]"
                style={{
                  color: initColor, textShadow: initShadow,
                  fontSize: "14px", paddingLeft: "9px", paddingRight: "9px",
                }}
              >
                <button
                  onClick={() => setDeskOpen(deskOpen === i ? null : i)}
                  aria-expanded={deskOpen === i}
                  className="flex items-center gap-[5px] py-2 font-medium tracking-[-0.24px] rounded-[40px] whitespace-nowrap font-[family-name:var(--font-dm-sans)] hover:opacity-75 transition-opacity cursor-pointer"
                  style={{ color: "inherit", fontSize: "inherit", background: "none", border: "none" }}
                >
                  {link.label}
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={`group-hover:rotate-180 transition-transform duration-200 ${deskOpen === i ? "rotate-180" : ""}`}>
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown panel — 2-column */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_20px_56px_rgba(0,0,0,0.14)] border border-[#f0f2f5] p-4 w-[480px] transition-all duration-200 z-50 ${deskPanelClass(deskOpen === i)}`}>
                  {/* caret */}
                  <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-[#f0f2f5] rotate-45" />
                  <div className="grid grid-cols-2 gap-3">
                    {((link as any).children ?? RESOURCES_ITEMS).map((item: { label: string; href: string; desc?: string; img?: string }) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setDeskOpen(null)}
                        className="group/card flex flex-col gap-2.5 rounded-xl overflow-hidden transition-all duration-200"
                      >
                        {/* Thumbnail — show image if available, gradient placeholder otherwise */}
                        <div className="w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
                          {item.img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.img.startsWith("http") ? item.img : basePath + item.img}
                              alt={item.label}
                              className="w-full h-full object-cover group-hover/card:scale-[1.03] transition-transform duration-300"
                            />
                          ) : (
                            <div
                              className="w-full h-full group-hover/card:scale-[1.03] transition-transform duration-300"
                              style={{ background: "linear-gradient(135deg, #e8f0fe 0%, #c7d7fd 50%, #dde9ff 100%)" }}
                            />
                          )}
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
                target={(link as { newTab?: boolean }).newTab ? "_blank" : undefined}
                rel={(link as { newTab?: boolean }).newTab ? "noopener noreferrer" : undefined}
                ref={(el) => { linkRefs.current[i] = el; }}
                className="py-2 font-medium tracking-[-0.24px] rounded-[40px] whitespace-nowrap font-[family-name:var(--font-dm-sans)] hover:opacity-75 transition-opacity shrink-0"
                style={{
                  color: initColor, textShadow: initShadow,
                  paddingLeft: "9px", paddingRight: "9px", fontSize: "14px",
                  overflow: link.hideOnScroll ? "hidden" : undefined,
                }}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Overflow "More" dropdown — absorbs items beyond MAX_INLINE so the
              row never overlaps the logo/CTA no matter how many nav items exist */}
          {overflowItems.length > 0 && (
            <div
              data-desk-dropdown
              className="relative group shrink-0 pointer-events-auto pb-[10px] -mb-[10px]"
              style={{ color: initColor, textShadow: initShadow, fontSize: "14px", paddingLeft: "9px", paddingRight: "9px" }}
            >
              <button
                onClick={() => setDeskOpen(deskOpen === "more" ? null : "more")}
                aria-expanded={deskOpen === "more"}
                className="flex items-center gap-[5px] py-2 font-medium tracking-[-0.24px] rounded-[40px] whitespace-nowrap font-[family-name:var(--font-dm-sans)] hover:opacity-75 transition-opacity cursor-pointer"
                style={{ color: "inherit", fontSize: "inherit", background: "none", border: "none" }}
              >
                More
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={`group-hover:rotate-180 transition-transform duration-200 ${deskOpen === "more" ? "rotate-180" : ""}`}>
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className={`absolute top-full right-0 bg-white rounded-2xl shadow-[0_20px_56px_rgba(0,0,0,0.14)] border border-[#f0f2f5] p-2 min-w-[200px] transition-all duration-200 z-50 ${deskPanelClass(deskOpen === "more")}`}>
                {overflowItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href || "#"}
                    target={(item as { newTab?: boolean }).newTab ? "_blank" : undefined}
                    rel={(item as { newTab?: boolean }).newTab ? "noopener noreferrer" : undefined}
                    onClick={() => setDeskOpen(null)}
                    className="block px-3 py-2 rounded-lg font-[family-name:var(--font-dm-sans)] text-[14px] font-medium text-[#0f172a] hover:bg-[#f1f5f9] transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 lg:hidden" />

        {/* ── Right cluster: Language Switcher + CTA ───────── */}
        <div ref={rightClusterRef} className="hidden sm:flex items-center gap-3 shrink-0">
          <BookmarksMenu lightHero={lightHero} />
          <LanguageSwitcher lightHero={lightHero} />

          {/* Secondary CTAs (any header CTA beyond the first) */}
          {secondaryCtas.map((c, i) => (
            <Link
              key={`sec-cta-${i}`}
              href={c.href}
              target={c.newTab ? "_blank" : undefined}
              rel={c.newTab ? "noopener noreferrer" : undefined}
              className="hidden lg:inline-flex shrink-0 items-center rounded-full whitespace-nowrap font-medium tracking-[-0.24px] border-[1.5px] border-[#ff6d00]/40 text-[var(--brand-primary)] hover:bg-[#ff6d00]/5 transition-colors font-[family-name:var(--font-dm-sans)]"
              style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px", fontSize: "14px" }}
            >
              {c.label}
            </Link>
          ))}

        {/* ── Desktop CTA ─────────────────────────────────── */}
        <Link
          href={ctaHref}
          ref={ctaRef}
          onMouseEnter={(e) => {
            const r = ctaRef.current?.getBoundingClientRect();
            if (r) setCtaFill({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
          }}
          onMouseLeave={(e) => {
            const r = ctaRef.current?.getBoundingClientRect();
            if (r) setCtaFill({ x: e.clientX - r.left, y: e.clientY - r.top, on: false });
          }}
          className="inline-flex shrink-0 items-center relative overflow-hidden font-medium tracking-[-0.24px] rounded-full whitespace-nowrap font-[family-name:var(--font-dm-sans)] border-[1.5px]"
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
              borderRadius: "9999px", background: "var(--brand-primary)",
              transform: `scale(${ctaFill.on ? 1 : 0})`,
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
              pointerEvents: "none", zIndex: 0,
            }}
          />
          <span className="relative z-[1]" style={{ color: ctaFill.on ? "#ffffff" : undefined, transition: "color 0.25s ease" }}>
            {ctaLabel}
          </span>
        </Link>
        </div>{/* end right cluster */}

        {/* ── Mobile language switcher (in-bar, <sm only) ───── */}
        <div className="sm:hidden mr-1 shrink-0">
          <LanguageSwitcher lightHero={lightHero} />
        </div>

        {/* ── Mobile hamburger ──────────────────────────────── */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5"
          aria-label="Toggle menu"
          // touchAction:manipulation removes the iOS tap delay; the SVG below is
          // pointer-events:none so a tap always lands on the button itself
          // (iOS Safari otherwise hit-tests the inner SVG and can drop the click).
          style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
        >
          <svg
            ref={hamburgerStrokeRef}
            width="20" height="20" viewBox="0 0 24 24"
            stroke={lightHero ? "rgb(64,64,64)" : "rgb(255,255,255)"}
            strokeWidth="2" strokeLinecap="round" fill="none"
            style={{ pointerEvents: "none" }}
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
      {/* Portaled to <body>, OUTSIDE the position:fixed + backdrop-filter header.
          iOS Safari (incl. iOS 16) fails to repaint this panel when it becomes
          visible while nested inside that header's compositing layer, so it
          stayed invisible (opacity/transition/animation/display toggles inside
          the header all hit the same paint bug). Rendering it as a top-level
          fixed element gives it a clean compositing layer that paints reliably.
          Show/hide via display (hidden ↔ flex); kept mounted (not conditionally
          rendered) so tapping a link isn't unmounted mid-navigation. */}
      {mounted && createPortal(
      <div
        data-mobile-menu
        className={`lg:hidden fixed top-[72px] left-4 right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 gap-1 origin-top z-[60] ${
          open ? "flex flex-col" : "hidden"
        }`}
      >
        {allNavItems.map((link) =>
          link.hasDropdown ? (
            <div key={link.label}>
              <button
                type="button"
                onClick={() => setResourcesOpen((o) => !o)}
                className="w-full px-4 py-3 text-[15px] font-medium text-[#404143] rounded-lg hover:bg-gray-50 font-[family-name:var(--font-dm-sans)] cursor-pointer flex items-center gap-1.5"
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
                  {((link as any).children ?? RESOURCES_ITEMS).map((item: { label: string; href: string; desc?: string; img?: string }) => (
                    <Link key={item.label} href={item.href} onClick={() => { setOpen(false); setResourcesOpen(false); }}
                      className="px-4 py-2.5 text-[13.5px] font-medium text-[#64748b] rounded-lg hover:bg-gray-50 hover:text-[#155eef] font-[family-name:var(--font-dm-sans)]">
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={link.label} href={link.href} target={(link as { newTab?: boolean }).newTab ? "_blank" : undefined} rel={(link as { newTab?: boolean }).newTab ? "noopener noreferrer" : undefined} onClick={() => setOpen(false)}
              className="px-4 py-3 text-[15px] font-medium text-[#404143] rounded-lg hover:bg-gray-50 font-[family-name:var(--font-dm-sans)]">
              {link.label}
            </Link>
          )
        )}
        <Link href={ctaHref} onClick={() => setOpen(false)}
          className="sm:hidden mt-2 px-4 py-3 text-center border border-[rgba(255,109,0,0.65)] text-[var(--brand-primary)] rounded-full font-medium text-[15px] font-[family-name:var(--font-dm-sans)] hover:bg-orange-50 transition-colors">
          {ctaLabel}
        </Link>
      </div>,
      document.body
      )}
    </header>
  );
}
