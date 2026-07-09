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
 * Resolve any CTA shape to an href. Handles anchor links, internal page_id
 * references (via pageMap), and plain URLs.
 */
export function resolveHref(cta: unknown, pageMap?: PageMap): string {
  const c = unwrapCta(cta);
  if (!c) return "#";
  if (c.type === "anchor") return (c.anchor as string) || "#";
  if ((c.type === "internal" || c.page_id) && c.page_id != null) {
    const slug = pageMap?.[String(c.page_id)];
    if (slug) return slugToPath(slug);
  }
  return (c.url as string) || "#";
}

/**
 * Resolve any CTA shape to { label, url }, or null when there's no label.
 * Labels are stripped of stray HTML like every other short CMS text field.
 */
export function resolveCta(cta: unknown, pageMap?: PageMap): { label: string; url: string } | null {
  const c = unwrapCta(cta);
  if (!c) return null;
  const label = stripHtml(c.label as string | null | undefined);
  if (!label) return null;
  return { label, url: resolveHref(c, pageMap) };
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
