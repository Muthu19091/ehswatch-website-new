"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { mediaUrl } from "@/lib/blocks";
import Link from "next/link";
import type { CmsBlogPost } from "@/lib/types";

/* ── Data ───────────────────────────────────────────────────── */
interface Post {
  slug: string;
  category: string;
  topic: string;
  format: string;
  title: string;
  excerpt: string;
  date: string;
  dateSort: number;
  readTime: string;
  img: string | null;
}

function cmsToPost(p: CmsBlogPost): Post {
  return {
    slug:     p.attributes.slug,
    category: p.attributes.category ?? "",
    topic:    p.attributes.category ?? "",
    format:   "Article",
    title:    p.attributes.title,
    excerpt:  p.attributes.excerpt,
    date:     new Date(p.attributes.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    dateSort: new Date(p.attributes.published_at).getTime(),
    readTime: `${p.attributes.read_time_minutes} min read`,
    // CMS-only cover — no stock-image fallback; cards show a neutral panel instead.
    img:      mediaUrl(p.attributes.cover) ?? null,
  };
}


const TIMELINE_OPTIONS = ["Timeline: All time", "Last month", "Last 3 months", "This year"];
// Posts per page. Each page renders its first 2 as large featured cards and the
// next 4 in the standard grid — one clean featured row + one grid row (2 + 4).
const DEFAULT_PAGE_SIZE = 6;

// Windowed page list for the pager: 1 … (cur-1) cur (cur+1) … N. Keeps the
// control compact as the blog grows; returns page numbers with "…" separators.
function pageItems(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) out.push(i);
    else if (out[out.length - 1] !== "…") out.push("…");
  }
  return out;
}
// Topic/Format options are derived from the actual posts (CMS categories) so
// the dropdowns always match what editors set in the dashboard.

