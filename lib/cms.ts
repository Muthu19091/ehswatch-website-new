/**
 * EHSWatch CMS API client (read-only, static-export safe).
 *
 * - All fetches happen at BUILD time during `next build` because this
 *   project is configured with `output: "export"` in next.config.ts.
 * - The base URL must be set via `NEXT_PUBLIC_CMS_API_URL` (also baked
 *   in at build time). Defaults to the production CMS so a missing env
 *   var doesn't silently fall back to localhost.
 * - All responses follow the JSON:API-style `{ data, meta }` envelope.
 *   Errors follow RFC 7807 with `{ errors: [{ status, code, title,
 *   detail }] }`.
 */

const CMS_API_URL =
  process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/+$/, '') ||
  'https://cmsapi.ehswatch.com/api/v1';

/* ─── Shared shapes ────────────────────────────────────────── */

/**
 * Every `cover`/`avatar`/`og_image` field across the API is a full
 * MediaResource — {id, type: "media", attributes: {url, alt, …}} —
 * NOT a flat {id, url, alt} shape (confirmed against BE's
 * MediaResource.php and a real /api/v1/pages/about response: its
 * meta.og_image nests the url under `.attributes.url`). Use mediaUrl()
 * below rather than reading `.url` directly.
 */
export type Media = {
  id: number;
  type: 'media';
  attributes: {
    name: string | null;
    file_name: string | null;
    mime_type: string | null;
    url: string;
    alt: string | null;
    title: string | null;
    caption: string | null;
    variants: { thumb: string | null; medium: string | null; large: string | null };
    uploaded_at: string | null;
  };
};

export function mediaUrl(media: Media | null | undefined): string | null {
  return media?.attributes?.url ?? null;
}

export function mediaAlt(media: Media | null | undefined, fallback = ''): string {
  return media?.attributes?.alt ?? fallback;
}

export type ApiEnvelope<T> = { data: T; meta?: Record<string, unknown> };

export type ApiError = {
  errors: Array<{ status: number; code: string; title: string; detail?: string }>;
  meta?: { request_id?: string };
};

/* ─── Resource types ───────────────────────────────────────── */

export type BlogPost = {
  id: number;
  type: 'blog-post';
  attributes: {
    title: string;
    slug: string;
    category: string | null;
    excerpt: string | null;
    body: string;
    status: string;
    published_at: string | null;
    read_time_minutes: number | null;
    author: { id: number; name: string; avatar?: Media | null } | null;
    cover: Media | null;
    meta: {
      meta_title?: string;
      meta_description?: string;
      og_image?: Media | null;
    };
    structured_data?: Record<string, unknown>;
    updated_at: string;
  };
};

export type CaseStudy = {
  id: number;
  type: 'case-study';
  attributes: {
    title: string;
    slug: string;
    client_name: string | null;
    industry: string | null;
    summary: string | null;
    body: string;
    results: Array<{ label: string; value: string }> | null;
    status: string;
    published_at: string | null;
    cover: Media | null;
    meta: {
      meta_title?: string;
      meta_description?: string;
      og_image?: Media | null;
    };
    updated_at: string;
  };
};

/**
 * A single section block inside a Page's `content` array. `data`'s
 * shape depends on `type` (hero, rich_text, …) — deliberately loose
 * here; each section component narrows what it reads.
 */
export type PageSectionBlock = {
  type: string;
  data: Record<string, unknown>;
};

export type Page = {
  id: number;
  type: 'page';
  attributes: {
    title: string;
    slug: string;
    type: string;
    template: string | null;
    status: string;
    published_at: string | null;
    content: PageSectionBlock[];
    meta: {
      meta_title?: string | null;
      meta_description?: string | null;
      canonical_url?: string | null;
      og_image?: Media | null;
      robots?: string | null;
    };
    structured_data?: Array<Record<string, unknown>>;
    updated_at: string;
  };
};

export type SiteSettings = {
  appearance?: { primary_color?: string };
  brand?: {
    name?: string;
    tagline?: string;
    favicon?: string | Media;
    header_logo?: string | Media;
    footer_logo?: string | Media;
  };
  contact?: { email?: string; phone?: string; address?: string };
  seo?: { default_og_image?: string | Media };
};

/* ─── Low-level fetcher ────────────────────────────────────── */

