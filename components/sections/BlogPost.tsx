"use client";

import Image from "next/image";
import Link from "next/link";
import { basePath } from "@/lib/basePath";
import type { CmsBlogPost } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder post data — swap per slug when real content exists
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

const POSTS: Record<string, BlogPostData> = {
  "near-miss-reporting-culture": {
    slug: "near-miss-reporting-culture",
    category: "Incident Management",
    title: "How to Build a Near-Miss Reporting Culture That Actually Works",
    date: "8 May 2026",
    readTime: "6 min read",
    author: "EHSWatch Team",
    authorRole: "EHS Editorial",
    coverImg: `${basePath}/images/blogs/blog-1.png`,
    secondaryImg: `${basePath}/images/blogs/blog-2.png`,
    tertiaryImg: `${basePath}/images/blogs/blog-3.png`,
  },
  "iso-45001-transition": {
    slug: "iso-45001-transition",
    category: "Compliance",
    title: "ISO 45001 vs OHSAS 18001: What the Transition Really Means for Your Team",
    date: "29 April 2026",
    readTime: "8 min read",
    author: "EHSWatch Team",
    authorRole: "EHS Editorial",
    coverImg: `${basePath}/images/blogs/blog-2.png`,
    secondaryImg: `${basePath}/images/blogs/blog-1.png`,
    tertiaryImg: `${basePath}/images/blogs/blog-3.png`,
  },
  "leading-indicators-safety": {
    slug: "leading-indicators-safety",
    category: "Risk & Analytics",
    title: "5 Leading Indicators Every Safety Manager Should Be Tracking",
    date: "14 April 2026",
    readTime: "5 min read",
    author: "EHSWatch Team",
    authorRole: "EHS Editorial",
    coverImg: `${basePath}/images/blogs/blog-3.png`,
    secondaryImg: `${basePath}/images/blogs/blog-1.png`,
    tertiaryImg: `${basePath}/images/blogs/blog-2.png`,
  },
  "cost-manual-incident-reporting": {
    slug: "cost-manual-incident-reporting",
    category: "Operations",
    title: "The Hidden Cost of Manual Incident Reporting",
    date: "2 April 2026",
    readTime: "5 min read",
    author: "EHSWatch Team",
    authorRole: "EHS Editorial",
    coverImg: `${basePath}/images/blogs/blog-1.png`,
    secondaryImg: `${basePath}/images/blogs/blog-3.png`,
    tertiaryImg: `${basePath}/images/blogs/blog-2.png`,
  },
  "contractor-safety-management": {
    slug: "contractor-safety-management",
    category: "Operations",
    title: "Contractor Safety Management: Why Most Programmes Fail at the Gate",
    date: "20 March 2026",
    readTime: "7 min read",
    author: "EHSWatch Team",
    authorRole: "EHS Editorial",
    coverImg: `${basePath}/images/blogs/blog-2.png`,
    secondaryImg: `${basePath}/images/blogs/blog-3.png`,
    tertiaryImg: `${basePath}/images/blogs/blog-1.png`,
  },
  "lagging-to-leading-metrics": {
    slug: "lagging-to-leading-metrics",
    category: "Risk & Analytics",
    title: "Moving from Lagging to Leading Safety Metrics: A Practical Guide",
    date: "5 March 2026",
    readTime: "9 min read",
    author: "EHSWatch Team",
    authorRole: "EHS Editorial",
    coverImg: `${basePath}/images/blogs/blog-3.png`,
    secondaryImg: `${basePath}/images/blogs/blog-2.png`,
    tertiaryImg: `${basePath}/images/blogs/blog-1.png`,
  },
};

const SLUGS = Object.keys(POSTS);

function getPost(slug: string): BlogPostData {
  return POSTS[slug] ?? POSTS["near-miss-reporting-culture"];
}