/* ── Featured Card (Row 1): image left, text right ───────────── */
function FeaturedCard({ post, listingSlug }: { post: Post; listingSlug: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/${listingSlug}/${post.slug}`}
      className="group flex flex-col xl:flex-row bg-white overflow-hidden h-full"
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        transition: "border-color 0.25s ease",
        borderColor: hovered ? "#d1d5db" : "#E5E7EB",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image. Row layout (image left ~47%) only kicks in at xl; below that the
          card stacks so the wide landscape cover shows in a full-width 8:5 box.
          In the row layout the flex row stretches this box to the card's height,
          and at < xl widths the text wraps taller, turning the box portrait and
          cropping the cover's right side off — hence stacking below xl. */}
      <div
        className="relative flex-shrink-0 overflow-hidden w-full xl:w-[47%]"
        style={{ aspectRatio: "8/5" }}
      >
        {post.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{
              display: "block",
              objectPosition: "left center",
              // Rest at `none`, not `scale(1)`: a resting transform promotes the
              // <img> to its own compositing layer, and inside the card's rounded
              // overflow-hidden clip iOS Safari then intermittently fails to paint
              // the sibling text until a repaint (scroll/tap) — cards showed image
              // only, text blank. `none` at rest keeps the card on one layer; the
              // hover zoom (desktop-only, never fires on touch) still animates.
              transform: hovered ? "scale(1.04)" : "none",
              transition: "transform 0.5s ease",
            }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#eef4ff 0%,#dbeafe 100%)" }} />
        )}
      </div>

      {/* Text — right, vertically centered */}
      <div className="flex flex-col justify-center px-7 py-7" style={{ flex: 1 }}>
        <p className="font-[family-name:var(--font-dm-sans)] text-[12px] mb-3 flex items-center gap-1.5" style={{ color: "#6B7280" }}>
          {post.date}
          <span className="inline-block w-[3px] h-[3px] rounded-full" style={{ background: "#6B7280" }} />
          {post.readTime}
        </p>
        <h3
          className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[17px] leading-[1.35] mb-3"
          style={{ color: "#111827" }}
        >
          {post.title}
        </h3>
        <p
          className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[1.6] mb-5 line-clamp-3 text-pretty"
          style={{ color: "#6B7280" }}
        >
          {post.excerpt}
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold font-[family-name:var(--font-dm-sans)]"
          style={{ color: "var(--brand-primary)" }}
        >
          Read more
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Standard Card (Row 2): image top, text bottom ───────────── */
function StandardCard({ post, listingSlug }: { post: Post; listingSlug: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/${listingSlug}/${post.slug}`}
      className="group flex flex-col bg-white overflow-hidden h-full"
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        transition: "border-color 0.25s ease",
        borderColor: hovered ? "#d1d5db" : "#E5E7EB",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image. Covers upload at 3:2 or 16:9; an 8:5 box sits between them
          so object-cover fills fully with only edge-sliver crop */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ aspectRatio: "8/5", borderRadius: "7px 7px 0 0" }}
      >
        {post.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{
              display: "block",
              objectPosition: "left center",
              // Rest at `none`, not `scale(1)`: a resting transform promotes the
              // <img> to its own compositing layer, and inside the card's rounded
              // overflow-hidden clip iOS Safari then intermittently fails to paint
              // the sibling text until a repaint (scroll/tap) — cards showed image
              // only, text blank. `none` at rest keeps the card on one layer; the
              // hover zoom (desktop-only, never fires on touch) still animates.
              transform: hovered ? "scale(1.04)" : "none",
              transition: "transform 0.5s ease",
            }}
          />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#eef4ff 0%,#dbeafe 100%)" }} />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col px-5 pt-4 pb-5 flex-1">
        <p className="font-[family-name:var(--font-dm-sans)] text-[12px] mb-2.5 flex items-center gap-1.5" style={{ color: "#6B7280" }}>
          {post.date}
          <span className="inline-block w-[3px] h-[3px] rounded-full" style={{ background: "#6B7280" }} />
          {post.readTime}
        </p>
        <h3
          className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[17px] leading-[1.35] line-clamp-none sm:line-clamp-2 mb-2.5"
          style={{ color: "#111827" }}
        >
          {post.title}
        </h3>
        <p
          className="font-[family-name:var(--font-dm-sans)] text-[12.5px] leading-[1.6] line-clamp-2 mb-4 flex-1 text-pretty"
          style={{ color: "#6B7280" }}
        >
          {post.excerpt}
        </p>
        <span
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold font-[family-name:var(--font-dm-sans)]"
          style={{ color: "var(--brand-primary)" }}
        >
          Read more
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}