async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${CMS_API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    ...init,
  });
  if (!res.ok) {
    // Try to surface RFC 7807 detail; fall back to status text.
    let detail = res.statusText;
    try {
      const j = (await res.json()) as ApiError;
      detail = j.errors?.[0]?.detail || j.errors?.[0]?.title || detail;
    } catch {
      /* non-JSON error */
    }
    throw new Error(`CMS ${res.status}: ${detail} — ${url}`);
  }
  return res.json() as Promise<T>;
}

/* ─── Public getters ───────────────────────────────────────── */

export async function getBlogPosts(): Promise<BlogPost[]> {
  const j = await cmsFetch<ApiEnvelope<BlogPost[]>>('/blog-posts');
  return j.data ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const j = await cmsFetch<ApiEnvelope<BlogPost>>(`/blog-posts/${slug}`);
    return j.data ?? null;
  } catch {
    return null;
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const j = await cmsFetch<ApiEnvelope<CaseStudy[]>>('/case-studies');
  return j.data ?? [];
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const j = await cmsFetch<ApiEnvelope<CaseStudy>>(`/case-studies/${slug}`);
    return j.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Every active CMS Page's slug — used by app/[slug]/page.tsx's
 * generateStaticParams() to discover pages at build time. This
 * project builds with `output: "export"`, so dynamicParams isn't
 * supported (Next.js requires every path enumerated up front): a page
 * created in the CMS only appears on the live site after the next
 * `next build` + deploy, same as blog posts today.
 *
 * per_page=100 covers current page volume in one request; revisit
 * with pagination if the CMS ever holds more Pages than that.
 */
export async function getPageSlugs(): Promise<string[]> {
  try {
    const j = await cmsFetch<ApiEnvelope<Page[]>>('/pages?per_page=100');
    return (j.data ?? []).map((p) => p.attributes.slug);
  } catch (err) {
    // Used by generateStaticParams() — an uncaught throw here fails the
    // ENTIRE `next build`, blocking deployment of every existing page
    // (about/, pricing/, …), not just CMS-authored ones. A transient
    // CMS API blip at build time should mean "this run's CMS pages
    // don't get (re)generated," not "nothing ships."
    console.error('getPageSlugs() failed — CMS-authored pages will not be generated this build:', err);
    return [];
  }
}

/**
 * Page id → slug, for resolving a LinkPicker "internal" CTA
 * (page_id-based — the field's own default type in the CMS, so this
 * is the common case, not an edge case) to a real href. Only ACTIVE
 * pages are returned by /pages, so a CTA pointing at an unpublished
 * or deleted page correctly falls back to unresolved rather than
 * linking somewhere non-public.
 *
 * Same endpoint as getPageSlugs() — Next.js's request memoization
 * dedupes identical fetches within one render pass, so calling both
 * doesn't double the network cost.
 */
export async function getPageIdSlugMap(): Promise<Record<number, string>> {
  try {
    const j = await cmsFetch<ApiEnvelope<Page[]>>('/pages?per_page=100');
    const map: Record<number, string> = {};
    for (const p of j.data ?? []) map[p.id] = p.attributes.slug;
    return map;
  } catch (err) {
    // Same reasoning as getPageSlugs(): this is awaited inside a
    // Promise.all() alongside getPage() in app/[slug]/page.tsx — an
    // uncaught throw here would fail that page's build (and, being a
    // shared build step, risks the whole `next build`). Degrades to
    // "internal page-id CTAs fall back to '#' this build" instead.
    console.error('getPageIdSlugMap() failed — internal page-id CTAs will not resolve this build:', err);
    return {};
  }
}

export async function getPage(slug: string): Promise<Page | null> {
  try {
    const j = await cmsFetch<ApiEnvelope<Page>>(`/pages/${slug}`);
    return j.data ?? null;
  } catch {
    return null;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const j = await cmsFetch<ApiEnvelope<SiteSettings>>('/settings');
  return j.data ?? {};
}

/* ─── Convenience formatters (used by UI components) ───────── */

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function dateSortKey(iso: string | null): number {
  return iso ? new Date(iso).getTime() : 0;
}

export function readTimeLabel(mins: number | null): string {
  if (!mins || mins < 1) return '1 min read';
  return `${mins} min read`;
}
