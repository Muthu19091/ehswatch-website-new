"use client";

import Image from "next/image";
import { mediaUrl } from "@/lib/blocks";
import Link from "next/link";
import { basePath } from "@/lib/basePath";
import type { CmsCaseStudy } from "@/lib/types";

// ─── Placeholder data ─────────────────────────────────────────────────────────

const FALLBACK: CmsCaseStudy["attributes"] = {
  title: "How Petrochem Gulf Cut Incident Reporting Time by 68%",
  slug: "petrochem-gulf",
  client_name: "Petrochem Gulf",
  industry: "Oil & Gas",
  summary:
    "Petrochem Gulf's safety team was drowning in spreadsheets. With EHSWatch they consolidated seven separate tracking tools into one unified platform, slashing reporting time from three hours to under an hour per shift.",
  body: "",
  results: [
    { label: "Reporting Time Reduced", value: "68%" },
    { label: "Near-Miss Reports / Month", value: "3×" },
    { label: "Audit Findings Closed On Time", value: "94%" },
    { label: "Compliance Score", value: "99.2%" },
  ],
  status: "published",
  published_at: "2026-01-01T00:00:00.000Z",
  cover: null,
  meta: { meta_title: "", meta_description: "", meta_keywords: null, canonical_url: null, og_image: null, robots: "index,follow" },
  structured_data: [],
  updated_at: "2026-01-01T00:00:00.000Z",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPrevNext(slug: string, allSlugs?: string[]) {
  const list = allSlugs && allSlugs.length > 0 ? allSlugs : [];
  const idx = list.indexOf(slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < list.length - 1 ? list[idx + 1] : null,
    next: idx > 0 ? list[idx - 1] : null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CaseStudyDetail({
  slug,
  cmsStudy,
  allSlugs,
}: {
  slug: string;
  cmsStudy?: CmsCaseStudy;
  allSlugs?: string[];
}) {
  const attrs = cmsStudy?.attributes ?? FALLBACK;
  const coverUrl = mediaUrl(attrs.cover) ?? `${basePath}/images/blogs/blog-1.png`;

  const publishDate = new Date(attrs.published_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { prev, next } = getPrevNext(slug, allSlugs);

  const results: CmsCaseStudy["attributes"]["results"] =
    attrs.results?.length > 0 ? attrs.results : FALLBACK.results;

  return (
    <>
      <style>{`
        .cs-body p + p { margin-top: 1.6rem; }
        .cs-grid {
          background-image:
            linear-gradient(rgba(5,150,105,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5,150,105,0.06) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .cs-box { position: absolute; width: 48px; height: 48px; }
        @keyframes csBoxFill {
          0%, 100% { opacity: 0; }
          50%       { opacity: 0.45; }
        }
      `}</style>

      <article className="bg-white min-h-screen">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden flex flex-col items-center justify-end px-6 pt-[148px] pb-[52px]">
          {/* Animated grid */}
          <div className="absolute inset-0 overflow-hidden cs-grid pointer-events-none">
            {Array.from({ length: 200 }, (_, i) => {
              const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
              const colors = ["#ECFDF5", "#D1FAE5", "#A7F3D0", "#6EE7B7"];
              return shouldAnimate ? (
                <div
                  key={i}
                  className="cs-box"
                  style={{
                    left: `${(i % 20) * 50 + 1}px`,
                    top: `${Math.floor(i / 20) * 50 + 1}px`,
                    backgroundColor: colors[i % 4],
                    animation: `csBoxFill ${4 + ((i * 2) % 6)}s ease-in-out infinite`,
                    animationDelay: `${(i * 0.3) % 12}s`,
                  }}
                />
              ) : null;
            })}
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
            {/* Industry pill */}
            <span
              className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "#059669" }}
            >
              {attrs.industry}
            </span>

            {/* Title */}
            <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] tracking-[-0.025em] text-[#0a0f1e]">
              {attrs.title}
            </h1>

            {/* Separator + meta row */}
            <div className="w-full max-w-[680px]" style={{ borderTop: "1px solid rgba(229,231,235,0.7)" }} />
            <div className="flex items-center justify-between w-full max-w-[680px] py-3">
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">
                  {attrs.client_name}
                </span>
                <span style={{ color: "#e5e7eb" }}>·</span>
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">
                  {publishDate}
                </span>
              </div>
              <Link
                href="/case-studies"
                className="font-[family-name:var(--font-dm-sans)] text-[13px] font-medium text-[#6b7280] hover:text-[#0a0f1e] transition-colors flex items-center gap-1.5 no-underline"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                All Case Studies
              </Link>
            </div>
            <div className="w-full max-w-[680px]" style={{ borderTop: "1px solid rgba(229,231,235,0.7)" }} />
          </div>
        </section>

        {/* ── Body ── */}
        <div className="px-4 sm:px-6 pt-8 pb-0">
          <div className="max-w-[720px] mx-auto">

            {/* Cover image */}
            <div className="relative w-full rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: "16/9" }}>
              <Image src={coverUrl} alt={attrs.title} fill className="object-cover" />
            </div>

            {/* Summary callout */}
            <div
              className="rounded-xl px-6 py-5 mb-10"
              style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)", border: "1px solid #D1FAE5" }}
            >
              <p className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.75] text-[#065f46] font-medium">
                {attrs.summary}
              </p>
            </div>

            {/* CMS body HTML */}
            {attrs.body ? (
              <div
                className="cs-body prose prose-lg max-w-none font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151]"
                dangerouslySetInnerHTML={{ __html: attrs.body }}
              />
            ) : (
              <div className="cs-body">
                <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty">
                  Before EHSWatch, the safety team at {attrs.client_name} managed compliance across multiple sites using a combination of spreadsheets, email threads, and a legacy desktop system that hadn&apos;t been updated in four years. Audit preparation alone consumed two full working days every quarter.
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty mt-6">
                  The team identified three root problems: data living in disconnected silos, no real-time visibility into open actions, and a reporting process so cumbersome that field workers were routinely deferring documentation until end-of-shift — by which point key details were lost.
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151] text-pretty mt-6">
                  EHSWatch was deployed across all sites within six weeks. The mobile-first capture flow reduced average report time from eleven minutes to under two. Automatic routing of corrective actions to responsible owners eliminated the follow-up bottleneck. And real-time dashboards gave leadership the live view they needed to make proactive decisions rather than reactive ones.
                </p>
              </div>
            )}

            {/* Results strip */}
            {results.length > 0 && (
              <div
                className="my-12 rounded-2xl overflow-hidden"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <div
                  className="px-6 py-4"
                  style={{ background: "#0a0f1e" }}
                >
                  <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6ee7b7]">
                    Results
                  </p>
                </div>
                <div className={`grid divide-x divide-[#e5e7eb] ${results.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : `grid-cols-${results.length}`}`}>
                  {results.map((r, i) => {
                    const heading = r.value ?? r.after ?? "—";
                    const label = r.label ?? r.metric ?? "";
                    return (
                      <div key={i} className="px-6 py-6 flex flex-col gap-1">
                        <span
                          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] sm:text-[38px] leading-none tracking-[-0.03em] text-[#0a0f1e]"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {heading}
                        </span>
                        {label && (
                          <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.4]">
                            {label}
                          </span>
                        )}
                        {r.before && (
                          <span className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#9ca3af]">
                            was {r.before}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Closing divider */}
            <div className="flex items-center gap-3 mt-10" style={{ color: "#d1d5db" }}>
              <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
              <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#d1d5db"/></svg>
              <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            </div>

          </div>
        </div>

        {/* ── Prev / Next ── */}
        {(prev || next) && (
          <div className="px-4 sm:px-6 pb-20">
            <div className="max-w-[720px] mx-auto">
              <div className={`grid py-8 ${prev && next ? "grid-cols-2 divide-x divide-[#e5e7eb]" : "grid-cols-1"}`}>
                {prev && (
                  <div className={next ? "pr-8" : ""}>
                    <Link href={`/case-studies/${prev}`} className="flex flex-col gap-2 group no-underline">
                      <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Previous Case Study
                      </span>
                    </Link>
                  </div>
                )}
                {next && (
                  <div className={`text-right ${prev ? "pl-8" : ""}`}>
                    <Link href={`/case-studies/${next}`} className="flex flex-col gap-2 items-end group no-underline">
                      <span className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] flex items-center gap-1.5">
                        Next Case Study
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
              <div style={{ height: "1px", background: "#e5e7eb" }} />
            </div>
          </div>
        )}

      </article>
    </>
  );
}
