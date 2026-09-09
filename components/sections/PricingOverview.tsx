"use client";

import CmsIcon from "@/components/ui/CmsIcon";

// Any CMS icon pick renders inside the blue circle via the shared resolver
function ItemIcon({ name }: { name?: string }) {
  return <CmsIcon icon={name} size={11} strokeWidth={2.2} color="white" fallback="check" />;
}

interface PricingOverviewProps {
  cmsEyebrow?: string;
  heading?: string;
  body?: string;
  checklistHeading?: string;
  checklistItems?: Array<{ icon?: string; text: string }>;
}

export default function PricingOverview({
  cmsEyebrow,
  heading,
  body,
  checklistHeading,
  checklistItems,
}: PricingOverviewProps = {}) {
  // CMS-only: no hardcoded fallback content.
  const displayHeading = heading?.trim() || "";
  const checklistNeedsArr: Array<{ icon?: string; text: string }> =
    checklistItems && checklistItems.length > 0 ? checklistItems : [];
  const checklistLabel = checklistHeading?.trim() || "";

  // Parse body HTML paragraphs from the CMS only (no default copy).
  let bodyParagraphs: string[] = [];
  if (body) {
    // Extract content of <p> tags; if none found, use the raw string
    const matches = body.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
    if (matches && matches.length > 0) {
      bodyParagraphs = matches.map((m) => m.replace(/<\/?p[^>]*>/g, "").trim());
    } else {
      bodyParagraphs = [body];
    }
  }

  // Hide the whole section when the CMS provides nothing.
  const hasLeft = !!displayHeading || bodyParagraphs.length > 0;
  const hasRight = !!checklistLabel || checklistNeedsArr.length > 0;
  if (!hasLeft && !hasRight) return null;

  return (
    <>
      <style>{`
        @keyframes needsFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .needs-item {
          opacity: 0;
          animation: needsFadeUp 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

      <section className="py-[70px] md:py-[90px] px-4 md:px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: description */}
            {hasLeft && (
            <div className="flex flex-col gap-6">
              {cmsEyebrow && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-[0.12em] text-[#1d4ed8]">
                  {cmsEyebrow}
                </p>
              )}
              {displayHeading && (
              <div>
                <h2
                  className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.025em] text-[#0a0f1e]"
                  dangerouslySetInnerHTML={{ __html: displayHeading }}
                />
              </div>
              )}
              {bodyParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.8] text-[#4b5563] text-pretty"
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </div>
            )}

            {/* Right: custom pricing card */}
            {hasRight && (
            <div className="flex flex-col gap-6 pt-2 items-center text-center">
              {checklistLabel && (
              <div>
                <h3
                  className="font-[family-name:var(--font-gothic-a1)] font-bold text-[20px] md:text-[22px] leading-snug text-[#0a0f1e] text-balance"
                  dangerouslySetInnerHTML={{ __html: checklistLabel }}
                />
              </div>
              )}

              {/* Step-progress bullet list */}
              <div className="flex flex-col max-w-[400px] w-full text-left">
                {checklistNeedsArr.map((item, i) => (
                  <div key={i}>
                    <div
                      // Client-caught (Arabic, wrapped text): rounded-full's
                      // radius is half the box's own height -- fine for a
                      // one-line pill, but a translation (or any text) long
                      // enough to wrap to 2 lines makes the box much taller,
                      // so the radius grows just as much and the resulting
                      // stadium curve visibly eats into the space near the
                      // icon. A fixed radius stays consistent regardless of
                      // how many lines the text wraps to.
                      className="needs-item flex items-center gap-3 px-4 py-3 rounded-2xl"
                      style={{
                        animationDelay: `${i * 180}ms`,
                        border: "1.5px solid #dbeafe",
                        background: "#f0f7ff",
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "#1d4ed8" }}
                      >
                        <ItemIcon name={item.icon} />
                      </div>
                      {/* Client-caught (still visible after the rounded-2xl
                          fix): the span sized to its own content -- with
                          text-wrap:pretty choosing a conservative, balanced
                          wrap, its rendered width (confirmed via DevTools:
                          254px) can end up narrower than the space actually
                          available in the pill, leaving a gap before the
                          icon that isn't part of the border-radius bug at
                          all. flex-1 makes it always claim the full
                          remaining width regardless of how its own text
                          wraps, so the icon stays visually anchored. */}
                      <span className="flex-1 min-w-0 font-[family-name:var(--font-dm-sans)] text-[13px] sm:text-[14px] leading-[1.6] text-[#374151] text-pretty">
                        {item.text}
                      </span>
                    </div>

                    {i < checklistNeedsArr.length - 1 && (
                      <div
                        className="ml-[27px] w-[2px] h-[10px]"
                        style={{ background: "#bfdbfe" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
