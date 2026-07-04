import type { CmsBlock } from "@/lib/types";
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

export function resolveHref(cta: unknown): string {
  if (!cta || typeof cta !== "object") return "#";
  const c = cta as Record<string, unknown>;
  return c.type === "anchor" ? (c.anchor as string) || "#" : (c.url as string) || "#";
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
