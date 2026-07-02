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
  "bolt":                   "zap",
  "light-bulb":             "lightbulb",
  "device-phone-mobile":    "smartphone",
  "computer-desktop":       "monitor",
  "globe-alt":              "globe",
  "hand-thumb-up":          "thumbs-up",
  "hand-thumb-down":        "thumbs-down",
  "chat-bubble-left":       "message-circle",
  "chat-bubble-left-right": "messages-square",
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
): LucideIconName {
  if (!slug) return fallback;
  let s = slug.trim();
  if (s.startsWith("heroicon-o-") || s.startsWith("heroicon-s-")) s = s.slice(11);
  s = ALIASES[s] ?? s;
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
  return (
    <DynamicIcon
      name={resolveIconName(icon, fallback)}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={className}
    />
  );
}
