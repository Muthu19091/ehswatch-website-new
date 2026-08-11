import { basePath } from "./basePath";

export type NavFlags = Map<string, { header: boolean; footer: boolean }>;

/** Build slug → {header, footer} from getPageList() data (each page's `nav`). */
export function buildNavFlags(pageListData: unknown): NavFlags {
  const map: NavFlags = new Map();
  const rows = Array.isArray(pageListData) ? pageListData : [];
  for (const p of rows as Array<{ attributes?: Record<string, unknown>; slug?: string }>) {
    const a = (p?.attributes ?? p ?? {}) as Record<string, unknown>;
    const nav = (a?.nav ?? {}) as { show_in_header?: boolean; show_in_footer?: boolean };
    const slug = a?.slug;
    if (typeof slug === "string" && slug) {
      map.set(slug, { header: Boolean(nav.show_in_header), footer: Boolean(nav.show_in_footer) });
    }
  }
  return map;
}

/**
 * A link URL → its top-level page slug, or null when it isn't a plain internal
 * page link (external, mailto/tel, bare anchor, has #/? , or a nested/deep path).
 * Those always render — manual addition of custom links is unaffected.
 */
export function navPageSlug(url?: string | null): string | null {
  let u = (url ?? "").trim();
  if (!u) return null;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(u) || /^(mailto:|tel:|#)/i.test(u)) return null;
  if (u.includes("#") || u.includes("?")) return null;
  if (basePath && u.startsWith(basePath)) u = u.slice(basePath.length) || "/";
  const path = u.replace(/^\/+|\/+$/g, "");
  if (path === "") return "home";
  if (path.includes("/")) return null; // nested path (e.g. /blog/x) — not a top-level nav page
  return path;
}

/**
 * True when this menu has at least one page with the toggle ON — i.e. the editor
 * is actively using page toggles as the source of truth for that menu. Until
 * then, filtering is a no-op (backward compatible: all links render).
 */
export function toggleInUse(flags: NavFlags, which: "header" | "footer"): boolean {
  for (const f of flags.values()) if (which === "header" ? f.header : f.footer) return true;
  return false;
}

/**
 * Should a header/footer link render? Non-page / external / anchored links always
 * show. A link to a known page shows unless toggles are in use for this menu AND
 * that page's toggle is off. So turning a page's show_in_header/footer OFF removes
 * it from that menu (manual link included); turning it back on restores it.
 */
export function navLinkVisible(
  url: string | undefined | null,
  flags: NavFlags,
  which: "header" | "footer",
): boolean {
  const slug = navPageSlug(url);
  if (slug === null) return true;
  if (!toggleInUse(flags, which)) return true;
  const f = flags.get(slug);
  if (!f) return true;
  return which === "header" ? f.header : f.footer;
}
