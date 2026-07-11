import type { CmsBlock } from "@/lib/types";
import { stripHtml } from "@/lib/text";
export type { CmsBlock };

export function findBlock<T = Record<string, unknown>>(blocks: CmsBlock[], type: string): T | null {
  const block = blocks.find(b => b.type === type);
  return block ? (block.data as T) : null;
}

export function findBlocks<T = Record<string, unknown>>(blocks: CmsBlock[], type: string): T[] {
  return blocks.filter(b => b.type === type).map(b => b.data as T);
}

export function normalizeArray<T = unknown>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];
  return Object.values(value as Record<string, T>);
}

/**
 * Map of CMS page id → slug, used to resolve "internal" CTAs (which carry a
 * page_id, not a URL). Build it once per request from getPageList().
 */
export type PageMap = Record<string, string>;

export function buildPageMap(
  pages?: Array<{ id: number | string; attributes: { slug: string } }> | null,
): PageMap {
  const map: PageMap = {};
  for (const p of pages ?? []) {
    if (p?.id != null && p.attributes?.slug) map[String(p.id)] = p.attributes.slug;
  }
  return map;
}

function slugToPath(slug: string): string {
  const s = slug.replace(/^\/+|\/+$/g, "");
  return s === "home" || s === "" ? "/" : `/${s}`;
}

/**
 * CMS CTAs arrive in several shapes depending on the field used:
 *   • flat:     { label, type, url|anchor|page_id }
 *   • nested:   { cta: { label, type, … }, primary_cta: {…empty} }  (link field)
 * This unwraps to the object that actually carries the data.
 */
function unwrapCta(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Record<string, unknown>;
  const inner = c.cta as Record<string, unknown> | undefined;
  if (inner && typeof inner === "object" && (inner.label || inner.url || inner.page_id || inner.anchor)) {
    return inner;
  }
  return c;
}

/**
 * Normalise a user-entered URL so it actually redirects.
 * Editors often type "google.com" or "www.site.com/x" without a scheme —
 * a bare <a href="google.com"> is treated as a RELATIVE path and never
 * leaves the site. Anything that looks like an external host gets https://.
 * Internal paths (/…, #…), mailto:, tel:, and full URLs are left alone.
 */
export function normalizeUrl(url: string): string {
  const u = url.trim();
  if (!u || u === "#") return u || "#";
  // protocol-relative //host → https:
  if (u.startsWith("//")) return `https:${u}`;
  // already absolute / special scheme / in-site path / anchor
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u)) return u;
  // looks like a domain (has a dot before any slash) → external, add https
  if (/^[^/\s]+\.[^/\s]/.test(u)) return `https://${u}`;
  // otherwise treat as an in-site path
  return `/${u.replace(/^\/+/, "")}`;
}

/**
 * Resolve any CTA shape to an href. Handles anchor links, internal page_id
 * references (via pageMap), and plain URLs (scheme-normalised).
 */
export function resolveHref(cta: unknown, pageMap?: PageMap): string {
  const c = unwrapCta(cta);
  if (!c) return "#";
  if (c.type === "anchor") return (c.anchor as string) || "#";
  if ((c.type === "internal" || c.page_id) && c.page_id != null) {
    const slug = pageMap?.[String(c.page_id)];
    if (slug) return slugToPath(slug);
  }
  const url = (c.url as string) || "";
  return url ? normalizeUrl(url) : "#";
}

/** True for links that should open in a new tab (off-site absolute URLs). */
export function isExternalUrl(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
}

/**
 * Resolve any CTA shape to { label, url }, or null when the button is not
 * configured. A CTA counts as "enabled" as soon as it has a LABEL — that is
 * the editor's signal that the button should appear. The destination falls
 * back to "#" when no link has been entered yet (the button shows but simply
 * doesn't navigate until a link is added in the dashboard). An empty CTA with
 * no label renders nothing (instead of a hardcoded fallback).
 * Labels are stripped of stray HTML like every other short CMS text field.
 */
export function resolveCta(cta: unknown, pageMap?: PageMap): { label: string; url: string } | null {
  const c = unwrapCta(cta);
  if (!c) return null;
  const label = stripHtml(c.label as string | null | undefined);
  if (!label) return null;
  const url = resolveHref(c, pageMap) || "#";
  return { label, url };
}

// Aliases used by page routes
export function iconFeaturesToArray(
  items: Record<string, unknown> | unknown[] | null | undefined
): Array<{ icon?: string; title?: string; description?: string; link?: unknown }> {
  return normalizeArray<{ icon?: string; title?: string; description?: string; link?: unknown }>(items);
}
export const ctaHref = resolveHref;

// Resolve a CMS media/image value to its URL. The API serializes covers as
// MediaResource objects ({ attributes: { url } }); some older fields are flat
// ({ url }) or plain strings — handle all three.
export function mediaUrl(media: unknown): string | undefined {
  if (!media) return undefined;
  if (typeof media === "string") return media;
  const m = media as { url?: string; attributes?: { url?: string } };
  return m.attributes?.url ?? m.url ?? undefined;
}
