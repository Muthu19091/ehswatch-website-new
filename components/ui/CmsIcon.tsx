"use client";

import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

export type LucideIconName = keyof typeof dynamicIconImports;

/**
 * Legacy Heroicon slugs (old seeded data) and renamed Lucide slugs
 * → current Lucide names. Anything not resolvable falls back to the
 * caller-supplied default so no icon ever renders broken.
 */
const ALIASES: Record<string, string> = {
  // Heroicon → Lucide
  "envelope":               "mail",
  "check-square":           "square-check",
  "eye-slash":              "eye-off",
  "shield-exclamation":     "shield-alert",
  "exclamation-triangle":   "triangle-alert",
  "exclamation-circle":     "circle-alert",
  "question-mark-circle":   "circle-help",
  "information-circle":     "info",
  "rectangle-stack":        "layers",
  "circle-stack":           "database",
  "squares-2x2":            "layout-grid",
  "document":               "file",
  "document-text":          "file-text",
  "document-duplicate":     "copy",
  "magnifying-glass":       "search",
  "arrow-path":             "refresh-cw",
  "arrow-trending-up":      "trending-up",
  "arrow-trending-down":    "trending-down",
  "paper-airplane":         "send",
  "x-mark":                 "x",
  "no-symbol":              "ban",
  "bell-alert":             "bell-ring",
  "user-group":             "users",
  "building-office":        "building",
  "building-office-2":      "building-2",
  "wrench-screwdriver":     "wrench",
  "cog":                    "settings",
  "cog-6-tooth":            "settings",
  "cog-8-tooth":            "settings",
  "presentation-chart-bar": "presentation",
  "presentation-chart-line":"chart-line",
  "signal-slash":           "wifi-off",
  "check-badge":            "badge-check",
  "chart-bar":              "chart-column",
  "warning":                "triangle-alert",
  "alert-triangle":         "triangle-alert",
  "alert-circle":           "circle-alert",
  "alert-octagon":          "octagon-alert",
  "help-circle":            "circle-help",
  "check-circle":           "circle-check",
  "x-circle":               "circle-x",
  "bar-chart":              "chart-column",
  "bar-chart-2":            "chart-column",
  "pie-chart":              "chart-pie",
  "line-chart":             "chart-line",
  "graduation":             "graduation-cap",
  "chart-bar-square":       "chart-column",
  "adjustments-horizontal": "sliders-horizontal",
  "queue-list":             "list-checks",
  "device-tablet":          "tablet",
  "link":                   "link",
  "bolt":                   "zap",
  "light-bulb":             "lightbulb",
  "device-phone-mobile":    "smartphone",
  "computer-desktop":       "monitor",
  "globe-alt":              "globe",
  "hand-thumb-up":          "thumbs-up",
  "hand-thumb-down":        "thumbs-down",
  "chat-bubble-left":       "message-circle",
  "chat-bubble-left-right": "messages-square",
  "chat-bubble-bottom-center-text": "message-circle",
  "chat-bubble-bottom-center":      "message-circle",
  "code-bracket":           "code",
  "code-bracket-square":    "square-code",
  "lock-closed":            "lock",
  "lock-open":              "lock-open",
  "academic-cap":           "graduation-cap",
  "beaker":                 "flask-conical",
  "banknotes":              "banknote",
  "currency-dollar":        "dollar-sign",
  "fire":                   "flame",
};

/**
 * Resolve a CMS icon slug (Lucide, `heroicon-o-*`/`heroicon-s-*`, or a
 * legacy/renamed slug) to a valid Lucide icon name.
 */
export function resolveIconName(
  slug?: string | null,
  fallback: LucideIconName = "circle-alert",
): LucideIconName | null {
  // Unset / empty icon → null so the caller renders nothing (no default icon).
  if (!slug || !slug.trim()) return null;
  let s = slug.trim();
  // Custom uploaded icon (inline SVG / URL / unresolved `custom:<id>`) — not a
  // Lucide name; return null so callers don't render a wrong fallback glyph.
  // CmsIcon detects and renders these directly (inline SVG or <img>).
  if (/^(<svg|https?:\/\/|\/|data:image\/|custom:)/i.test(s) || /\.(svg|png|jpe?g|webp|gif)$/i.test(s)) return null;
  if (s.startsWith("heroicon-o-") || s.startsWith("heroicon-s-")) s = s.slice(11);
  s = ALIASES[s] ?? s;
  // A set-but-unknown slug still falls back so legacy/renamed data never renders broken.
  return s in dynamicIconImports ? (s as LucideIconName) : fallback;
}

export default function CmsIcon({
  icon,
  size = 22,
  strokeWidth = 2,
  color = "currentColor",
  className,
  fallback = "circle-alert",
}: {
  icon?: string | null;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  fallback?: LucideIconName;
}) {
  const raw = (icon ?? "").trim();

  // Custom uploaded icon (CMS IconPicker upload). The API serves it as either
  // sanitized inline <svg> markup or an image URL; render that directly rather
  // than resolving a named Lucide glyph. Works everywhere IconPicker is used
  // (module cards, icon-features, stats, steps, pain-points, pricing).
  if (raw.startsWith("<svg")) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size, color }}
        className={`inline-flex items-center justify-center [&_svg]:w-full [&_svg]:h-full ${className ?? ""}`}
        // SVG is sanitized server-side (enshrined/svg-sanitize) before storage.
        dangerouslySetInnerHTML={{ __html: raw }}
      />
    );
  }
  if (/^(https?:\/\/|\/|data:image\/)/i.test(raw) || /\.(svg|png|jpe?g|webp|gif)$/i.test(raw)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={raw} alt="" width={size} height={size} className={className} style={{ objectFit: "contain" }} />
    );
  }

  const name = resolveIconName(icon, fallback);
  // No icon configured → render nothing (previously showed a fallback icon).
  if (!name) return null;
  return (
    <DynamicIcon
      name={name}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={className}
    />
  );
}
