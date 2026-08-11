export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Prefix an internal, root-relative URL with the app basePath so raw <a> tags
 * (which, unlike next/link, do NOT add it) resolve correctly. External URLs,
 * protocol / mailto / tel links, bare anchors, and already-prefixed paths pass
 * through unchanged.
 */
export function withBasePath(url?: string | null): string {
  const u = (url ?? '').trim();
  if (!u) return u;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(u) || /^(mailto:|tel:|#)/i.test(u)) return u;
  if (!u.startsWith('/')) return u;
  if (basePath && (u === basePath || u.startsWith(basePath + '/'))) return u;
  return `${basePath}${u}`;
}
