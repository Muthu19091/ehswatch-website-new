import Reveal from "@/components/ui/Reveal";
import { basePath } from "@/lib/basePath";
import GlareButton from "@/components/ui/GlareButton";

interface CTABannerProps {
  cmsHeadline?: string;
  cmsSubhead?: string;
  cmsPrimaryCta?: { label: string; url: string; videoUrl?: string; newTab?: boolean };
  cmsSecondaryCta?: { label: string; url: string; videoUrl?: string; newTab?: boolean };
}

export default function CTABanner({
  cmsHeadline,
  cmsSubhead,
  cmsPrimaryCta,
  cmsSecondaryCta,
}: CTABannerProps = {}) {
  // CMS-only: no hardcoded copy. The whole banner is hidden if the CMS
  // provides no headline, subhead, or buttons.
  const headline = cmsHeadline?.trim() || "";
  const subhead = cmsSubhead?.trim() || "";
  const hasButtons = !!(cmsPrimaryCta || cmsSecondaryCta);
  if (!headline && !subhead && !hasButtons) return null;

  return (
    <section
      className="relative py-12 md:py-[61px] px-4 md:px-6 overflow-hidden"
      style={{
        background: '#f1f7ff',
        backgroundImage: `url(${basePath}/images/product/cta-background.svg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="max-w-[800px] mx-auto flex flex-col gap-3 md:gap-[16px] items-center">
        {headline && (
        <Reveal variant="slide-right" duration={750}>
          <h2
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[44px] leading-tight text-[#0a0f1e] text-center"
            dangerouslySetInnerHTML={{ __html: headline }}
          />
        </Reveal>
        )}

        {subhead && (
        <Reveal variant="slide-left" duration={750} delay={120}>
          <p className="font-[family-name:var(--font-inter)] text-[14px] md:text-[17px] leading-relaxed md:leading-[29.75px] text-[#6b7280] text-center max-w-[560px]">
            {subhead}
          </p>
        </Reveal>
        )}

        {hasButtons && (
          <Reveal variant="fade-up" duration={700} delay={240} className="flex flex-col sm:flex-row gap-3 md:gap-[16px] items-center justify-center pt-4 md:pt-[24px] w-full sm:w-auto">
            {cmsPrimaryCta && (
              <GlareButton
                href={cmsPrimaryCta.url}
                videoUrl={cmsPrimaryCta.videoUrl}
                newTab={cmsPrimaryCta.newTab}
                className="w-full sm:w-auto px-6 md:px-[26px] py-3 md:py-[10px] rounded-full font-[family-name:var(--font-inter)] font-medium text-[14px] text-white whitespace-nowrap"
                style={{
                  backgroundImage: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                }}
              >
                {cmsPrimaryCta.label}
              </GlareButton>
            )}

            {cmsSecondaryCta && (
              <GlareButton
                href={cmsSecondaryCta.url}
                videoUrl={cmsSecondaryCta.videoUrl}
                newTab={cmsSecondaryCta.newTab}
                fillColor="#FFA660"
                hoverTextColor="#ffffff"
                className="w-full sm:w-auto px-6 md:px-[26px] py-3 md:py-[10px] rounded-full bg-[rgba(255,120,44,0.1)] border border-[rgba(255,120,44,0.2)] font-[family-name:var(--font-inter)] font-medium text-[14px] text-[var(--brand-primary)] whitespace-nowrap"
              >
                {cmsSecondaryCta.label}
              </GlareButton>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
