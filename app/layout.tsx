import type { Metadata } from "next";
import { DM_Sans, Gothic_A1, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import PagePreviewBanner from "@/components/layout/PagePreviewBanner";
import GoogleTranslate from "@/components/layout/GoogleTranslate";
import ArabicOverrides from "@/components/layout/ArabicOverrides";
import UtmCapture from "@/components/UtmCapture";
import { getLocale } from "@/lib/locale";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const gothicA1 = Gothic_A1({
  variable: "--font-gothic-a1",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "EHSWatch — From Manual Chaos to Smart Safety",
  description: "AI-powered EHS platform to streamline reporting everywhere.",
  icons: {
    // SVG for modern browsers, PNG fallback for iOS/iPad Safari (which doesn't
    // render SVG tab favicons and requires a PNG apple-touch-icon).
    icon: [
      { url: BASE + "/images/EHS%20fav%20icon.svg", type: "image/svg+xml" },
      { url: BASE + "/images/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: BASE + "/images/favicon-96.png",
    apple:    BASE + "/images/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${dmSans.variable} ${gothicA1.variable} ${inter.variable} ${instrumentSans.variable}`}
    >
      <body className="antialiased">
        {/* Cloak (before paint): when Arabic is active, hide the page until the
            first-party translator has swapped the text in, so the visitor never
            sees the English→Arabic reflow. Force-reveal after 3s so the page can
            never get stuck hidden if translation is slow or fails. */}
        <script
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(/(?:^|;\\s*)(googtrans=\\/en\\/ar|locale=ar)/.test(document.cookie)){document.documentElement.classList.add("gt-cloak");setTimeout(function(){document.documentElement.classList.remove("gt-cloak");},3000);}}catch(e){}})();`,
          }}
        />
        {/* Pre-hydration language-switch fallback: on slow devices a click can
            land before React attaches handlers and is silently lost. This
            native capture listener handles those early clicks by setting the
            same cookies the React handler would, then reloading so the server
            + Google Translate pick the language up. Stands down for good once
            LanguageSwitcher sets __lsHydrated. */}
        <script
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `(function(){var h=function(e){if(window.__lsHydrated||window.__lsFallbackFired)return;var t=e.target;var btn=t&&t.closest?t.closest("[data-lang-switch]"):null;if(!btn)return;window.__lsFallbackFired=true;e.preventDefault();var toAr=!/(?:^|;\\s*)googtrans=\\/en\\/ar/.test(document.cookie);var host=window.location.hostname;if(toAr){document.cookie="locale=ar; path=/; max-age=31536000; SameSite=Lax";document.cookie="googtrans=/en/ar; path=/; SameSite=Lax";document.cookie="googtrans=/en/ar; path=/; domain="+host+"; SameSite=Lax";}else{document.cookie="locale=en; path=/; max-age=31536000; SameSite=Lax";var ds=["","; domain="+host,"; domain=."+host];for(var i=0;i<ds.length;i++){document.cookie="googtrans=; path=/; max-age=0"+ds[i];}}setTimeout(function(){window.location.reload();},50);};document.addEventListener("click",h,true);document.addEventListener("pointerup",h,true);document.addEventListener("touchend",h,true);})();`,
          }}
        />
        <UtmCapture />
        <CustomCursor />
        <GoogleTranslate />
        <ArabicOverrides />
        <PagePreviewBanner />
        {children}
        {/* Odigma preview/embed overlay — loaded site-wide (all pages).
            data-cfasync="false" keeps Cloudflare Rocket Loader from deferring it. */}
        <script
          src="https://preview.odigma.ooo/embed.js?project=ehswatch-stage&key=qe_f675d8908bf1b5c6cfcaad4f"
          data-cfasync="false"
          defer
        />
      </body>
    </html>
  );
}
