import { basePath } from "@/lib/basePath";

/**
 * Resolves a LinkPicker-shaped CTA field from the CMS into a label +
 * href, or null when nothing is actually configured.
 *
 * Known BE data-quality quirk (confirmed against the real /api/v1/pages
 * response, not just docs): some existing content has a legacy
 * double-nested shape — `{ label, type, ..., <same_key>: { label,
 * type, ... } }` — where the outer level's own destination fields
 * (url/anchor/page_id) can be blank while the real value sits one
 * level deeper under a key matching the field's own name. Rather than
 * assume which level is authoritative, this reads whichever level
 * actually has a destination set, preferring the outer one.
 *
 * Handles external/relative urls, anchors, email/phone (BE's own
 * LinkPicker.php comment: "the frontend renderer prepends mailto:/tel:
 * based on type"), and `internal` (page_id) via the supplied id→slug
 * map — worth doing properly rather than a documented gap, since
 * `internal` is the LinkPicker field's own default type (confirmed in
 * LinkPicker.php: `Select::make('type')->default('internal')`), so
 * it's the common case an admin hits by just not touching the
 * dropdown, not an edge case. video-popup CTAs still aren't resolved
 * to a real destination.
 */
export type ResolvedLink = { label: string; href: string } | null;

type RawLink = {
  label?: unknown;
  type?: unknown;
  url?: unknown;
  anchor?: unknown;
  page_id?: unknown;
  [key: string]: unknown;
};

export function resolveLink(raw: unknown, ownKey?: string, pageMap?: Record<number, string>): ResolvedLink {
  if (!raw || typeof raw !== 'object') return null;
  const outer = raw as RawLink;

  const label = typeof outer.label === 'string' ? outer.label.trim() : '';
  if (!label) return null;

  const nested = ownKey && typeof outer[ownKey] === 'object' && outer[ownKey] !== null
    ? (outer[ownKey] as RawLink)
    : null;

  const type = firstDefined(outer.type, nested?.type);
  const url = firstDefined(outer.url, nested?.url);
  const anchor = firstDefined(outer.anchor, nested?.anchor);
  const pageId = firstDefined(outer.page_id, nested?.page_id);

  switch (type) {
    // 'blog'/'casestudy'/'module' (quick-select conveniences in the
    // admin) are normalized to 'external' with a relative url by the
    // BE's own dehydrateStateUsing before they're ever stored — by the
    // time this runs they're indistinguishable from a plain external
    // link, so no separate case is needed for them.
    case 'external':
    case 'url':
      // CMS-stored "external" URLs are often actually a same-site
      // relative path (confirmed against real content, e.g.
      // "/contact-us") rather than a different domain — matches how
      // app/not-found.tsx already treats CMS CTA urls. Only a
      // relative path needs the deployment's basePath prefix; a truly
      // absolute URL (http(s)://…) is left untouched.
      return typeof url === 'string' && url
        ? { label, href: url.startsWith('/') ? `${basePath}${url}` : url }
        : null;
    case 'anchor':
      return typeof anchor === 'string' && anchor
        ? { label, href: anchor.startsWith('#') ? anchor : `#${anchor}` }
        : null;
    case 'email':
      // BE stores the raw address on `url`; its own code comment says
      // the frontend is responsible for prepending `mailto:`.
      return typeof url === 'string' && url ? { label, href: `mailto:${url}` } : null;
    case 'phone':
      return typeof url === 'string' && url ? { label, href: `tel:${url.replace(/\s+/g, '')}` } : null;
    case 'internal': {
      const id = typeof pageId === 'number' ? pageId : Number(pageId);
      const targetSlug = pageMap && Number.isFinite(id) ? pageMap[id] : undefined;
      // Not found = page unpublished/deleted since this CTA was set,
      // or no pageMap was supplied by the caller — fall back rather
      // than link somewhere that 404s.
      if (!targetSlug) return { label, href: '#' };
      const path = targetSlug === 'home' ? '/' : `/${targetSlug}/`;
      return { label, href: `${basePath}${path}` };
    }
    default:
      // video-popup CTAs aren't resolvable to a concrete href from
      // this fetch alone.
      return { label, href: '#' };
  }
}

function firstDefined(...values: unknown[]): unknown {
  for (const v of values) {
    if (v !== null && v !== undefined && v !== '') return v;
  }
  return undefined;
}
