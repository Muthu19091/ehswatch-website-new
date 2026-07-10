"use client";

import { useRef, useState, ReactNode } from "react";

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
}: GlareButtonProps) {
  const btnRef = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, on: false });

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
      href={href ?? "#"}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}
