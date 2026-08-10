import axios, { type AxiosInstance, type AxiosError } from "axios";
import type {
  CmsBlogPost, CmsCaseStudy, CmsClientLogo, CmsFooter, CmsForm,
  CmsHeader, CmsPage, CmsProductModule, CmsSettings, CmsTestimonial,
  CollectionResponse, FormSubmitResult, SingletonResponse,
} from "@/lib/types";
import { richHtml } from "@/lib/text";

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
// Last-known-good responses, kept indefinitely. When the CMS briefly returns a
// non-200 (deploy blip, cache clear, transient 5xx) the fetch resolves to null;
// rather than 404 the page we fall back to the last successful payload. This is
// the stale-while-error resilience an ISR layer would provide, implemented in
// the fetch layer so it works with our dynamic, cookie-aware page rendering.
const _lkg = new Map<string, unknown>();

const DEFAULT_TTL = 5_000;
// Short TTLs so CMS dashboard edits reflect quickly on stage/QA. Request bursts
// are still bounded by the inflight-dedup + retry/last-known-good-on-transient
// below, which protect the CMS's 60 req/min limit (all SSR shares one IP).
function ttlFor(path: string): number {
  // Layout singletons + the page list change less often — a slightly longer
  // TTL, but far shorter than the previous 60s so header/footer/settings edits
  // reflect within ~10s instead of a minute.
  if (path === "/pages" || path === "/header" || path === "/footer" || path === "/settings") {
    return 10_000;
  }
  return DEFAULT_TTL;
}

async function withLocale(path: string): Promise<string> {
  // Translation is handled client-side by Google Translate (googtrans cookie);
  // the API is always fetched in English. The CMS ?locale=ar layer stays
  // available server-side if authored translations are ever re-enabled.
  return path;
}

// The dashboard editor stores rich-text fields as TipTap/ProseMirror docs
// ({type:"doc",content:[...]}). The whole frontend expects HTML strings there,
// so convert every such doc to HTML right at the fetch boundary — one place
// fixes all pages/fields instead of guarding each render site.
function normalizeTiptapDeep(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(normalizeTiptapDeep);
  if (node && typeof node === "object") {
    const n = node as Record<string, unknown>;
    if (n.type === "doc" && Array.isArray(n.content)) return richHtml(n);
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(n)) out[k] = normalizeTiptapDeep(n[k]);
    return out;
  }
  return node;
}

async function apiGet<T>(path: string): Promise<T | null> {
  if (typeof window !== "undefined") return _doGet<T>(path).catch(() => null);

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
        // Remember the last good payload (except token-gated preview fetches,
        // which are transient and per-request).
        if (!resolvedPath.includes("/preview/")) _lkg.set(resolvedPath, data);
        return data;
      }
      // Genuine not-found (404/410): the record was unpublished/deleted — DROP
      // the last-known-good so drafted/deleted content stops rendering. Do NOT
      // serve stale here (fixes "draft/deleted page still shows").
      if (!resolvedPath.includes("/preview/")) _lkg.delete(resolvedPath);
      return null;
    })
    .catch((err) => {
      _inflight.delete(resolvedPath);
      // Transient failure (429 / 5xx / network) — degrade to last-known-good if
      // one exists, so a CMS blip serves slightly-stale content, not a 404.
      const stale = _lkg.get(resolvedPath);
      if (stale !== undefined) {
        console.warn(`[CMS] GET ${resolvedPath} transient failure — serving last-known-good`);
        return stale as T;
      }
      void err;
      return null;
    });

  _inflight.set(resolvedPath, promise);
  return promise;
}

async function _doGet<T>(path: string, attempt = 0): Promise<T | null> {
  try {
    // Accept the CMS "slug moved" 301 so we can FOLLOW it to the new slug —
    // renaming a page/blog/module/case-study slug in the CMS then keeps its
    // route working (the CMS records the old slug in its history and 301s).
    const res = await getClient().get<T>(path, {
      validateStatus: (st) => (st >= 200 && st < 300) || st === 301,
    });
    if (res.status === 301) {
      const body = res.data as { errors?: Array<{ redirect_to?: string }>; redirect_to?: string };
      const to = body?.errors?.[0]?.redirect_to ?? body?.redirect_to;
      if (typeof to === "string" && attempt < 3) {
        const newSlug = to.replace(/^\/+/, "").split(/[?#]/)[0].split("/").filter(Boolean).pop();
        if (newSlug) {
          const [base, query] = path.split("?");
          const newBase = base.replace(/[^/]+$/, encodeURIComponent(newSlug));
          return _doGet<T>(query ? `${newBase}?${query}` : newBase, attempt + 1);
        }
      }
      return null;
    }
    return normalizeTiptapDeep(res.data) as T;
  } catch (err) {
    const e = err as AxiosError;
    const status = e.response?.status;
    // Transient = rate-limit / server error / network. Retry, then THROW so
    // apiGet can degrade to last-known-good. A genuine 4xx (404/410/…) means the
    // record is gone/unpublished — return null so the page 404s and the stale
    // copy is dropped, instead of being served from cache.
    const transient = status === 429 || status === 503 || (status !== undefined && status >= 500) || status === undefined;
    if (transient && attempt < 3) {
      const wait = 250 * (attempt + 1) + Math.floor(Math.random() * 150);
      await new Promise((r) => setTimeout(r, wait));
      return _doGet<T>(path, attempt + 1);
    }
    console.error(
      `[CMS] GET ${path} →`,
      status ?? "network error",
      e.response?.data ?? e.message,
    );
    if (transient) throw e;
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
  data: Record<string, unknown> | FormData,
): Promise<FormSubmitResult> {
  try {
    // FormData (forms with a file field) must go as multipart so the browser
    // sets the boundary — override the client's default application/json.
    const isMultipart = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await publicClient.post<{ data: { attributes: { id: number; message: string; redirect_url: string | null } } }>(
      `/forms/${slug}/submit`,
      data,
      isMultipart ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
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
