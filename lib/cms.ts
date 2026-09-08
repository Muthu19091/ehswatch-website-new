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
  'https://cms.ehswatch.com/api/v1';

/* ─── Shared shapes ────────────────────────────────────────── */

export type Media = {
  id: number;
  url: string;
  alt: string | null;
  variants?: { thumb?: string; medium?: string; large?: string };
};

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
