import Reveal from "@/components/ui/Reveal";

interface ProductOverviewProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsBody?: string;
  cmsImage?: { url?: string; alt?: string };
}

export default function ProductOverview({
  cmsHeading,
  cmsSubheading,
  cmsBody,
  cmsImage,
}: ProductOverviewProps = {}) {
  // CMS-only: no hardcoded fallback copy.
  const heading = cmsHeading?.trim() || "";
  const subheading = cmsSubheading?.trim() || "";

  // Strip HTML tags from heading for the span split approach
  const plainHeading = heading.replace(/<[^>]+>/g, "");
  // Find last word sequence that was wrapped in span (after first word chunk)
  const spanMatch = heading.match(/<span>([\s\S]*?)<\/span>/);
  const spanText = spanMatch ? spanMatch[1] : null;
  const headingBefore = spanText
    ? plainHeading.slice(0, plainHeading.indexOf(spanText)).trim()
    : plainHeading;
  // Text AFTER the </span> was dropped before — render it so a full CMS heading
  // edit (incl. trailing words) reflects.
  const headingAfter = spanText
    ? plainHeading.slice(plainHeading.indexOf(spanText) + spanText.length).trim()
    : "";

  const hasLeft = !!plainHeading || !!subheading || !!cmsImage?.url;
  const hasBody = !!cmsBody?.trim();
  // Hide the whole section when the CMS provides nothing.
  if (!hasLeft && !hasBody) return null;

  return (
    <section className="bg-white py-[60px] md:py-[100px] lg:py-[120px]">
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-[1fr_1.25fr] gap-8 md:gap-[96px] items-start">
        {/* Left sticky label */}
        {hasLeft && (
        <div className="md:sticky md:top-[120px]">
          {plainHeading && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[32px] md:text-[40px] leading-[1.12] text-[#1b1b1b] tracking-[-0.03em]">
              {spanText ? (
                <>
                  {headingBefore}{" "}
                  <span className="text-[#155eef]">{spanText}</span>
                  {headingAfter ? <> {headingAfter}</> : null}
                </>
              ) : (
                plainHeading
              )}
            </h2>
          )}
          {subheading && (
            <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#9ca3af] leading-relaxed">
              {subheading}
            </p>
          )}
          {cmsImage?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cmsImage.url}
              alt={cmsImage.alt ?? ""}
              className="mt-8 w-full rounded-xl object-cover"
            />
          )}
        </div>
        )}
        {/* Right body */}
        {hasBody && (
        <div className="flex flex-col gap-7">
          <Reveal variant="fade-up" duration={700}>
            <div
              className="font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-[1.78] tracking-[-0.011em] prose prose-sm max-w-none [&_strong]:font-semibold [&_strong]:text-[#1b1b1b]"
              dangerouslySetInnerHTML={{ __html: cmsBody! }}
            />
          </Reveal>
        </div>
        )}
      </div>
    </section>
  );
}
