import DynamicCmsForm from "@/components/ui/DynamicCmsForm";
import ContactFormTabs, { type FormTab } from "@/components/ui/ContactFormTabs";
import CmsIcon from "@/components/ui/CmsIcon";
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
  formTabs?: FormTab[];
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

export default function ContactPage({
  formAttrs,
  formSlug = "contact",
  formTabs,
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
  // CMS-only: no hardcoded fallback office items.
  const resolvedOfficeItems = officeItems && officeItems.length > 0 ? officeItems : [];

  /* Form section heading — CMS-only (rendered only when formHeading is set) */
  const sectionHeading = formHeading
    ? formHeading.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">')
    : "";

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
                  animationDelay: `${(i * 0.45) % 4}s`,
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

          {/* Headline — CMS-only */}
          {heroHeadline?.trim() && (
            <h1
              className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] sm:text-[52px] md:text-[64px] leading-[1.05] tracking-[-0.03em] text-[#0a0f1e] animate-hero-rise"
              style={{ animationDelay: "80ms" }}
              dangerouslySetInnerHTML={{
                __html: heroHeadline.replace(/<span\b[^>]*>/gi, '<span style="color:#1d4ed8">'),
              }}
            />
          )}

          {/* Subheadline — CMS rich text; render as HTML (div so a wrapping
              <p> is valid) so <p>/<br>/<strong>/<a> format instead of showing
              literal tags. */}
          {heroSubheadline?.trim() && (
            <div
              className="font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[17px] leading-[1.8] text-[#6b7280] max-w-[520px] text-pretty animate-hero-rise [&_p]:m-0 [&_a]:text-[#155eef] [&_a]:underline [&_strong]:font-semibold"
              style={{ animationDelay: "180ms" }}
              dangerouslySetInnerHTML={{ __html: heroSubheadline }}
            />
          )}

          {/* Trust badges below the subheading */}
          <div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 animate-hero-rise"
            style={{ animationDelay: "230ms" }}
          >
            {["Rapid Deployment", "4-Hour SLA Response", "ISO 27001 Certified"].map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 font-[family-name:var(--font-dm-sans)] font-medium text-[14px] text-[#0a0f1e]"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <circle cx="8" cy="8" r="8" fill="#ff7812" />
                  <path d="M4.5 8.2l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </span>
            ))}
          </div>

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

          <div className={`contact-cols grid grid-cols-1 gap-14${(formAttrs || (formTabs && formTabs.length)) ? " lg:grid-cols-[280px_1fr] lg:gap-24" : ""}`}>

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
                    <CmsIcon icon={item.icon} size={18} strokeWidth={1.8} color="#1d4ed8" fallback="building-2" />
                  </div>

                  {/* Text */}
                  <div>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-1.5">
                      {item.title}
                    </p>
                    {/* Description text (e.g. a postal address) … */}
                    {item.description && (
                      <p className="font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.8] text-[#374151] whitespace-pre-line">
                        {item.description}
                      </p>
                    )}
                    {/* … plus its own hyperlink when the CMS link field is set.
                        These are additive: a description no longer swallows the
                        link, so an address can show text AND a working link. */}
                    {item.linkLabel && item.linkUrl && (() => {
                      const url = item.linkUrl as string;
                      const href =
                        item.linkType === "email" ? `mailto:${url}`
                        : item.linkType === "phone" || item.linkType === "tel" ? `tel:${url.replace(/\s+/g, "")}`
                        : /^https?:\/\//i.test(url) || /^(mailto:|tel:|\/|#)/.test(url) ? url
                        : `https://${url}`;
                      const external = /^https?:\/\//i.test(href);
                      return (
                        <a
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className={`font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.8] text-[#1d4ed8] hover:underline ${item.description ? "mt-1 inline-block" : ""}`}
                        >
                          {item.linkLabel}
                        </a>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right: dynamic CMS form — only rendered when CMS form is enabled ──
                Wrapped so the RTL override can keep the FORM right-to-left while the
                grid column order is locked (see .contact-cols in globals.css). */}
            {formTabs && formTabs.length > 0 ? (
              <ContactFormTabs forms={formTabs} />
            ) : formAttrs ? (
              /* mt-14 gives space between the offices block and the form when they
                 stack (below lg); on lg they sit side-by-side so no top margin. */
              <div className="ct-form-col mt-20 lg:mt-0">
                <DynamicCmsForm formAttrs={formAttrs} slug={formSlug} variant="contact" />
              </div>
            ) : null}
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