function getPrevNext(slug: string, cmsSlugs?: string[]) {
  const list = cmsSlugs && cmsSlugs.length > 0 ? cmsSlugs : SLUGS;
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
  const post: BlogPostData = cmsPost
    ? {
        slug,
        category: cmsPost.attributes.category ?? "General",
        title: cmsPost.attributes.title,
        date: new Date(cmsPost.attributes.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
        readTime: `${cmsPost.attributes.read_time_minutes} min read`,
        author: cmsPost.attributes.author?.name ?? "EHSWatch Team",
        authorRole: "EHS Editorial",
        coverImg: cmsPost.attributes.cover?.url ?? `${basePath}/images/blogs/blog-1.png`,
      }
    : getPost(slug);
  const { prev, next } = getPrevNext(slug, cmsSlugs);

  return (
    <>
      <style>{`
        .blog-body p + p { margin-top: 1.6rem; }
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
                    animationDelay: `${(i * 0.3) % 12}s`,
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
            {/* Category pill */}
            <span
              className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "#1d4ed8" }}
            >
              {post.category}
            </span>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] tracking-[-0.025em] text-[#0a0f1e]">
              {post.title}
            </h1>

            {/* Date + Share/Bookmark — between two separator lines */}
            <div className="w-full max-w-[680px]" style={{ borderTop: "1px solid rgba(229,231,235,0.7)" }} />
            <div className="flex items-center justify-between w-full max-w-[680px] py-3">
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">{post.date}</span>
                <span style={{ color: "#e5e7eb" }}>·</span>
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">{post.readTime}</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-[#6b7280] hover:text-[#0a0f1e] transition-colors flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12v-1a4 4 0 0 1 4-4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M14 4l2 3-2 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share
                </button>
                <button className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-[#6b7280] hover:text-[#0a0f1e] transition-colors flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M5 3h6a1 1 0 0 1 1 1v10l-4-2.5L4 14V4a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  </svg>
                  Bookmark
                </button>
              </div>
            </div>
            <div className="w-full max-w-[680px]" style={{ borderTop: "1px solid rgba(229,231,235,0.7)" }} />
          </div>
        </section>

        {/* ── Article content ── */}
        <div className="px-4 sm:px-6 pt-8 pb-0">
          <div className="max-w-[720px] mx-auto">

            {cmsPost ? (
              <>
                {/* Cover image */}
                <div className="relative w-full rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: "16/9" }}>
                  <Image src={post.coverImg} alt={post.title} fill className="object-cover" />
                </div>

                {/* CMS body HTML */}
                <div
                  className="blog-body prose prose-lg max-w-none font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151]"
                  dangerouslySetInnerHTML={{ __html: cmsPost.attributes.body }}
                />
              </>
            ) : (
              <>
                {/* Lead paragraph */}
                <div className="blog-body">
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty">
                    Every safety professional knows the feeling: a near-miss occurs on site, the supervisor makes a mental note, and by the end of the shift it is forgotten. No record, no investigation, no corrective action. The incident that could have prevented a serious injury simply disappears into the operational noise.
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty mt-6">
                    This is not a problem of awareness. Most EHS teams understand why near-miss reporting matters — it is the backbone of proactive safety management and a direct indicator of cultural health. The challenge is consistently capturing those events in a way that leads to meaningful follow-through.
                  </p>
                </div>

                {/* Cover image */}
                <div className="relative w-full rounded-2xl overflow-hidden my-10" style={{ aspectRatio: "16/9" }}>
                  <Image src={post.coverImg} alt={post.title} fill className="object-cover" />
                </div>

                {/* Body */}
                <div className="blog-body">
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty">
                    The root cause of poor near-miss reporting is almost never a lack of willingness. Field workers notice hazards. They experience close calls. The barrier is friction: the process of reporting feels bureaucratic, there is no visible outcome from previous reports, and there is a persistent — sometimes justified — concern about blame.
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty mt-6">
                    Organisations that successfully build reporting cultures do so by reducing that friction at every touchpoint. They make it simple to report, visible that reports are acted upon, and safe to raise concerns without fear of disciplinary consequence. The technology and the culture must move together.
                  </p>
                </div>

                {/* Pull quote */}
                <blockquote className="my-12 text-center">
                  <p
                    className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[22px] sm:text-[26px] md:text-[28px] leading-[1.4] tracking-[-0.01em] text-[#0a0f1e]"
                    style={{ fontStyle: "italic" }}
                  >
                    &ldquo;The organisations with the lowest incident rates are rarely the ones with the fewest hazards — they are the ones that see and act on them fastest.&rdquo;
                  </p>
                  <footer className="mt-4 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">
                    — EHSWatch Research, 2025
                  </footer>
                </blockquote>

                {/* More body */}
                <div className="blog-body">
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty">
                    The practical starting point is removing the paper form. Mobile reporting tools that allow a worker to log a near-miss in under sixty seconds — with a photo, a location and a brief description — consistently outperform paper-based systems in volume and quality of reports.
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty mt-6">
                    But technology alone is insufficient. The second step is closing the loop visibly. When a near-miss is reported, the reporter must see what happened as a result — whether an action was raised, what the finding was, and whether the hazard has been resolved. This feedback loop is the single most powerful driver of sustained reporting behaviour.
                  </p>
                </div>

                {/* Dual image grid */}
                <div className="grid grid-cols-2 gap-4 my-10">
                  <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <Image src={post.secondaryImg ?? post.coverImg} alt="Supporting visual" fill className="object-cover" />
                  </div>
                  <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <Image src={post.tertiaryImg ?? post.coverImg} alt="Supporting visual" fill className="object-cover" />
                  </div>
                </div>

                {/* Closing body */}
                <div className="blog-body">
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty">
                    Leadership behaviour is the third pillar. When senior managers actively reference near-miss reports in safety meetings, thank reporters by name, and share the outcomes of investigations, reporting rates reliably increase. Psychological safety is built through demonstrated action, not policy statements.
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty mt-6">
                    Platforms like EHSWatch embed all three elements — simple mobile capture, automatic assignment of corrective actions, and real-time dashboards that show reporting trends to both workers and leadership. The result is a system where reporting is the path of least resistance, not the path of most friction.
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty mt-6">
                    Building a near-miss culture is not a six-month project with a launch date. It is an ongoing commitment to making it easier and safer to speak up than to stay silent. Organisations that sustain it over time consistently outperform their peers on every incident metric that matters.
                  </p>
                </div>
              </>
            )}

            {/* Closing divider */}
            <div className="blog-divider mt-10">
              <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#d1d5db"/></svg>
            </div>

          </div>
        </div>

        {/* ── Prev / Next ── */}
        <div className="px-4 sm:px-6 pb-20">
          <div className="max-w-[720px] mx-auto">

            <div className={`grid py-8 ${prev && next ? "grid-cols-2 divide-x divide-[#e5e7eb]" : "grid-cols-1"}`}>
              {/* Prev */}
              {prev && (
                <div className={next ? "pr-8" : ""}>
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
                <div className={`text-right ${prev ? "pl-8" : ""}`}>
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

export { POSTS as BLOG_POSTS };
