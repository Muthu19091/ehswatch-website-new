import Link from "next/link";
import { basePath } from "@/lib/basePath";

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

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] flex flex-col items-center pt-12 md:pt-[72px] relative isolate overflow-hidden">

      {/* Main grid: Brand | Company | Modules | CTA */}
      <div className="relative z-[3] w-full max-w-[1216px] px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_1.6fr_1.1fr] gap-8 md:gap-10">

        {/* ── Brand column ── */}
        <div className="flex flex-col gap-3 md:gap-[14px] items-start">
          <div className="h-[34px] w-[124px] relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgEhsWatch} alt="EHSWatch" className="h-full w-auto object-contain" />
          </div>
          <p className="font-[family-name:var(--font-inter)] text-[13px] md:text-[14px] leading-relaxed md:leading-[24.5px] text-[rgba(255,255,255,0.6)] max-w-[240px]">
            AI-powered EHS platform helping teams stay safe, compliant, and in control.
          </p>
          <div className="flex gap-[10px] pt-2 md:pt-[10px]">
            <Link href="#" className="w-[30px] h-[30px] rounded-full border border-[rgba(255,255,255,0.8)] flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </Link>
            <Link href="#" className="w-[30px] h-[30px] rounded-full border border-[rgba(255,255,255,0.8)] flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </Link>
            <Link href="#" className="w-[30px] h-[30px] rounded-full border border-[rgba(255,255,255,0.8)] flex items-center justify-center hover:bg-white/10 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0a1628"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Company column ── */}
        <div className="flex flex-col gap-3 md:gap-[20px] items-start">
          <p className="font-[family-name:var(--font-inter)] font-semibold text-[11px] text-white tracking-[0.99px] uppercase">
            COMPANY
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2 md:gap-[12px] w-full">
            {COMPANY.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-[family-name:var(--font-inter)] text-[13px] md:text-[14px] text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Modules column — 2-column grid of 15 modules ── */}
        <div className="flex flex-col gap-3 md:gap-[20px] items-start">
          <p className="font-[family-name:var(--font-inter)] font-semibold text-[11px] text-white tracking-[0.99px] uppercase">
            MODULES
          </p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-[10px] w-full">
            <ul className="flex flex-col gap-[10px]">
              {MODULES_COL1.map((mod) => (
                <li key={mod.label}>
                  <Link
                    href={mod.href}
                    className="font-[family-name:var(--font-inter)] text-[12.5px] text-white/60 hover:text-white transition-colors leading-snug"
                  >
                    {mod.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-[10px]">
              {MODULES_COL2.map((mod) => (
                <li key={mod.label}>
                  <Link
                    href={mod.href}
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
            GET STARTED
          </p>
          <p className="font-[family-name:var(--font-inter)] font-medium text-[14px] md:text-[15px] leading-relaxed md:leading-[24px] text-[rgba(255,255,255,0.72)] max-w-[240px] mb-4 md:mb-[20px]">
            See how EHSWatch transforms safety management across your organisation.
          </p>
          <Link
            href="#"
            className="bg-white px-5 md:px-[24px] py-2.5 md:py-[12px] rounded-full font-[family-name:var(--font-inter)] font-medium text-[13px] md:text-[13.5px] text-[#071828] hover:bg-gray-100 transition-colors"
          >
            Book a Demo →
          </Link>
        </div>

      </div>

      {/* Wordmark fade row */}
      <div className="relative w-full h-[100px] md:h-[180px] z-[2] overflow-hidden mt-8">
        <div className="absolute bottom-3 md:bottom-[19.5px] left-6 md:left-[128px] w-[280px] md:w-[455px] h-[80px] md:h-[125px] opacity-30 md:opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgEhsWatch} alt="" className="w-full h-full object-contain object-left" />
        </div>
        <div className="absolute inset-0 top-[40px]" style={{ background: "linear-gradient(to bottom, transparent, #0a1628)" }} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 pb-6 md:pb-[28px] pt-5 md:pt-[21px] w-full max-w-[1216px] px-6 md:px-8 z-[1]">
        <p className="font-[family-name:var(--font-inter)] text-[11px] md:text-[12px] text-[rgba(255,255,255,0.3)] text-center">
          © 2026 EHSWatch. All rights reserved.
        </p>
        <div className="flex gap-4 md:gap-[20px] items-center flex-wrap justify-center">
          {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((label) => (
            <Link
              key={label}
              href="#"
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
