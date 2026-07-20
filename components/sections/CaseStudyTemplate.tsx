"use client";

import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "@/lib/blocks";
import GlareButton from "@/components/ui/GlareButton";
import type { CmsCaseStudy } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Case-study inner-page template.
//
// Every visible field is driven by the CMS case-study record (title, client,
// industry, summary, body HTML, results, cover, meta). There are no hardcoded
// fallbacks — empty fields simply don't render. Edit the study in the CMS and
// it flows straight through here.
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = "#059669";

function getPrevNext(slug: string, allSlugs?: string[]) {
  const list = allSlugs && allSlugs.length > 0 ? allSlugs : [];
  const idx = list.indexOf(slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx < list.length - 1 ? list[idx + 1] : null,
    next: idx > 0 ? list[idx - 1] : null,
  };
}

export default function CaseStudyTemplate({
  slug,
  cmsStudy,
  allSlugs,
}: {
  slug: string;
  cmsStudy?: CmsCaseStudy;
  allSlugs?: string[];
}) {
  // CMS-only: the detail route 404s when the study is missing, so there is
  // always a real record here — no DUMMY placeholder content.
  if (!cmsStudy) return null;
  const attrs = cmsStudy.attributes;

  const title = attrs.title || "";
  const clientName = attrs.client_name || "";
  const industry = attrs.industry || "";
  const summary = attrs.summary || "";
  const bodyHtml = attrs.body?.trim() ? attrs.body : "";
  const results = attrs.results?.length ? attrs.results : [];
  // Only use a real uploaded cover — no generic blog-image fallback (it read as
  // a random stock photo on every study). When absent, the cover band is hidden
  // and the green "at a glance" card becomes the lead visual.
  const coverUrl = mediaUrl(attrs.cover);

  const publishDate = new Date(attrs.published_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { prev, next } = getPrevNext(slug, allSlugs);

  // Headline metric for the hero quick-facts strip (first result)
  const heroMetric = results[0];

  return (
    <>
      <style>{`
        .cs-body h2 { font-family: var(--font-gothic-a1), sans-serif; font-weight: 700; font-size: 1.5rem; color: #0a0f1e; margin: 2.4rem 0 0.9rem; letter-spacing: -0.02em; }
        .cs-body h3 { font-family: var(--font-gothic-a1), sans-serif; font-weight: 700; font-size: 1.2rem; color: #0a0f1e; margin: 2rem 0 0.7rem; letter-spacing: -0.01em; }
        .cs-body h4 { font-family: var(--font-gothic-a1), sans-serif; font-weight: 700; font-size: 1.05rem; color: #0a0f1e; margin: 1.7rem 0 0.6rem; }
        .cs-body p { margin-top: 1.1rem; }
        .cs-body p:first-child { margin-top: 0; }
        .cs-body ul { margin: 1.1rem 0; padding-left: 1.2rem; list-style: disc; }
        .cs-body li { margin-top: 0.5rem; }
        .cs-body a { color: ${ACCENT}; text-decoration: underline; }
        .cs-grid {
          background-image:
            linear-gradient(rgba(5,150,105,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(5,150,105,0.06) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .cs-box { position: absolute; width: 48px; height: 48px; }
        @keyframes csBoxFill { 0%,100% { opacity: 0; } 50% { opacity: 0.45; } }
      `}</style>

      <article className="bg-white min-h-screen">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden flex flex-col items-center justify-end px-6 pt-[148px] pb-[52px]">
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
              style={{ height: "65%", background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 45%, #FFFFFF 100%)" }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 75% 75% at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 50%, transparent 100%)" }}
            />
          </div>

          <div className="relative z-20 max-w-[760px] w-full mx-auto text-center flex flex-col items-center gap-4">
            {industry && (
              <span
                className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{ color: ACCENT }}
              >
                {industry}
              </span>
            )}

            {title && (
              <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[30px] sm:text-[38px] md:text-[46px] leading-[1.1] tracking-[-0.025em] text-[#0a0f1e] text-balance">
                {title}
              </h1>
            )}

            <div className="w-full max-w-[680px]" style={{ borderTop: "1px solid rgba(229,231,235,0.7)" }} />
            <div className="flex items-center justify-between w-full max-w-[680px] py-3">
              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">{clientName}</span>
                <span style={{ color: "#e5e7eb" }}>·</span>
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#9ca3af]">{publishDate}</span>
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
          <div className="max-w-[820px] mx-auto">

            {/* Cover — only when a real image is uploaded */}
            {coverUrl && (
              <div className="relative w-full rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: "16/9" }}>
                <Image src={coverUrl} alt={title} fill className="object-cover" />
              </div>
            )}

            {/* At a glance — summary + quick facts */}
            {(summary || heroMetric) && (
            <div
              className="rounded-2xl px-6 py-6 mb-12 flex flex-col md:flex-row gap-6 md:items-center"
              style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)", border: "1px solid #D1FAE5" }}
            >
              {summary && (
                <p className="flex-1 font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.75] text-[#065f46] font-medium">
                  {summary}
                </p>
              )}
              {heroMetric && (
                <div className="shrink-0 md:border-l md:border-[#A7F3D0] md:pl-6 text-center md:text-left">
                  <div
                    className="font-[family-name:var(--font-gothic-a1)] font-bold text-[40px] leading-none tracking-[-0.03em]"
                    style={{ color: ACCENT, fontVariantNumeric: "tabular-nums" }}
                  >
                    {heroMetric.value ?? heroMetric.after ?? "—"}
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-dm-sans)] text-[12px] text-[#047857] max-w-[150px]">
                    {heroMetric.label ?? heroMetric.metric ?? ""}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Story */}
            {bodyHtml && (
              <div
                className="cs-body font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[17px] leading-[1.85] text-[#374151]"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="my-14 rounded-2xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                <div className="px-6 py-4" style={{ background: "#0a0f1e" }}>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6ee7b7]">
                    Results
                  </p>
                </div>
                <div className={`grid divide-x divide-[#e5e7eb] ${results.length >= 4 ? "grid-cols-2 sm:grid-cols-4" : `grid-cols-2 sm:grid-cols-${Math.min(results.length, 4)}`}`}>
                  {results.map((r, i) => {
                    const heading = r.value ?? r.after ?? "—";
                    const label = r.label ?? r.metric ?? "";
                    return (
                      <div key={i} className="px-6 py-7 flex flex-col gap-1">
                        <span
                          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] sm:text-[38px] leading-none tracking-[-0.03em] text-[#0a0f1e]"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {heading}
                        </span>
                        {label && (
                          <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#6b7280] leading-[1.4]">{label}</span>
                        )}
                        {r.before && (
                          <span className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#9ca3af]">was {r.before}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pull quote — echoes the summary as a client voice */}
            <blockquote
              className="my-14 rounded-2xl px-8 py-10 text-center"
              style={{ background: "#F0FDF4", border: "1px solid #D1FAE5" }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill={ACCENT} className="mx-auto mb-4 opacity-30">
                <path d="M9.5 4C6.5 5.5 4.5 8.5 4.5 12v6h6v-6h-3c0-2 1-3.5 3-4.5L9.5 4zm9 0c-3 1.5-5 4.5-5 8v6h6v-6h-3c0-2 1-3.5 3-4.5L18.5 4z"/>
              </svg>
              <p className="font-[family-name:var(--font-gothic-a1)] font-semibold text-[19px] sm:text-[22px] leading-[1.5] text-[#0a0f1e] max-w-[620px] mx-auto text-balance">
                {summary}
              </p>
              <p className="mt-5 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: ACCENT }}>
                {clientName} · {industry}
              </p>
            </blockquote>

            {/* CTA */}
            <div
              className="my-14 rounded-2xl px-8 py-12 text-center flex flex-col items-center gap-5"
              style={{ background: "#0a0f1e" }}
            >
              <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] leading-tight text-white text-balance max-w-[520px]">
                See what EHSWatch can do for your team
              </h2>
              <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#9ca3af] max-w-[460px] leading-[1.7]">
                Book a walkthrough and we&apos;ll map EHSWatch to your industry&apos;s workflows and compliance needs.
              </p>
              <GlareButton
                href="/contact-us"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-[family-name:var(--font-dm-sans)] font-semibold text-[15px] text-white"
                style={{ backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)" }}
              >
                Book a Demo
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </GlareButton>
            </div>

          </div>
        </div>

        {/* ── Prev / Next ── */}
        {(prev || next) && (
          <div className="px-4 sm:px-6 pb-20">
            <div className="max-w-[820px] mx-auto">
              <div className={`grid py-8 ${prev && next ? "grid-cols-2 divide-x divide-[#e5e7eb]" : "grid-cols-1"}`}>
                {prev && (
                  <div className={next ? "pr-8" : ""}>
                    <Link href={`/case-studies/${prev}`} className="flex flex-col gap-2 no-underline group">
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
                    <Link href={`/case-studies/${next}`} className="flex flex-col gap-2 items-end no-underline group">
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
