import { getFooter, getProductModules } from "@/lib/api";
import Link from "next/link";
import { basePath } from "@/lib/basePath";
import CmsIcon from "@/components/ui/CmsIcon";

const imgEhsWatch = basePath + "/images/EHS%20logo.svg";

const COMPANY = [
  { label: "Home",         href: "/" },
  { label: "About Us",     href: "/about" },
  { label: "Product",      href: "/product" },
  { label: "IRIS",         href: "/iris" },
  { label: "Pricing",      href: "#" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blogs",        href: "/blog" },
  { label: "Contact",      href: "/contact-us" },
];

const MODULES_COL1: { label: string; href: string }[] = [
  { label: "Action Tracker",           href: "/modules/action-tracker" },
  { label: "Audit Management",         href: "/product" },
  { label: "Customer Complaints",      href: "/product" },
  { label: "Emergency Response Drills",href: "/product" },
  { label: "File Management",          href: "/product" },
  { label: "HSE Observations",         href: "/product" },
  { label: "Incident Management",      href: "/product" },
  { label: "Inspections",              href: "/product" },
];
const MODULES_COL2: { label: string; href: string }[] = [
  { label: "Legal Register",       href: "/product" },
  { label: "Management of Change", href: "/product" },
  { label: "Meetings Management",  href: "/product" },
  { label: "Non-conformance",      href: "/product" },
  { label: "Permit to Work",       href: "/product" },
  { label: "Risk Assessment",      href: "/product" },
  { label: "Training Management",  href: "/product" },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  twitter: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  x: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  youtube: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a1628"/>
    </svg>
  ),
  facebook: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  ),
  instagram: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="white"/>
    </svg>
  ),
  github: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.04 11.04 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  ),
  whatsapp: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35zM12.04 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.87-9.9 9.87zm8.42-18.29A11.82 11.82 0 0 0 12.03 0C5.46 0 .1 5.35.1 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.64a11.93 11.93 0 0 0 5.76 1.46h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.18-3.5-8.4z"/>
    </svg>
  ),
  telegram: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M11.94 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.06 0zm4.96 7.22c.1 0 .32.02.46.14a.5.5 0 0 1 .17.33c.02.1.04.32.02.5-.18 1.9-.96 6.52-1.36 8.66-.17.9-.5 1.2-.82 1.23-.7.06-1.23-.46-1.9-.9-1.06-.7-1.66-1.13-2.69-1.81-1.19-.78-.42-1.21.26-1.91.18-.18 3.25-2.98 3.31-3.23.01-.03.02-.15-.06-.21s-.18-.04-.25-.02c-.11.02-1.79 1.14-5.06 3.35-.48.33-.91.49-1.3.48-.43-.01-1.25-.24-1.86-.44-.75-.24-1.35-.37-1.3-.79.03-.22.33-.44.9-.68 3.53-1.54 5.88-2.55 7.06-3.04 3.36-1.4 4.06-1.64 4.52-1.65z"/>
    </svg>
  ),
  discord: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.6 1.25a18.27 18.27 0 0 0-5.49 0 12.6 12.6 0 0 0-.61-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.88 1.52.07.07 0 0 0-.04.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.05 19.9 19.9 0 0 0 6 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-2a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1-.01-.12c.13-.1.25-.2.37-.3a.07.07 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.07.07 0 0 1 .08 0c.12.11.24.21.37.31a.08.08 0 0 1 0 .13c-.6.35-1.22.64-1.88.89a.08.08 0 0 0-.04.11c.36.7.78 1.36 1.23 1.99a.08.08 0 0 0 .08.03 19.84 19.84 0 0 0 6.02-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42z"/>
    </svg>
  ),
  tiktok: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/>
    </svg>
  ),
};

const FALLBACK_SOCIALS = [
  { platform: "linkedin", url: "#" },
  { platform: "twitter",  url: "#" },
  { platform: "youtube",  url: "#" },
];

