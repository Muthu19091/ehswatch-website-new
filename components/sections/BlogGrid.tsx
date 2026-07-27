"use client";

import { useState, useMemo } from "react";
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
// Topic/Format options are derived from the actual posts (CMS categories) so
// the dropdowns always match what editors set in the dashboard.

/* ── Featured Card (Row 1): image left, text right ───────────── */
function FeaturedCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex bg-white overflow-hidden h-full"
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: 8,
        transition: "border-color 0.25s ease",
        borderColor: hovered ? "#d1d5db" : "#E5E7EB",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — left ~47%. Covers upload at 3:2 or 16:9; an 8:5 box sits
          between them so object-cover fills fully with only edge-sliver crop */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ width: "47%", aspectRatio: "8/5", borderRadius: "7px 0 0 7px" }}
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
              transform: hovered ? "scale(1.04)" : "scale(1)",
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
          style={{ color: "#FF6D00" }}
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
function StandardCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/blog/${post.slug}`}
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
              transform: hovered ? "scale(1.04)" : "scale(1)",
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
          className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[17px] leading-[1.35] line-clamp-2 mb-2.5"
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
          style={{ color: "#FF6D00" }}
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
  showSearch = true,
  showTimeline = true,
  showTopic = true,
  showFormat = true,
}: {
  cmsPosts?: CmsBlogPost[];
  showSearch?: boolean;
  showTimeline?: boolean;
  showTopic?: boolean;
  showFormat?: boolean;
}) {
  // CMS-only: no hardcoded fallback posts.
  const POSTS = cmsPosts && cmsPosts.length > 0 ? cmsPosts.map(cmsToPost) : [];

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

  const featured = filtered.slice(0, 2);
  const standard = filtered.slice(2);

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
          <div className="flex flex-col gap-6">
            {/* Row 1 — featured 2-col */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((p) => <FeaturedCard key={p.slug} post={p} />)}
                {featured.length === 1 && <div className="hidden md:block" />}
              </div>
            )}

            {/* Row 2 — standard 4-col */}
            {standard.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {standard.map((p) => <StandardCard key={p.slug} post={p} />)}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
