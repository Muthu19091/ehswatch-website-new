"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CMS_API =
  process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cmsapi.ehswatch.com/api/v1";

type SearchHit = {
  kind: "page" | "blog-post" | "case-study" | "product-module";
  id: number;
  slug: string;
  title: string | null;
  excerpt: string | null;
  url: string;
  updated_at: string | null;
};

type SearchEnvelope = {
  data: SearchHit[];
  meta: { query: string; types: string[]; count: number };
};

const KIND_LABEL: Record<SearchHit["kind"], string> = {
  page: "Page",
  "blog-post": "Blog post",
  "case-study": "Case study",
  "product-module": "Module",
};

const TYPE_FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Everything" },
  { value: "blog-post", label: "Blog posts" },
  { value: "case-study", label: "Case studies" },
  { value: "product-module", label: "Modules" },
  { value: "page", label: "Pages" },
];

function SearchPage() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const initialType = params.get("type") ?? "";

  const [type, setType] = useState(initialType);
  const [input, setInput] = useState(q);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [meta, setMeta] = useState<SearchEnvelope["meta"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q || q.length < 2) {
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    // Flipping loading/error before kicking off the fetch is the standard
    // pattern for URL-param-driven search in a static-export client component.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    setError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    const url = new URL(`${CMS_API}/search`);
    url.searchParams.set("q", q);
    if (type) url.searchParams.set("type", type);
    url.searchParams.set("per_page", "20");
    fetch(url.toString(), { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<SearchEnvelope>;
      })
      .then((j) => {
        if (cancelled) return;
        setHits(j.data ?? []);
        setMeta(j.meta ?? null);
      })
      .catch((e) => {
        if (cancelled || (e as Error).name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Search failed");
        setHits([]);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [q, type]);

  const hasValidQuery = q.length >= 2;
  const visibleHits = hasValidQuery ? hits : [];
  const visibleMeta = hasValidQuery ? meta : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URL(window.location.href);
    next.searchParams.set("q", input.trim());
    if (type) next.searchParams.set("type", type);
    else next.searchParams.delete("type");
    window.location.assign(next.toString());
  };

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen pt-24 pb-24">
        <div className="max-w-[920px] mx-auto px-4 md:px-6">
          <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[34px] md:text-[44px] leading-tight text-[#0a0f1e] mb-3">
            Search
          </h1>
          <p className="font-[family-name:var(--font-inter)] text-[15px] md:text-[16px] text-[#6b7280] mb-8">
            Search across pages, blog posts, case studies, and product modules.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search EHSWatch…"
              autoFocus
              className="flex-1 px-4 py-3 rounded-full border border-[#e5e7eb] focus:border-[#ff6d00] focus:outline-none font-[family-name:var(--font-inter)] text-[15px]"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-3 rounded-full border border-[#e5e7eb] focus:border-[#ff6d00] focus:outline-none font-[family-name:var(--font-inter)] text-[15px] bg-white"
            >
              {TYPE_FILTERS.map((t) => (
                <option key={t.value || "all"} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#ff6d00] text-white font-[family-name:var(--font-inter)] font-medium text-[15px] hover:bg-[#e66200] transition-colors"
            >
              Search
            </button>
          </form>

          {hasValidQuery && visibleMeta && !loading && (
            <p className="text-[14px] text-[#6b7280] mb-6 font-[family-name:var(--font-inter)]">
              {visibleMeta.count} result{visibleMeta.count === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-[#0a0f1e]">&ldquo;{q}&rdquo;</span>
            </p>
          )}

          {loading && (
            <p className="text-[#6b7280] py-8 font-[family-name:var(--font-inter)]">Searching…</p>
          )}

          {error && (
            <div className="py-8 px-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-[family-name:var(--font-inter)]">
              Search failed: {error}. Please try again.
            </div>
          )}

          {q && q.length < 2 && (
            <p className="text-[#6b7280] py-8 font-[family-name:var(--font-inter)]">
              Type at least 2 characters to search.
            </p>
          )}

          {!loading && !error && visibleHits.length > 0 && (
            <ul className="divide-y divide-[#e5e7eb]">
              {visibleHits.map((hit) => (
                <li key={`${hit.kind}-${hit.id}`} className="py-5">
                  <Link
                    href={hit.url}
                    className="group block rounded-lg p-4 -mx-4 hover:bg-[#fafafa] transition-colors"
                  >
                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#fff3e6] text-[#ff6d00] text-[11px] font-medium uppercase tracking-wide mb-2 font-[family-name:var(--font-inter)]">
                      {KIND_LABEL[hit.kind]}
                    </span>
                    <h2 className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[19px] md:text-[20px] leading-snug text-[#0a0f1e] group-hover:text-[#ff6d00] transition-colors mb-1">
                      {hit.title ?? hit.slug}
                    </h2>
                    {hit.excerpt && (
                      <p className="font-[family-name:var(--font-inter)] text-[14px] leading-relaxed text-[#6b7280]">
                        {hit.excerpt}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && hasValidQuery && visibleHits.length === 0 && visibleMeta && (
            <div className="py-12 text-center">
              <p className="text-[#6b7280] font-[family-name:var(--font-inter)] text-[15px]">
                No results for <span className="font-semibold text-[#0a0f1e]">&ldquo;{q}&rdquo;</span>.
                Try a different word or change the filter.
              </p>
            </div>
          )}

          {!q && (
            <div className="py-12 text-center">
              <p className="text-[#6b7280] font-[family-name:var(--font-inter)] text-[15px]">
                Start typing to search.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <main className="bg-white min-h-screen pt-24 pb-24" />
          <Footer />
        </>
      }
    >
      <SearchPage />
    </Suspense>
  );
}