export default async function Footer() {
  const [footer, modulesRes] = await Promise.all([getFooter(), getProductModules()]);
  const attrs = (footer?.data as any)?.attributes;

  // Real module detail links, straight from the product-modules collection,
  // so the footer Modules column always points at /modules/<slug>.
  const moduleLinks = (modulesRes?.data ?? [])
    .filter((m) => m.attributes.status === "active")
    .map((m) => ({ label: m.attributes.name.trim(), url: `/modules/${m.attributes.slug}` }));

  const logoSrc     = attrs?.brand?.logo?.attributes?.url ?? attrs?.brand?.logo?.url ?? imgEhsWatch;
  const logoAlt     = attrs?.brand?.logo_alt || "EHSWatch";
  const tagline     = attrs?.brand?.tagline || "AI-powered EHS platform helping teams stay safe, compliant, and in control.";
  const copyright   = attrs?.bottom?.copyright_text || "© 2026 EHSWatch. All rights reserved.";
  const legalLinks  = (attrs?.bottom?.legal_links ?? []) as { label: string; url: string }[];
  const ctaEyebrow  = attrs?.cta?.eyebrow  || "GET STARTED";
  const ctaHeadline = attrs?.cta?.headline || "See how EHSWatch transforms safety management across your organisation.";
  const ctaPrimaryLabel = (attrs?.cta?.primary?.label) || (attrs?.cta?.primary_cta?.label) || "Book a Demo";
  const ctaPrimaryHref  = (attrs?.cta?.primary?.url) || (attrs?.cta?.primary_cta?.url) || "#";

  // Empty list in CMS = admin removed them all; hardcoded fallback only when
  // the footer API itself is unreachable.
  const socialLinks: { platform: string; url: string; icon?: string | null }[] = attrs
    ? ((attrs.social_links ?? []) as { platform: string; url: string; icon?: string | null }[])
    : FALLBACK_SOCIALS;

  const columns = (attrs?.columns ?? []) as { heading: string; links: { label: string; url: string }[] }[];
  // Match columns by heading, fall back to CMS order so renamed columns still render
  const companyCol = columns.find((c) => (c.heading || (c as any).title || "").toLowerCase().includes("company")) ?? columns[0];
  const modulesCol = columns.find((c) => (c.heading || (c as any).title || "").toLowerCase().includes("module")) ?? columns[1];
  const companyHeading = companyCol?.heading || "COMPANY";
  const modulesHeading = modulesCol?.heading || "MODULES";

  const companyLinks = companyCol?.links ?? COMPANY.map(l => ({ label: l.label, url: l.href }));
  // Prefer live module pages; fall back to CMS-authored links, then hardcoded.
  const allModules   = moduleLinks.length > 0
    ? moduleLinks
    : (modulesCol?.links ?? [...MODULES_COL1, ...MODULES_COL2].map(l => ({ label: l.label, url: l.href })));
  const mid          = Math.ceil(allModules.length / 2);
  const modCol1      = allModules.slice(0, mid);
  const modCol2      = allModules.slice(mid);

  return (
    <footer className="bg-[#0a1628] flex flex-col items-center pt-12 md:pt-[72px] relative isolate overflow-hidden">

      {/* Main grid: Brand | Company | Modules | CTA */}
      <div className="relative z-[3] w-full max-w-[1216px] px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_1.6fr_1.1fr] gap-8 md:gap-10">

        {/* ── Brand column ── */}
        <div className="flex flex-col gap-3 md:gap-[14px] items-start">
          <div className="h-[34px] w-[124px] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt={logoAlt} className="h-full w-auto object-contain" />
          </div>
          <p className="font-[family-name:var(--font-inter)] text-[13px] md:text-[14px] leading-relaxed md:leading-[24.5px] text-[rgba(255,255,255,0.6)] max-w-[240px]">
            {tagline}
          </p>
          <div className="flex gap-[10px] pt-2 md:pt-[10px]">
            {socialLinks.map(({ platform, url, icon: iconSlug }) => {
              const brandIcon = SOCIAL_ICONS[platform.toLowerCase()];
              return (
                <Link
                  key={platform}
                  href={url || "#"}
                  target={url && url !== "#" ? "_blank" : undefined}
                  rel={url && url !== "#" ? "noopener noreferrer" : undefined}
                  className="w-[30px] h-[30px] rounded-full border border-[rgba(255,255,255,0.8)] flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label={platform}
                >
                  {brandIcon ?? (
                    <CmsIcon icon={iconSlug || platform} size={13} strokeWidth={2} color="white" fallback="link" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Company column ── */}
        <div className="flex flex-col gap-3 md:gap-[20px] items-start">
          <p className="font-[family-name:var(--font-inter)] font-semibold text-[11px] text-white tracking-[0.99px] uppercase">
            {companyHeading}
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 md:gap-[12px] w-full">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.url || "#"}
                  className="font-[family-name:var(--font-inter)] text-[13px] md:text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Modules column — 2-column grid ── */}
        <div className="flex flex-col gap-3 md:gap-[20px] items-start">
          <p className="font-[family-name:var(--font-inter)] font-semibold text-[11px] text-white tracking-[0.99px] uppercase">
            {modulesHeading}
          </p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-[10px] w-full">
            <ul className="flex flex-col gap-[10px]">
              {modCol1.map((mod) => (
                <li key={mod.label}>
                  <Link
                    href={(mod as any).url || (mod as any).href || "#"}
                    className="font-[family-name:var(--font-inter)] text-[12.5px] text-white/60 hover:text-white transition-colors leading-snug"
                  >
                    {mod.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-[10px]">
              {modCol2.map((mod) => (
                <li key={mod.label}>
                  <Link
                    href={(mod as any).url || (mod as any).href || "#"}
                    className="font-[family-name:var(--font-inter)] text-[12.5px] text-white/60 hover:text-white transition-colors leading-snug"
                  >
                    {mod.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── CTA column ── */}
        <div className="flex flex-col items-start">
          <p className="font-[family-name:var(--font-inter)] font-semibold text-[11px] text-white tracking-[0.99px] uppercase mb-3 md:mb-[14px]">
            {ctaEyebrow}
          </p>
          <p className="font-[family-name:var(--font-inter)] font-medium text-[14px] md:text-[15px] leading-relaxed md:leading-[24px] text-[rgba(255,255,255,0.72)] max-w-[240px] mb-4 md:mb-[20px]">
            {ctaHeadline}
          </p>
          <Link
            href={ctaPrimaryHref}
            className="bg-white px-5 md:px-[24px] py-2.5 md:py-[12px] rounded-full font-[family-name:var(--font-inter)] font-medium text-[13px] md:text-[13.5px] text-[#071828] hover:bg-gray-100 transition-colors"
          >
            {ctaPrimaryLabel} →
          </Link>
        </div>

      </div>

      {/* Wordmark fade row */}
      <div className="relative w-full h-[100px] md:h-[180px] z-[2] overflow-hidden mt-8">
        <div className="absolute bottom-3 md:bottom-[19.5px] left-6 md:left-[128px] w-[280px] md:w-[455px] h-[80px] md:h-[125px] opacity-30 md:opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" className="w-full h-full object-contain object-left" />
        </div>
        <div className="absolute inset-0 top-[40px]" style={{ background: "linear-gradient(to bottom, transparent, #0a1628)" }} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 pb-6 md:pb-[28px] pt-5 md:pt-[21px] w-full max-w-[1216px] px-6 md:px-8 z-[1]">
        <p className="font-[family-name:var(--font-inter)] text-[11px] md:text-[12px] text-[rgba(255,255,255,0.3)] text-center">
          {copyright}
        </p>
        <div className="flex gap-4 md:gap-[20px] items-center flex-wrap justify-center">
          {legalLinks.length > 0
            ? legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.url || "#"}
                  className="font-[family-name:var(--font-inter)] text-[11px] md:text-[12px] text-[rgba(255,255,255,0.3)] hover:text-white/60 transition-colors"
                >
                  {link.label}
                </Link>
              ))
            : ([
                { label: "Privacy Policy",  href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Cookie Policy",    href: "/cookie-policy" },
              ] as { label: string; href: string }[]).map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-[family-name:var(--font-inter)] text-[11px] md:text-[12px] text-[rgba(255,255,255,0.3)] hover:text-white/60 transition-colors"
                >
                  {label}
                </Link>
              ))}
        </div>
      </div>
    </footer>
  );
}