/* ── Filter select ───────────────────────────────────────────── */
function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const isDefault = value === options[0];
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none font-[family-name:var(--font-dm-sans)] text-[13px] bg-white rounded-full pl-5 pr-8 py-[11px] border cursor-pointer focus:outline-none focus:border-[#111827] transition-colors"
        style={{
          WebkitAppearance: "none",
          borderColor: isDefault ? "#E5E7EB" : "#111827",
          color:       isDefault ? "#6B7280" : "#111827",
          fontWeight:  isDefault ? 400 : 600,
        }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#9ca3af" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────── */
export default function BlogGrid({
  cmsPosts,
  listingSlug = "blog",
  cmsPageSize,
  showSearch = true,
  showTimeline = true,
  showTopic = true,
  showFormat = true,
  pagination,
  loadMoreLabel,
}: {
  cmsPosts?: CmsBlogPost[];
  listingSlug?: string;
  cmsPageSize?: number;
  showSearch?: boolean;
  showTimeline?: boolean;
  showTopic?: boolean;
  showFormat?: boolean;
  pagination?: string;
  loadMoreLabel?: string;
}) {
  // CMS-only: no hardcoded fallback posts.
  const POSTS = cmsPosts && cmsPosts.length > 0 ? cmsPosts.map(cmsToPost) : [];
  // Posts per page — CMS blog_highlights.max_count when set, else the default.
  const PAGE_SIZE = cmsPageSize && cmsPageSize > 0 ? cmsPageSize : DEFAULT_PAGE_SIZE;

  // Dedupe case-insensitively (categories are free text in the CMS) —
  // first-seen casing wins as the display value
  const uniqueCI = (values: string[]): string[] => {
    const seen = new Map<string, string>();
    for (const v of values) {
      const k = v.trim().toLowerCase();
      if (k && !seen.has(k)) seen.set(k, v.trim());
    }
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  };
  const topicOptions = ["Topic: All topics", ...uniqueCI(POSTS.map((p) => p.topic).filter(Boolean))];
  const formatOptions = ["Format: All formats", ...uniqueCI(POSTS.map((p) => p.format).filter(Boolean))];
  // CMS toggles control filter visibility (matches Timeline/Topic behaviour).
  const topicEnabled = showTopic;
  const formatEnabled = showFormat;
  const anyControl = showSearch || showTimeline || topicEnabled || formatEnabled;
  const anyFilter = showTimeline || topicEnabled || formatEnabled;

  const [search,   setSearch]   = useState("");
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[0]);
  const [topic,    setTopic]    = useState("Topic: All topics");
  const [format,   setFormat]   = useState("Format: All formats");
  const [page,     setPage]     = useState(1);
  const loadMore = (pagination ?? "").toLowerCase() === "load_more";
  const [shownCount, setShownCount] = useState(PAGE_SIZE);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const now = Date.now();
    return POSTS.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${p.title} ${p.category} ${p.excerpt}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (timeline === "Last month"    && now - p.dateSort > 30  * 86400000) return false;
      if (timeline === "Last 3 months" && now - p.dateSort > 90  * 86400000) return false;
      if (timeline === "This year"     && now - p.dateSort > 365 * 86400000) return false;
      if (!topic.startsWith("Topic:") && p.topic.trim().toLowerCase() !== topic.trim().toLowerCase()) return false;
      if (!format.startsWith("Format:") && p.format.trim().toLowerCase() !== format.trim().toLowerCase()) return false;
      return true;
    });
  }, [search, timeline, topic, format]);

  // Reset to page 1 whenever the filters change so a narrowed result set
  // doesn't land the reader on a now-empty page.
  useEffect(() => { setPage(1); }, [search, timeline, topic, format]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages); // guard against a stale page
  const pageStart   = (currentPage - 1) * PAGE_SIZE;
  const pagePosts   = loadMore ? filtered.slice(0, shownCount) : filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const featured    = pagePosts.slice(0, 2);
  const standard    = pagePosts.slice(2);

  // Reported live: on phone, clicking a page number sometimes scrolled all
  // the way to the footer instead of the top of the grid. Root cause: this
  // used to compute the scroll target from gridRef.getBoundingClientRect()
  // in the SAME synchronous click handler as setPage() -- read immediately
  // after a state update, before React has actually committed the new
  // page's (often shorter) content to the DOM. The measurement was of the
  // OLD page's layout, not the new one, so scrolling to it could land well
  // past the new, shorter page's actual content -- variable by page-size
  // delta and by how a given browser happens to schedule the paint, which
  // is exactly the kind of thing that "works" in one engine and doesn't in
  // another. Doing the measurement in an effect keyed on currentPage
  // guarantees it only ever runs after the new page has actually rendered.
  const pendingScrollRef = useRef(false);

  const goToPage = (n: number) => {
    const target = Math.min(Math.max(1, n), totalPages);
    if (target === currentPage) return;
    pendingScrollRef.current = true;
    setPage(target);
  };

  useEffect(() => {
    if (!pendingScrollRef.current) return;
    pendingScrollRef.current = false;
    if (gridRef.current) {
      const y = gridRef.current.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage]);

  // CMS-only: nothing to list → hide the section entirely.
  if (POSTS.length === 0) return null;

  return (
    <section className="pt-[48px] pb-[80px] px-8" style={{ background: "#FFFFFF" }}>
      <div className="max-w-[1280px] mx-auto">

        {/* ── Search + Filters — centred, max 720px. Each control is
            CMS-toggleable; the whole block hides when all are off. ── */}
        {anyControl && (
          <div className="flex flex-col gap-5 mb-12 max-w-[720px] mx-auto">
            {showSearch && (
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="#9ca3af" strokeWidth="1.5"/>
                  <path d="M11 11l2.5 2.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by keyword, topic, regulation, site issue..."
                  autoComplete="off"
                  className="w-full font-[family-name:var(--font-dm-sans)] text-[14px] placeholder-[#9ca3af] bg-[#f9fafb] rounded-full pl-10 pr-5 py-[12px] border border-[#E5E7EB] focus:outline-none focus:border-[#111827] transition-colors"
                  style={{ color: "#111827" }}
                />
              </div>
            )}

            {anyFilter && (
              <div className="flex flex-wrap gap-3 [&>*]:flex-1 [&>*]:min-w-[180px]">
                {showTimeline && <FilterSelect value={timeline} onChange={setTimeline} options={TIMELINE_OPTIONS} />}
                {topicEnabled && <FilterSelect value={topic} onChange={setTopic} options={topicOptions} />}
                {formatEnabled && <FilterSelect value={format} onChange={setFormat} options={formatOptions} />}
              </div>
            )}
          </div>
        )}

        {/* ── Grid ────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px]" style={{ color: "#9ca3af" }}>
              No articles match your filters.
            </p>
          </div>
        ) : (
          <div ref={gridRef} className="flex flex-col gap-6 scroll-mt-24">
            {/* Both rows stay flex-wrap at EVERY breakpoint, never CSS grid.
                iOS Safari mis-sizes a `h-full` card whose image uses
                `aspect-ratio` inside an auto grid row — the card inflates and
                the text below the image stops painting (fine on Chromium).
                An earlier version of this fix only applied below md/sm and
                switched back to CSS grid above it — which meant an iPad
                (portrait hits sm/md, landscape hits lg) got zero protection
                and still hit the bug. flex-wrap + basis percentages replicate
                the same column counts without ever using grid, at any width. */}
            {/* Row 1 — featured 2-col from md up */}
            {featured.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {featured.map((p) => (
                  <div key={p.slug} className="w-full md:basis-[calc(50%-0.75rem)]">
                    <FeaturedCard post={p} listingSlug={listingSlug} />
                  </div>
                ))}
                {featured.length === 1 && <div className="hidden md:block md:basis-[calc(50%-0.75rem)]" />}
              </div>
            )}

            {/* Row 2 — standard cards: full-width on mobile, 2-col from sm, 4-col from lg */}
            {standard.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {standard.map((p) => (
                  <div key={p.slug} className="w-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(25%-1.125rem)]">
                    <StandardCard post={p} listingSlug={listingSlug} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination — numbered pager (Prev · 1 … N · Next) */}
            {!loadMore && totalPages > 1 && (
              <nav className="flex justify-center items-center gap-1.5 mt-6" aria-label="Blog pagination">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e5e7eb] text-[#4b5563] transition-colors disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-[var(--brand-primary)] enabled:hover:text-[var(--brand-primary)]"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 3L5 7l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>

                {pageItems(currentPage, totalPages).map((it, i) =>
                  it === "…" ? (
                    <span key={`e${i}`} className="inline-flex items-center justify-center w-9 h-9 text-[#9ca3af] text-[14px] select-none">…</span>
                  ) : (
                    <button
                      key={it}
                      type="button"
                      onClick={() => goToPage(it)}
                      aria-current={it === currentPage ? "page" : undefined}
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-[14px] font-[family-name:var(--font-dm-sans)] font-medium border transition-colors ${
                        it === currentPage
                          ? "bg-[var(--brand-primary)] border-[var(--brand-primary)] text-white"
                          : "border-[#e5e7eb] text-[#4b5563] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                      }`}
                    >
                      {it}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#e5e7eb] text-[#4b5563] transition-colors disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-[var(--brand-primary)] enabled:hover:text-[var(--brand-primary)]"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5.5 3L9 7l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </nav>
            )}

            {loadMore && filtered.length > shownCount && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setShownCount((v) => v + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5e7eb] text-[#4b5563] font-[family-name:var(--font-dm-sans)] font-medium text-[14px] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  {loadMoreLabel?.trim() || "Load More"}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
