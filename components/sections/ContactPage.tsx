import DynamicCmsForm from "@/components/ui/DynamicCmsForm";
import CmsSlider from "@/components/ui/CmsSlider";
import type { CmsForm } from "@/lib/types";
import type { CmsSlideItem } from "@/components/ui/CmsSlider";

/* ── Office item shape (from CMS icon_features block) ── */
interface CmsOfficeItem {
  icon: string;
  title: string;
  description: string | null;
  linkLabel: string | null;
  linkUrl: string | null;
  linkType: string | null;
}

interface CmsSliderData {
  heading?: string | null;
  subheading?: string | null;
  autoplay?: boolean;
  intervalMs?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  slides: CmsSlideItem[];
}

interface CmsGalleryImage {
  imageUrl: string;
  caption?: string | null;
}

interface CmsGalleryData {
  heading?: string | null;
  subheading?: string | null;
  enableLightbox?: boolean;
  images: CmsGalleryImage[];
}

export interface ContactPageProps {
  formAttrs: CmsForm["attributes"] | null;
  formSlug?: string;
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  heroPrimaryCtaLabel?: string;
  heroPrimaryCtaHref?: string;
  formHeading?: string;
  formSubheading?: string;
  formDescription?: string;
  officesHeading?: string;
  officeItems?: CmsOfficeItem[] | null;
  sliderData?: CmsSliderData | null;
  galleryData?: CmsGalleryData | null;
}

/* ── Inline SVG icons keyed to CMS icon slugs ── */
function OfficeIcon({ name }: { name: string }) {
  if (name === "mail" || name === "email") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    );
  }
  /* building-office (default) */
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-4h6v4" />
      <rect x="9" y="9" width="2" height="2" />
      <rect x="13" y="9" width="2" height="2" />
    </svg>
  );
}

const DEFAULT_OFFICE_ITEMS: CmsOfficeItem[] = [
  { icon: "building-office", title: "USA Office",   description: "7138 Sale Ave,\nWest Hills, CA 91307, USA",          linkLabel: null, linkUrl: null, linkType: null },
  { icon: "building-office", title: "India Office", description: "Awfis Space Solutions,\nHyderabad, Telangana, India", linkLabel: null, linkUrl: null, linkType: null },
  { icon: "mail",            title: "Email",        description: null, linkLabel: "sales@ehswatch.com", linkUrl: "sales@ehswatch.com", linkType: "email" },
];

