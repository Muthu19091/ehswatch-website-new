import axios, { type AxiosInstance, type AxiosError } from "axios";
import type {
  CmsBlogPost, CmsCaseStudy, CmsClientLogo, CmsFooter, CmsForm,
  CmsHeader, CmsPage, CmsProductModule, CmsSettings, CmsTestimonial,
  CollectionResponse, FormSubmitResult, SingletonResponse,
} from "@/lib/types";

// ─── Axios instances ──────────────────────────────────────────────────────────

const SSR_BASE    = "http://stage.odigma.ooo/ehswatch-cms/api/v1";
const PUBLIC_BASE = "https://stage.odigma.ooo/ehswatch-cms/api/v1";

function makeClient(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

// Server-side uses internal HTTP (same machine as CMS, avoids Cloudflare hop).
// Browser uses public HTTPS.
const ssrClient    = makeClient(SSR_BASE);
const publicClient = makeClient(PUBLIC_BASE);

const getClient = (): AxiosInstance =>
  typeof window === "undefined" ? ssrClient : publicClient;

// ─── SSR cache ────────────────────────────────────────────────────────────────
// Coalesces concurrent server-side renders hitting the same endpoint, preventing
// burst exhaustion of the CMS rate limit (60 req/min per IP — all SSR looks
// like one IP since Next.js and the CMS are on the same machine).

const _ssrCache = new Map<string, { data: unknown; expires: number }>();
const _inflight = new Map<string, Promise<unknown>>();

const DEFAULT_TTL = 10_000;
// Reference data that changes rarely — cache longer to cut request volume
// against the CMS's 60 req/min limit (all SSR shares one IP).
function ttlFor(path: string): number {
  if (path === "/pages" || path === "/header" || path === "/footer" || path === "/settings") {
    return 60_000;
  }
  return DEFAULT_TTL;
}

async function withLocale(path: string): Promise<string> {
  // Translation is handled client-side by Google Translate (googtrans cookie);
  // the API is always fetched in English. The CMS ?locale=ar layer stays
  // available server-side if authored translations are ever re-enabled.
  return path;
}

async function apiGet<T>(path: string): Promise<T | null> {
  if (typeof window !== "undefined") return _doGet<T>(path);

  const resolvedPath = await withLocale(path);

  const now = Date.now();
  const hit = _ssrCache.get(resolvedPath);
  if (hit && hit.expires > now) return hit.data as T | null;

  const inflight = _inflight.get(resolvedPath);
  if (inflight) return inflight as Promise<T | null>;

  const promise = _doGet<T>(resolvedPath)
    .then((data) => {
      _inflight.delete(resolvedPath);
      // Never cache failures (null): a transient 429/network error must not
      // poison the cache and 404 the page for the whole TTL window.
      if (data !== null) {
        _ssrCache.set(resolvedPath, { data, expires: Date.now() + ttlFor(resolvedPath) });
      }
      return data;
    })
    .catch((err) => {
      _inflight.delete(resolvedPath);
      throw err;
    });

  _inflight.set(resolvedPath, promise);
  return promise;
}

async function _doGet<T>(path: string, attempt = 0): Promise<T | null> {
  try {
    const res = await getClient().get<T>(path);
    return res.data;
  } catch (err) {
    const e = err as AxiosError;
    const status = e.response?.status;
    // Retry transient rate-limits (429) and 503s with short backoff so a burst
    // against the CMS's 60 req/min limit doesn't 404 an otherwise-valid page.
    if ((status === 429 || status === 503) && attempt < 3) {
      const wait = 250 * (attempt + 1) + Math.floor(Math.random() * 150);
      await new Promise((r) => setTimeout(r, wait));
      return _doGet<T>(path, attempt + 1);
    }
    console.error(
      `[CMS] GET ${path} →`,
      status ?? "network error",
      e.response?.data ?? e.message,
    );
    return null;
  }
}

// ─── Singletons ───────────────────────────────────────────────────────────────

export async function getSettings() {
  return apiGet<SingletonResponse<CmsSettings>>("/settings");
}

export async function getHeader() {
  return apiGet<SingletonResponse<CmsHeader>>("/header");
}

export async function getFooter() {
  return apiGet<SingletonResponse<CmsFooter>>("/footer");
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPage(slug: string) {
  // Draft preview: a valid page_preview cookie (set by /api/preview-page after
  // token verification) switches this fetch to the token-gated preview endpoint,
  // so every bespoke page route renders draft content with zero changes.
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const raw = (await cookies()).get("page_preview")?.value;
      if (raw) {
        // Cookie value is URL-encoded by NextResponse.cookies.set
        let decoded = raw;
        try { decoded = decodeURIComponent(raw); } catch { /* already decoded */ }
        const p = JSON.parse(decoded) as { slug?: string; token?: string; exp?: string | number };
        if (p?.slug === slug && p?.token && p?.exp) {
          const prev = await apiGet<SingletonResponse<CmsPage>>(
            `/preview/page/${encodeURIComponent(slug)}?token=${encodeURIComponent(p.token)}&exp=${encodeURIComponent(String(p.exp))}`,
          );
          if (prev) return prev;
        }
      }
    } catch { /* outside request context */ }
  }
  return apiGet<SingletonResponse<CmsPage>>(`/pages/${slug}`);
}

