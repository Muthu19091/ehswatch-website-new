export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCaseStudy, getCaseStudies } from "@/lib/api";

/* ─── Static params ──────────────────────────────────────────────────────────── */

const STATIC_SLUGS = [
  "volkar-group-permit-to-work",
  "lt-construction-incident-trend-reversal",
  "mahindra-logistics-action-closure",
];

export async function generateStaticParams() {
  const res = await getCaseStudies();
  const cmsSlugs = res?.data.map((cs) => cs.attributes.slug) ?? [];
  const all = Array.from(new Set([...STATIC_SLUGS, ...cmsSlugs]));
  return all.map((slug) => ({ slug }));
}

/* ─── Metadata ───────────────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getCaseStudy(slug);
  const cs = res?.data;
  const meta = cs?.attributes?.meta;
  return {
    title:
      meta?.meta_title ||
      (cs ? `${cs.attributes.title} | EHSWatch` : `Case Study | EHSWatch`),
    description:
      meta?.meta_description ||
      cs?.attributes?.summary ||
      `EHSWatch case study — ${slug.replace(/-/g, " ")}.`,
    robots: meta?.robots || "index, follow",
  };
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ─── Result card ────────────────────────────────────────────────────────────── */

interface ResultItem {
  label?: string;
  value?: string;
  metric?: string;
  before?: string;
  after?: string;
}

