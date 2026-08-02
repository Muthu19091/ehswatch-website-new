"use client";

import { useState, useEffect } from "react";
import { mediaUrl } from "@/lib/blocks";
import Link from "next/link";
import type { CmsBlogPost } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

export interface BlogPostData {
  slug: string;
  category: string;
  title: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  coverImg: string;
  secondaryImg?: string;
  tertiaryImg?: string;
}



// Editors sometimes author headings as whole-bold paragraphs instead of using
// the editor's H2 button. Normalise those at render time so every post — past
// and future — gets real, styled headings regardless of authoring habit.
function normalizeBody(html: string): string {
  return html
    .replace(
      /<p>\s*<strong>([^<]{1,90}?)<\/strong>(?:&nbsp;|\s)*<\/p>/g,
      (_, t: string) => `<h2>${t.trim()}</h2>`,
    )
    // Wrap tables so they scroll horizontally on narrow viewports instead of
    // overflowing the page. Scoped to the blog body — see .blog-table-wrap CSS.
    .replace(
      /<table[\s\S]*?<\/table>/g,
      (m: string) => `<div class="blog-table-wrap">${m}</div>`,
    );
}


function getPrevNext(slug: string, cmsSlugs?: string[]) {
  const list = cmsSlugs && cmsSlugs.length > 0 ? cmsSlugs : [];
  const idx = list.indexOf(slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < list.length - 1 ? { slug: list[idx + 1] } : null,
    next: idx > 0 ? { slug: list[idx - 1] } : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function BlogPost({ slug, cmsPost, cmsSlugs }: { slug: string; cmsPost?: CmsBlogPost; cmsSlugs?: string[] }) {
  // CMS-only: the blog routes 404 on missing/unpublished posts, so there is
  // always a real CMS record here — no hardcoded placeholder content.
  if (!cmsPost) return null;
  const post: BlogPostData = {
    slug,
    category: cmsPost.attributes.category ?? "",
    title: cmsPost.attributes.title,
    date: new Date(cmsPost.attributes.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
    readTime: `${cmsPost.attributes.read_time_minutes} min read`,
    author: cmsPost.attributes.author?.name ?? "",
    authorRole: "",
    coverImg: mediaUrl(cmsPost.attributes.cover) ?? "",
  };
  const { prev, next } = getPrevNext(slug, cmsSlugs);

  return (
    <>
      <style>{`
        .blog-body p + p { margin-top: 1.6rem; }
        .blog-body h2 { font-family: var(--font-gothic-a1), sans-serif; font-weight: 700; font-size: 1.5rem; color: #0a0f1e; margin: 2.4rem 0 0.9rem; letter-spacing: -0.02em; line-height: 1.3; }
        .blog-body h3 { font-family: var(--font-gothic-a1), sans-serif; font-weight: 700; font-size: 1.2rem; color: #0a0f1e; margin: 2rem 0 0.7rem; line-height: 1.3; }
        .blog-body h4 { font-family: var(--font-gothic-a1), sans-serif; font-weight: 700; font-size: 1.05rem; color: #0a0f1e; margin: 1.7rem 0 0.6rem; }
        .blog-body ul, .blog-body ol { margin: 1.1rem 0 1.4rem; padding-left: 1.4rem; }
        .blog-body ul { list-style: disc; }
        .blog-body ol { list-style: decimal; }
        .blog-body li { margin-top: 0.5rem; }
        .blog-body li::marker { color: #155eef; }
        .blog-body a { color: #FF6D00; text-decoration: underline; text-underline-offset: 2px; }
        .blog-body strong { color: #111827; }
        .blog-body img { border-radius: 12px; margin: 1.5rem 0; max-width: 100%; height: auto; }
        .blog-body blockquote { border-left: 3px solid #155eef; padding-left: 1rem; font-style: italic; color: #4b5563; margin: 1.5rem 0; }
        .blog-body table { width: 100%; border-collapse: collapse; margin: 1.4rem 0; font-size: 0.95em; }
        .blog-body th, .blog-body td { border: 1px solid #e5e7eb; padding: 0.55rem 0.8rem; text-align: left; }
        .blog-body th { background: #f9fafb; font-weight: 600; color: #111827; }
        /* Table scroll container (added by normalizeBody). Owns the vertical
           spacing so tables clear the following heading, and lets wide tables
           scroll horizontally on mobile instead of overflowing the viewport.
           min-width keeps columns readable: full-width on desktop, scroll below ~560px. */
        .blog-body .blog-table-wrap { overflow-x: auto; margin: 1.4rem 0 2.5rem; -webkit-overflow-scrolling: touch; }
        .blog-body .blog-table-wrap table { margin: 0; width: 100%; min-width: 560px; }
        .blog-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #d1d5db;
        }
        .blog-divider::before,
        .blog-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }
        .post-grid {
          background-image:
            linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .post-box { position: absolute; width: 48px; height: 48px; }
        @keyframes postBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.5; }
        }
      `}</style>

      <article className="bg-white min-h-screen">

        {/* ── Hero banner ── */}
        <section className="relative overflow-hidden flex flex-col items-center justify-end px-6 pt-[148px] pb-[52px]">
          {/* Animated grid background */}
          <div className="absolute inset-0 overflow-hidden post-grid pointer-events-none">
            {Array.from({ length: 200 }, (_, i) => {
              const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
              const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
              return shouldAnimate ? (
                <div
                  key={i}
                  className="post-box"
                  style={{
                    left: `${(i % 20) * 50 + 1}px`,
                    top: `${Math.floor(i / 20) * 50 + 1}px`,
                    backgroundColor: colors[i % 4],
                    animation: `postBoxFill ${4 + ((i * 2) % 6)}s ease-in-out infinite`,
                    animationDelay: `${(i * 0.45) % 4}s`,
                  }}
                />
              ) : null;
            })}
            {/* Tall gradient — fades grid smoothly into white */}
            <div
              className="absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                height: "65%",
                background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 45%, #FFFFFF 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 75% 75% at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 50%, transparent 100%)" }}
            />
          </div>

          {/* Hero content */}
          <div className="relative z-20 max-w-[760px] w-full mx-auto text-center flex flex-col items-center gap-4">
            {/* Category pill — CMS-only */}
            {post.category && (
              <span
                className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "#1d4ed8" }}
              >
                {post.category}
              </span>
            )}

            {/* Title */}
            <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] tracking-[-0.025em] text-[#0a0f1e]">
              {post.title}
            </h1>

            {/* Date + Share/Bookmark — between two separator lines */}
            <div className="w-full max-w-[680px]" style={{ borderTop: "1px solid rgba(229,231,235,0.7)" }} />
            {/* dir=ltr keeps this row fixed (date+read-time on the left, actions on
                the right) so it doesn't swap sides when the page flips to RTL. */}
            <div dir="ltr" className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0 w-full max-w-[680px] py-3">
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">{post.date}</span>
                <span style={{ color: "#e5e7eb" }}>·</span>
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">{post.readTime}</span>
              </div>
              <div className="flex items-center gap-4 sm:gap-5">
                {/* Back to the blog listing — mirrors the case-study template's
                    "All Case Studies" link (same arrow + styling). */}
                <Link
                  href="/blog"
                  className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-[#6b7280] hover:text-[#0a0f1e] transition-colors flex items-center gap-1.5 no-underline whitespace-nowrap"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View All Blogs
                </Link>
                <PostActions slug={slug} title={post.title} />
              </div>
            </div>
            <div className="w-full max-w-[680px]" style={{ borderTop: "1px solid rgba(229,231,235,0.7)" }} />
          </div>
        </section>

        {/* ── Article content ── */}
        <div className="px-4 sm:px-6 pt-8 pb-0">
          <div className="max-w-[720px] mx-auto">

            {/* Cover image — natural aspect ratio, capped height. CMS-only. */}
            {post.coverImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImg}
                alt={post.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl mb-10"
              />
            )}

            {/* CMS body HTML */}
            <div
              className="blog-body prose prose-lg max-w-none font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151]"
              dangerouslySetInnerHTML={{ __html: normalizeBody(cmsPost.attributes.body) }}
            />

            {/* Closing divider */}
            <div className="blog-divider mt-10">
              <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#d1d5db"/></svg>
            </div>

          </div>
        </div>

        {/* ── Prev / Next ── */}
        <div className="px-4 sm:px-6 pb-20">
          <div className="max-w-[720px] mx-auto">

            {/* dir=ltr keeps Previous on the left / Next on the right in Arabic too,
                matching English (the grid + logical padding/text-end otherwise
                mirror). Arrows stay as authored — no RTL flip needed. */}
            <div dir="ltr" className={`grid py-8 ${prev && next ? "grid-cols-2 divide-x divide-[#e5e7eb]" : "grid-cols-1"}`}>
              {/* Prev */}
              {prev && (
                <div className={next ? "pe-8" : ""}>
                  <Link href={`/blog/${prev.slug}`} className="flex flex-col gap-2 group no-underline">
                    <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Previous Article
                    </span>
                  </Link>
                </div>
              )}

              {/* Next */}
              {next && (
                <div className={`text-end ${prev ? "ps-8" : ""}`}>
                  <Link href={`/blog/${next.slug}`} className="flex flex-col gap-2 items-end group no-underline">
                    <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] flex items-center gap-1.5">
                      Next Article
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Plain bottom line */}
            <div style={{ height: "1px", background: "#e5e7eb" }} />

          </div>
        </div>

      </article>
    </>
  );
}


/* ── Share + Bookmark actions ─────────────────────────────────────────────
   Share: Web Share API on supported devices, clipboard copy as fallback.
   Bookmark: persisted per-slug in localStorage (no account needed).        */
function PostActions({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const KEY = "ehswatch_bookmarks";
  const readMarks = (): string[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  };

  useEffect(() => {
    setBookmarked(readMarks().includes(slug));
  }, [slug]);

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* cancelled → fall through */ }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked — no-op */ }
  };

  const onBookmark = () => {
    const marks = readMarks();
    const next = marks.includes(slug) ? marks.filter((s) => s !== slug) : [...marks, slug];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full/blocked */ }
    setBookmarked(next.includes(slug));
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onShare}
        className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-[#6b7280] hover:text-[#0a0f1e] transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
          <path d="M4 12v-1a4 4 0 0 1 4-4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M14 4l2 3-2 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {copied ? "Link copied" : "Share"}
      </button>
      <button
        onClick={onBookmark}
        aria-pressed={bookmarked}
        className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
        style={{ color: bookmarked ? "#1d4ed8" : "#6b7280" }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill={bookmarked ? "currentColor" : "none"}>
          <path d="M5 3h6a1 1 0 0 1 1 1v10l-4-2.5L4 14V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>
    </div>
  );
}
