/**
 * A single rich_text block — rendered at its own position in content[]
 * (see LegalPage's own comment on why order matters), not merged with
 * every other rich_text block on the page into one combined string. A
 * page with rich_text → hero → rich_text now genuinely renders three
 * sections in that order, each independently.
 *
 * heading/subheading (the block's "Title"/"Subheading" fields) were
 * previously typed and read nowhere in the FE -- an admin filling them
 * in had no effect on the live page at all. heading is CMS-only-
 * processed (headingHtmlOpt at the call site), so a <span> highlight
 * colours the same way as every other section heading.
 */
export default function LegalPageRichText({
  heading,
  subheading,
  body,
}: {
  heading?: string;
  subheading?: string;
  body: string;
}) {
  const hasHeading = !!heading?.trim() || !!subheading?.trim();
  if (!hasHeading && !body.trim()) return null;

  return (
    <section className="py-12 md:py-16 bg-white">
      {hasHeading && (
        <div className="max-w-[820px] mx-auto px-6 mb-6">
          {heading?.trim() && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[30px] leading-tight tracking-[-0.02em] text-[#111827]">
              {heading.includes("<span") ? (
                <span dangerouslySetInnerHTML={{ __html: heading }} />
              ) : (
                heading
              )}
            </h2>
          )}
          {subheading?.trim() && (
            <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[16px] leading-relaxed text-[#5b6472]">
              {subheading}
            </p>
          )}
        </div>
      )}
      {body.trim() && (
        <div
          className="legal-body max-w-[820px] mx-auto px-6 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.8] text-[#374151]"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </section>
  );
}
