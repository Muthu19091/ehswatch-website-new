"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { basePath } from "@/lib/basePath";

// Root-relative internal links need the app basePath prepended — GlareButton
// renders a plain <a>, so (unlike next/link) Next.js won't add it and the link
// would 404. External, anchor, mailto/tel and already-prefixed links pass through.
function withBasePath(href?: string): string {
  if (!href) return "#";
  if (/^(https?:)?\/\//i.test(href) || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  if (href.startsWith("/") && basePath && href !== basePath && !href.startsWith(basePath + "/")) {
    return `${basePath}${href}`;
  }
  return href;
}

// YouTube watch/short URL → privacy-friendly embed URL with autoplay (and start
// time if the URL carried a t=/start= param). Returns null for non-YouTube URLs.
function youTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host.endsWith("youtube.com"))
      id = u.searchParams.get("v") || (u.pathname.startsWith("/embed/") ? u.pathname.split("/embed/")[1] : "");
    if (!id) return null;
    const params = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1" });
    const t = u.searchParams.get("t") || u.searchParams.get("start");
    if (t) {
      const secs = parseInt(String(t).replace(/[^0-9]/g, ""), 10);
      if (secs) params.set("start", String(secs));
    }
    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  } catch {
    return null;
  }
}

interface GlareButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  fillColor?: string;
  hoverTextColor?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  // When set (CMS "video_popup" link type), the button opens a modal player
  // instead of navigating — works for ANY CTA that resolves to a video_popup.
  videoUrl?: string;
}

export default function GlareButton({
  children,
  className = "",
  href,
  onClick,
  style,
  fillColor = "#FFA660",
  hoverTextColor,
  type,
  disabled,
  videoUrl,
}: GlareButtonProps) {
  const btnRef = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, on: false });

  // Video popup state (only used when videoUrl is set).
  const [videoOpen, setVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVideoOpen(false); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [videoOpen]);
  const embedUrl = videoUrl ? youTubeEmbed(videoUrl) : null;

  const track = (e: React.MouseEvent, on: boolean) => {
    const rect = (btnRef.current as HTMLElement)?.getBoundingClientRect();
    if (rect) setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, on });
  };

  const inner = (
    <>
      {/* Expanding circle — grows from mouse entry point */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width: 520,
          height: 520,
          marginLeft: -260,
          marginTop: -260,
          borderRadius: "9999px",
          background: fillColor,
          transform: `scale(${pos.on ? 1 : 0})`,
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <span
        className="relative z-[1] inline-flex items-center justify-center gap-2"
        style={{ color: pos.on && hoverTextColor ? hoverTextColor : undefined, transition: "color 0.25s ease" }}
      >
        {children}
      </span>
    </>
  );

  const shared = {
    ref: btnRef as React.RefObject<HTMLAnchorElement & HTMLButtonElement>,
    onMouseEnter: (e: React.MouseEvent) => track(e, true),
    onMouseLeave: (e: React.MouseEvent) => track(e, false),
    className: `relative overflow-hidden inline-flex items-center justify-center ${className}`,
    style,
  };

  const videoModal =
    mounted && videoOpen && videoUrl
      ? createPortal(
          <div
            onClick={() => setVideoOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 2000,
              background: "rgba(3,7,18,0.85)", backdropFilter: "blur(2px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
            }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "min(980px, 100%)", aspectRatio: "16 / 9" }}>
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                aria-label="Close video"
                style={{
                  position: "absolute", top: -44, right: 0, width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 22, lineHeight: 1,
                  border: "none", cursor: "pointer",
                }}
              >
                ×
              </button>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Demo video"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: 0, borderRadius: 14, background: "#000" }}
                />
              ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={videoUrl} controls autoPlay playsInline style={{ width: "100%", height: "100%", borderRadius: 14, background: "#000", objectFit: "contain" }} />
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  // Video-popup CTA: render a button that opens the modal instead of navigating.
  if (videoUrl) {
    return (
      <>
        <button {...shared} type="button" onClick={() => { onClick?.(); setVideoOpen(true); }}>
          {inner}
        </button>
        {videoModal}
      </>
    );
  }

  if (type === "submit" || type === "button" || disabled) {
    return (
      <button {...shared} type={type ?? "button"} onClick={onClick} disabled={disabled}>
        {inner}
      </button>
    );
  }

  // Off-site links open in a new tab; in-site links navigate normally.
  const external = !!href && /^(https?:)?\/\//i.test(href);

  return (
    <a
      {...shared}
      href={withBasePath(href)}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}
