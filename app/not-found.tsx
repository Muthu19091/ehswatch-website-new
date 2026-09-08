"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { basePath } from "@/lib/basePath";

const CMS_API =
  process.env.NEXT_PUBLIC_CMS_API_URL ?? "https://cmsapi.ehswatch.com/api/v1";

type Cta = { label: string; url: string };
type HeroData = {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primary_cta?: Cta | null;
  secondary_cta?: Cta | null;
};
type CtaBannerData = {
  headline?: string;
  subheadline?: string;
  primary_cta?: Cta | null;
};
type Block =
  | { type: "hero"; data: HeroData }
  | { type: "cta_banner"; data: CtaBannerData }
  | { type: string; data: Record<string, unknown> };

const STATIC_FALLBACK: { hero: HeroData; cta: CtaBannerData } = {
  hero: {
    eyebrow: "404",
    headline: "We couldn't find that page",
    subheadline: "The link you followed may be broken or the page may have been moved.",
    primary_cta: { label: "Back to home", url: "/" },
    secondary_cta: { label: "Browse blog", url: "/blog" },
  },
  cta: {
    headline: "Still stuck? We can help.",
    subheadline: "Get in touch and we'll point you to the right resource.",
    primary_cta: { label: "Contact us", url: "/contact-us" },
  },
};

export default function NotFound() {
  const [hero, setHero] = useState<HeroData>(STATIC_FALLBACK.hero);
  const [cta, setCta] = useState<CtaBannerData>(STATIC_FALLBACK.cta);

  useEffect(() => {
    let cancelled = false;
    fetch(`${CMS_API}/pages/404`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (cancelled || !j?.data?.attributes?.content) return;
        const blocks = j.data.attributes.content as Block[];
        const heroBlock = blocks.find((b) => b.type === "hero");
        const ctaBlock = blocks.find((b) => b.type === "cta_banner");
        if (heroBlock) setHero(heroBlock.data as HeroData);
        if (ctaBlock) setCta(ctaBlock.data as CtaBannerData);
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 md:px-6 text-center">
          <div className="max-w-[720px] mx-auto">
            {hero.eyebrow && (
              <p className="font-[family-name:var(--font-inter)] text-[14px] uppercase tracking-[0.18em] text-[#ff6d00] font-semibold mb-4">
                {hero.eyebrow}
              </p>
            )}
            <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[36px] md:text-[56px] leading-tight text-[#0a0f1e] mb-5">
              {hero.headline}
            </h1>
            {hero.subheadline && (
              <p className="font-[family-name:var(--font-inter)] text-[16px] md:text-[18px] leading-relaxed text-[#6b7280] mb-9 max-w-[520px] mx-auto">
                {hero.subheadline}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
              {hero.primary_cta?.url && (
                <Link
                  href={`${basePath}${hero.primary_cta.url}`}
                  className="px-6 py-3 rounded-full bg-[#ff6d00] text-white font-[family-name:var(--font-inter)] font-medium text-[15px] hover:bg-[#e66200] transition-colors"
                >
                  {hero.primary_cta.label}
                </Link>
              )}
              {hero.secondary_cta?.url && (
                <Link
                  href={`${basePath}${hero.secondary_cta.url}`}
                  className="px-6 py-3 rounded-full border border-[#0a0f1e] text-[#0a0f1e] font-[family-name:var(--font-inter)] font-medium text-[15px] hover:bg-[#0a0f1e] hover:text-white transition-colors"
                >
                  {hero.secondary_cta.label}
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#f1f7ff] py-14 md:py-20 px-4 md:px-6">
          <div className="max-w-[720px] mx-auto text-center">
            {cta.headline && (
              <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] md:text-[36px] leading-tight text-[#0a0f1e] mb-3">
                {cta.headline}
              </h2>
            )}
            {cta.subheadline && (
              <p className="font-[family-name:var(--font-inter)] text-[15px] md:text-[17px] text-[#6b7280] mb-7">
                {cta.subheadline}
              </p>
            )}
            {cta.primary_cta?.url && (
              <Link
                href={`${basePath}${cta.primary_cta.url}`}
                className="inline-block px-6 py-3 rounded-full bg-[#ff6d00] text-white font-[family-name:var(--font-inter)] font-medium text-[15px] hover:bg-[#e66200] transition-colors"
              >
                {cta.primary_cta.label}
              </Link>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
