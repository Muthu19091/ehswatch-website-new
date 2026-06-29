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
  const heading = cmsHeading || "The Platform <span>Built for EHSQ</span>";
  const subheading = cmsSubheading || "No gaps. No silos. No workarounds.";

  // Strip HTML tags from heading for the span split approach
  const plainHeading = heading.replace(/<[^>]+>/g, "");
  // Find last word sequence that was wrapped in span (after first word chunk)
  const spanMatch = heading.match(/<span>([\s\S]*?)<\/span>/);
  const spanText = spanMatch ? spanMatch[1] : null;
  const headingBefore = spanText
    ? plainHeading.slice(0, plainHeading.indexOf(spanText)).trim()
    : plainHeading;

  // Default body paragraphs (used when no CMS body)
  const defaultBody = (
    <>
      <Reveal variant="fade-up" duration={700}>
        <p className="font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-[1.78] tracking-[-0.011em]">
          EHSWatch is built for EHSQ teams that{" "}
          <strong className="font-semibold text-[#1b1b1b]">cannot afford gaps</strong> — in
          reporting, in visibility, or in response. Integrated modules cover every core EHSQ
          workflow, connected on a single platform that{" "}
          <strong className="font-semibold text-[#1b1b1b]">works on any device, online or offline</strong>.
          No integrations to maintain. No data living in separate systems.
        </p>
      </Reveal>
      <Reveal variant="fade-up" duration={700} delay={120}>
        <p className="font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-[1.78] tracking-[-0.011em]">
          Just{" "}
          <strong className="font-semibold text-[#1b1b1b]">one place</strong> where every
          incident, audit, permit and training record feeds into the same operational picture —
          giving every team member, from the field worker to the board, the clarity they need to
          act.
        </p>
      </Reveal>
    </>
  );

  return (
    <section className="bg-white py-[60px] md:py-[100px] lg:py-[120px]">
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-[1fr_1.25fr] gap-8 md:gap-[96px] items-start">
        {/* Left sticky label */}
        <div className="md:sticky md:top-[120px]">
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[32px] md:text-[40px] leading-[1.12] text-[#1b1b1b] tracking-[-0.03em]">
            {spanText ? (
              <>
                {headingBefore}{" "}
                <span className="text-[#155eef]">{spanText}</span>
              </>
            ) : (
              plainHeading
            )}
          </h2>
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#9ca3af] leading-relaxed">
            {subheading}
          </p>
          {cmsImage?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cmsImage.url}
              alt={cmsImage.alt ?? ""}
              className="mt-8 w-full rounded-xl object-cover"
            />
          )}
        </div>
        {/* Right body */}
        <div className="flex flex-col gap-7">
          {cmsBody ? (
            <Reveal variant="fade-up" duration={700}>
              <div
                className="font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-[1.78] tracking-[-0.011em] prose prose-sm max-w-none [&_strong]:font-semibold [&_strong]:text-[#1b1b1b]"
                dangerouslySetInnerHTML={{ __html: cmsBody }}
              />
            </Reveal>
          ) : (
            defaultBody
          )}
        </div>
      </div>
    </section>
  );
}