export async function getPageList() {
  return apiGet<CollectionResponse<{
    id: number;
    type: string;
    attributes: { slug: string; title: string; status: string; updated_at: string };
  }>>("/pages");
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(category?: string) {
  const path = category
    ? `/blog-posts?category=${encodeURIComponent(category)}`
    : "/blog-posts";
  return apiGet<CollectionResponse<CmsBlogPost>>(path);
}

export async function getBlogPost(slug: string) {
  return apiGet<SingletonResponse<CmsBlogPost>>(`/blog-posts/${slug}`);
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

export async function getCaseStudies() {
  return apiGet<CollectionResponse<CmsCaseStudy>>("/case-studies");
}

export async function getCaseStudy(slug: string) {
  return apiGet<SingletonResponse<CmsCaseStudy>>(`/case-studies/${slug}`);
}

// ─── Collections ──────────────────────────────────────────────────────────────

export async function getTestimonials() {
  return apiGet<CollectionResponse<CmsTestimonial>>("/testimonials");
}

export async function getClientLogos() {
  return apiGet<CollectionResponse<CmsClientLogo>>("/client-logos");
}

// ─── Product Modules ─────────────────────────────────────────────────────────

export async function getProductModules() {
  return apiGet<CollectionResponse<CmsProductModule>>("/product-modules");
}

export async function getProductModule(slug: string) {
  return apiGet<SingletonResponse<CmsProductModule>>(`/product-modules/${slug}`);
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export async function getForm(slug: string) {
  return apiGet<SingletonResponse<CmsForm>>(`/forms/${slug}`);
}

export async function submitForm(
  slug: string,
  data: Record<string, unknown>,
): Promise<FormSubmitResult> {
  try {
    const res = await publicClient.post<{ data: { attributes: { id: number; message: string; redirect_url: string | null } } }>(
      `/forms/${slug}/submit`,
      data,
    );
    return { ok: true, data: res.data.data?.attributes };
  } catch (err) {
    const e = err as AxiosError<{ errors: FormSubmitResult["errors"] }>;
    if (e.response?.data?.errors) {
      return { ok: false, errors: e.response.data.errors };
    }
    console.error("[CMS] form submit failed:", e.message);
    return {
      ok: false,
      errors: [{
        status: 500,
        code: "network_error",
        title: "Network error",
        detail: "Could not reach the server.",
        source: { pointer: "" },
      }],
    };
  }
}

// ─── Preview (draft content, token-gated) ────────────────────────────────────

export async function getPreviewBlogPost(slug: string, token: string, exp: string) {
  const qs = new URLSearchParams({ token, exp }).toString();
  return apiGet<SingletonResponse<CmsBlogPost>>(
    `/preview/blog-post/${encodeURIComponent(slug)}?${qs}`,
  );
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface CmsSearchResult {
  kind: string;
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  updated_at: string;
}

export async function search(query: string) {
  return apiGet<{ data: CmsSearchResult[]; meta: { request_id: string } }>(
    `/search?q=${encodeURIComponent(query)}`,
  );
}

// ─── Custom API data blocks ───────────────────────────────────────────────────

export async function getCustomApi(slug: string) {
  return apiGet<SingletonResponse<Record<string, unknown>>>(`/custom/${slug}`);
}

// ─── Draft preview (signed token from the CMS "Copy preview link" action) ────

export async function getPreview<T>(type: string, slug: string, token: string, exp: string) {
  const qs = `token=${encodeURIComponent(token)}&exp=${encodeURIComponent(exp)}`;
  return apiGet<SingletonResponse<T>>(`/preview/${encodeURIComponent(type)}/${encodeURIComponent(slug)}?${qs}`);
}