export default function ContactPage({
  formAttrs,
  formSlug = "contact",
  heroEyebrow,
  heroHeadline,
  heroSubheadline,
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  formHeading,
  formSubheading,
  formDescription,
  officesHeading,
  officeItems,
  sliderData,
  galleryData,
}: ContactPageProps) {
  const resolvedOfficeItems = officeItems && officeItems.length > 0 ? officeItems : DEFAULT_OFFICE_ITEMS;

  /* Resolve the form section heading — prefer form_embed.heading, fall back to plain text */
  const sectionHeading = formHeading
    ? formHeading.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">')
    : 'Get in Touch with <span style="color:#1d4ed8">Our Team</span>';

  return (
    <>
      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden flex items-center justify-center px-6 pt-[148px] pb-[40px]">
        <style>{`
          .ct-grid {
            background-image:
              linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px);
            background-size: 50px 50px;
          }
          @keyframes ctBoxFill { 0%,100%{opacity:0} 50%{opacity:0.5} }
          .ct-box { position:absolute; width:48px; height:48px; }
        `}</style>

        <div className="absolute inset-0 overflow-hidden ct-grid pointer-events-none">
          {Array.from({ length: 200 }, (_, i) => {
            const shouldAnimate = (i * 7 + i * 3) % 17 === 0;
            const colors = ["#EFF6FF", "#DBEAFE", "#BFDBFE", "#93C5FD"];
            return shouldAnimate ? (
              <div
                key={i}
                className="ct-box"
                style={{
                  left: `${(i % 20) * 50 + 1}px`,
                  top: `${Math.floor(i / 20) * 50 + 1}px`,
                  backgroundColor: colors[i % 4],
                  animation: `ctBoxFill ${4 + ((i * 2) % 6)}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.3) % 12}s`,
                }}
              />
            ) : null;
          })}
          <div
            className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.9) 60%, #fff 100%)" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 75% 75% at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 50%, transparent 100%)" }}
          />
        </div>

        <div className="relative z-20 max-w-[700px] w-full mx-auto text-center flex flex-col items-center gap-4">
          {/* Eyebrow */}
          {heroEyebrow && (
            <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold uppercase tracking-[0.14em] text-[#1d4ed8] animate-hero-rise">
              {heroEyebrow}
            </span>
          )}

          {/* Headline */}
          <h1
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-[-0.03em] text-[#0a0f1e] animate-hero-rise"
            style={{ animationDelay: "80ms" }}
            dangerouslySetInnerHTML={{
              __html: heroHeadline
                ? heroHeadline.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">')
                : 'Get in Touch with <span style="color:#1d4ed8">Our Team</span>',
            }}
          />

          {/* Subheadline */}
          <p
            className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] leading-[1.8] text-[#6b7280] max-w-[520px] text-pretty animate-hero-rise"
            style={{ animationDelay: "180ms" }}
          >
            {heroSubheadline ?? "Reach out for demos, onboarding support, or to discuss how EHSWatch fits your organisation."}
          </p>

          {/* Primary CTA — only rendered when CMS provides one */}
          {heroPrimaryCtaLabel && heroPrimaryCtaHref && (
            <div className="animate-hero-rise" style={{ animationDelay: "280ms" }}>
              <a
                href={heroPrimaryCtaHref}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-white"
                style={{
                  background: "linear-gradient(102.8deg, #ffa964 0.12%, #ff8e37 34.34%, #ff7812 50.27%, #ff6d00 119.92%)",
                }}
              >
                {heroPrimaryCtaLabel}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact section ── */}
      <section id="contact-form" className="bg-white px-6 sm:px-10 lg:px-20 pt-[36px] pb-[72px] md:pt-[48px] md:pb-[96px]">
        <div className="max-w-[1180px] mx-auto">

          {/* Section heading from form_embed block */}
          {(formHeading || formSubheading || formDescription) && (
            <div className="mb-12">
              {formHeading && (
                <h2
                  className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[34px] md:text-[40px] leading-tight tracking-[-0.02em] text-[#0a0f1e] mb-3"
                  dangerouslySetInnerHTML={{ __html: sectionHeading }}
                />
              )}
              {formSubheading && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.75] text-[#6b7280]">
                  {formSubheading}
                </p>
              )}
              {formDescription && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.75] text-[#6b7280] mt-2">
                  {formDescription}
                </p>
              )}
            </div>
          )}

          <div className={`grid grid-cols-1 gap-14${formAttrs ? " lg:grid-cols-[280px_1fr] lg:gap-24" : ""}`}>

            {/* ── Left: office items from icon_features block ── */}
            <div className="flex flex-col gap-8">
              {/* Section label from icon_features.heading */}
              {officesHeading && (
                <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9ca3af]">
                  {officesHeading}
                </p>
              )}
              {resolvedOfficeItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  {/* Icon chip */}
                  <div
                    className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ background: "#eef4ff" }}
                  >
                    <OfficeIcon name={item.icon} />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-1.5">
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.8] text-[#374151] whitespace-pre-line">
                        {item.description}
                      </p>
                    ) : item.linkLabel ? (
                      <a
                        href={item.linkType === "email" ? `mailto:${item.linkUrl}` : item.linkUrl ?? "#"}
                        className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.8] text-[#1d4ed8] hover:underline"
                      >
                        {item.linkLabel}
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right: dynamic CMS form — only rendered when CMS form is enabled ── */}
            {formAttrs && <DynamicCmsForm formAttrs={formAttrs} slug={formSlug} variant="contact" />}
          </div>
        </div>
      </section>

      {/* ── Slider section (from CMS slider block, only when slides have images) ── */}
      {sliderData && (
        <CmsSlider
          heading={sliderData.heading}
          subheading={sliderData.subheading}
          slides={sliderData.slides}
          autoplay={sliderData.autoplay}
          intervalMs={sliderData.intervalMs}
          loop={sliderData.loop}
          showArrows={sliderData.showArrows}
          showDots={sliderData.showDots}
        />
      )}

      {/* ── Image gallery section (from CMS image_gallery block, only when images exist) ── */}
      {galleryData && (
        <section className="py-[60px] md:py-[80px] px-6 bg-white">
          <div className="max-w-[1180px] mx-auto">
            {(galleryData.heading || galleryData.subheading) && (
              <div className="text-center mb-10">
                {galleryData.heading && (
                  <h2
                    className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] md:text-[38px] leading-tight tracking-[-0.02em] text-[#0a0f1e] mb-3"
                    dangerouslySetInnerHTML={{
                      __html: galleryData.heading.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">'),
                    }}
                  />
                )}
                {galleryData.subheading && (
                  <p className="font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[16px] leading-[1.75] text-[#6b7280]">
                    {galleryData.subheading}
                  </p>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryData.images.map((img, idx) => (
                <a
                  key={idx}
                  href={img.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-xl block aspect-square"
                  style={{ background: "#f1f5f9" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={img.caption || ""}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {img.caption && (
                    <div
                      className="absolute inset-x-0 bottom-0 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      style={{ background: "rgba(0,0,0,0.55)" }}
                    >
                      <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-white leading-tight">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
