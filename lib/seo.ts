import type { Metadata } from "next";

/**
 * CMS meta.robots ("index, follow" / "noindex, nofollow") → Next metadata.
 * The CMS forces noindex,nofollow for any non-active record, so draft
 * content rendered through preview links is never indexable.
 */
export function robotsFrom(robots?: string | null): Metadata["robots"] {
  if (!robots) return undefined;
  const r = robots.toLowerCase();
  return { index: !r.includes("noindex"), follow: !r.includes("nofollow") };
}