function ResultCard({ item }: { item: ResultItem }) {
  // Handle both {label, value} and {metric, before, after} shapes
  if ("value" in item && item.value) {
    return (
      <div
        className="flex flex-col items-center text-center p-6 rounded-2xl"
        style={{ background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.12)" }}
      >
        <span
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] leading-none mb-2"
          style={{ color: "#1d4ed8" }}
        >
          {item.value}
        </span>
        <span
          className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-[1.5]"
          style={{ color: "#374151" }}
        >
          {item.label || ""}
        </span>
      </div>
    );
  }
  // Fallback for {metric, before, after}
  return (
    <div
      className="flex flex-col p-6 rounded-2xl gap-1"
      style={{ background: "rgba(29,78,216,0.06)", border: "1px solid rgba(29,78,216,0.12)" }}
    >
      <span
        className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: "#6B7280" }}
      >
        {item.metric || ""}
      </span>
      <div className="flex items-center gap-3">
        {item.before && (
          <>
            <span
              className="font-[family-name:var(--font-gothic-a1)] font-bold text-[22px]"
              style={{ color: "#9CA3AF", textDecoration: "line-through" }}
            >
              {item.before}
            </span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9h12M11 5l4 4-4 4" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
        {item.after && (
          <span
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px]"
            style={{ color: "#1d4ed8" }}
          >
            {item.after}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Not found ──────────────────────────────────────────────────────────────── */

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center gap-6">
      <h1
        className="font-[family-name:var(--font-gothic-a1)] font-bold text-[32px]"
        style={{ color: "#0a1628" }}
      >
        Case Study Not Found
      </h1>
      <p className="font-[family-name:var(--font-dm-sans)] text-[16px]" style={{ color: "#6B7280" }}>
        This case study may have been moved or removed.
      </p>
      <Link
        href="/case-studies"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white"
        style={{
          backgroundImage:
            "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
        }}
      >
        Back to Case Studies
      </Link>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getCaseStudy(slug);
  const cs = res?.data;

  return (
    <>
      <Navbar lightHero />
      <main>
        {!cs ? (
          <NotFound />
        ) : (
          <>
            {/* ── Hero banner ── */}
            <section
              className="relative overflow-hidden flex items-end px-6 pt-[140px] pb-[60px]"
              style={{
                background: "linear-gradient(160deg, #0a1628 0%, #0f2044 55%, #1d3461 100%)",
                minHeight: 360,
              }}
            >
              {/* Subtle dot grid */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              {/* Bottom fade */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(10,22,40,0.85))" }}
              />

              <div className="relative z-10 max-w-[820px] w-full mx-auto flex flex-col gap-5">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  <span>/</span>
                  <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
                  <span>/</span>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{cs.attributes.client_name}</span>
                </nav>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {cs.attributes.industry && (
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold font-[family-name:var(--font-dm-sans)]"
                      style={{
                        background: "rgba(29,78,216,0.25)",
                        border: "1px solid rgba(29,78,216,0.4)",
                        color: "#93c5fd",
                      }}
                    >
                      {cs.attributes.industry}
                    </span>
                  )}
                  {cs.attributes.client_name && (
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold font-[family-name:var(--font-dm-sans)]"
                      style={{
                        background: "rgba(255,109,0,0.18)",
                        border: "1px solid rgba(255,109,0,0.35)",
                        color: "#fdba74",
                      }}
                    >
                      {cs.attributes.client_name}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1
                  className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[44px] leading-[1.1] tracking-[-0.02em]"
                  style={{ color: "#ffffff" }}
                >
                  {cs.attributes.title}
                </h1>

                {/* Summary */}
                {cs.attributes.summary && (
                  <p
                    className="font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.75] max-w-[700px]"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {cs.attributes.summary}
                  </p>
                )}

                {/* Date */}
                {cs.attributes.published_at && (
                  <p
                    className="font-[family-name:var(--font-dm-sans)] text-[13px]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Published {formatDate(cs.attributes.published_at)}
                  </p>
                )}
              </div>
            </section>

            {/* ── Cover image ── */}
            {cs.attributes.cover?.url && (
              <div className="w-full max-w-[900px] mx-auto px-6 -mt-8 relative z-20 mb-[-16px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cs.attributes.cover.url}
                  alt={cs.attributes.cover.alt || cs.attributes.title}
                  className="w-full rounded-2xl object-cover"
                  style={{
                    maxHeight: 420,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
                  }}
                />
              </div>
            )}

            {/* ── Results strip ── */}
            {cs.attributes.results && cs.attributes.results.length > 0 && (
              <section className="py-12 px-6" style={{ background: "#f8faff" }}>
                <div className="max-w-[900px] mx-auto">
                  <h2
                    className="font-[family-name:var(--font-gothic-a1)] font-bold text-[18px] mb-6 text-center"
                    style={{ color: "#0a1628" }}
                  >
                    Key Results
                  </h2>
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(cs.attributes.results.length, 3)}, minmax(0, 1fr))`,
                    }}
                  >
                    {(cs.attributes.results as ResultItem[]).map((item, i) => (
                      <ResultCard key={i} item={item} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Body ── */}
            <section className="py-14 px-6" style={{ background: "#ffffff" }}>
              <div className="max-w-[740px] mx-auto">
                {cs.attributes.body ? (
                  <div
                    className="prose-case-study"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "16px",
                      lineHeight: "1.8",
                      color: "#374151",
                    }}
                    dangerouslySetInnerHTML={{ __html: cs.attributes.body }}
                  />
                ) : (
                  <p
                    className="font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.8]"
                    style={{ color: "#6B7280" }}
                  >
                    Full case study details coming soon.
                  </p>
                )}

                {/* Scoped prose styles */}
                <style>{`
                  .prose-case-study h2,
                  .prose-case-study h3 {
                    font-family: var(--font-gothic-a1), sans-serif;
                    font-weight: 700;
                    color: #0a1628;
                    margin-top: 2rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.25;
                  }
                  .prose-case-study h2 { font-size: 24px; }
                  .prose-case-study h3 { font-size: 19px; }
                  .prose-case-study p { margin-bottom: 1.25rem; }
                  .prose-case-study strong { color: #111827; font-weight: 600; }
                  .prose-case-study ul,
                  .prose-case-study ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
                  .prose-case-study li { margin-bottom: 0.5rem; }
                  .prose-case-study a { color: #1d4ed8; text-decoration: underline; }
                  .prose-case-study blockquote {
                    border-left: 3px solid #1d4ed8;
                    padding-left: 1.25rem;
                    margin: 1.5rem 0;
                    color: #4B5563;
                    font-style: italic;
                  }
                `}</style>
              </div>
            </section>

            {/* ── CTA strip ── */}
            <section
              className="py-14 px-6"
              style={{
                background: "linear-gradient(135deg, #0a1628 0%, #1d3461 100%)",
              }}
            >
              <div className="max-w-[720px] mx-auto text-center flex flex-col items-center gap-6">
                <h2
                  className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] leading-[1.2]"
                  style={{ color: "#ffffff" }}
                >
                  Ready to see similar results at your sites?
                </h2>
                <p
                  className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.7]"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Talk to our team to find out how EHSWatch maps to your workflows.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white hover:opacity-90 transition-opacity"
                    style={{
                      backgroundImage:
                        "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                    }}
                  >
                    Book a Demo
                  </Link>
                  <Link
                    href="/case-studies"
                    className="inline-flex items-center justify-center gap-2 px-7 py-[11px] rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M11.5 7h-9M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    All Case Studies
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
