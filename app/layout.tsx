import type { Metadata } from "next";
import { DM_Sans, Gothic_A1, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import PagePreviewBanner from "@/components/layout/PagePreviewBanner";
import GoogleTranslate from "@/components/layout/GoogleTranslate";
import ArabicOverrides from "@/components/layout/ArabicOverrides";
import UtmCapture from "@/components/UtmCapture";
import { getLocale } from "@/lib/locale";
import { getSettings, getHeader } from "@/lib/api";
import TrackingScripts from "@/components/layout/TrackingScripts";

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

// Site-wide metadata. Favicon + apple-touch icon come from Site Settings
// (brand.favicon / brand.apple_touch_icon) when set, falling back to the bundled
// assets — so changing the icon in the CMS reflects on the site (BUG-154).
export async function generateMetadata(): Promise<Metadata> {
  const settingsRes = await getSettings().catch(() => null);
  const data = settingsRes?.data as {
    brand?: {
      favicon?: { attributes?: { url?: string; mime_type?: string } };
      apple_touch_icon?: { attributes?: { url?: string; mime_type?: string } };
      name?: string;
    };
    seo?: { canonical_base_url?: string };
  } | null;
  const brand = data?.brand;
  const fav = brand?.favicon?.attributes;
  const faviconUrl = fav?.url;
  // Emit the correct <link type> for whatever format the editor uploaded
  // (svg / ico / png) so browsers that ignore an untyped icon still pick it up.
  const faviconType = fav?.mime_type;
  const appleAttrs = brand?.apple_touch_icon?.attributes;
  const appleUrl = appleAttrs?.url;
  const appleType = appleAttrs?.mime_type || "image/png";
  const origin = (data?.seo?.canonical_base_url || "https://stage.odigma.ooo/ehswatch-stage").replace(/\/+$/, "");

  return {
    metadataBase: new URL(origin),
    title: "EHSWatch - From Manual Chaos to Smart Safety",
    description: "AI-powered EHS platform to streamline reporting everywhere.",
    icons: {
      icon: faviconUrl
        ? [{ url: faviconUrl, ...(faviconType ? { type: faviconType } : {}) }]
        : [
            // Bundled fallback: SVG for modern browsers, PNG for iOS/iPad Safari.
            { url: BASE + "/images/EHS%20fav%20icon.svg", type: "image/svg+xml" },
            { url: BASE + "/images/favicon-96.png", type: "image/png", sizes: "96x96" },
          ],
      shortcut: faviconUrl || BASE + "/images/favicon-96.png",
      // Apple home-screen icon: declare 180x180 so iOS picks it up. Requires a
      // real SQUARE PNG in Site Settings (a large non-square photo won't render).
      apple: appleUrl
        ? [{ url: appleUrl, sizes: "180x180", type: appleType }]
        : BASE + "/images/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [locale, settingsRes, headerRes] = await Promise.all([
    getLocale(),
    getSettings().catch(() => null),
    getHeader().catch(() => null),
  ]);
  // Site-wide analytics + JSON-LD, both CMS-driven (Settings → tracking / brand / seo).
  const settings = ((settingsRes?.data ?? null) as unknown) as Record<string, any> | null;
  const tracking = settings?.tracking ?? {};
  // The CMS keeps enabled analytics snippets (e.g. the real GTM container)
  // in tracking.additional_scripts[{position,enabled,script}] — fold them
  // into the head/body markup alongside the legacy head_script/body_script.
  const addlScripts: Array<{ position?: string; enabled?: boolean; script?: string }> =
    Array.isArray(tracking?.additional_scripts) ? tracking.additional_scripts : [];
  const scriptsFor = (positions: string[]): string =>
    addlScripts.filter((x) => x?.enabled && positions.includes(String(x?.position)))
      .map((x) => x?.script).filter((v): v is string => Boolean(v && v.trim())).join("\n");
  const headTracking = [tracking?.head_script, scriptsFor(["head"])]
    .filter((v) => v && String(v).trim()).join("\n");
  const bodyTracking = [tracking?.body_script, scriptsFor(["body_start", "body_end", "body"])]
    .filter((v) => v && String(v).trim()).join("\n");
  const brandName = settings?.brand?.name || "EHSWatch";
  const siteUrl = (settings?.seo?.canonical_base_url || "https://stage.odigma.ooo/ehswatch-stage").replace(/\/+$/, "");
  // Brand primary color from Site Settings drives --brand-primary site-wide.
  const primaryColor = settings?.appearance?.primary_color || settings?.brand?.primary_color || "var(--brand-primary)";
  const headerAttrs = (headerRes?.data as any)?.attributes;
  const orgLogo = headerAttrs?.logo?.attributes?.url || headerAttrs?.logo?.url || `${siteUrl}/images/favicon-96.png`;
  // Prefer CMS-authored structured data (Settings → structured_data) so schema
  // is fully editable in the dashboard; resolve any bare media-id logo/image to
  // a real URL. Fall back to a constructed Organization + WebSite graph.
  const resolveSchemaNode = (node: unknown): unknown => {
    if (!node || typeof node !== "object") return node;
    const n = { ...(node as Record<string, unknown>) };
    for (const k of ["logo", "image"]) {
      if (typeof n[k] === "string" && /^\d+$/.test(n[k] as string)) n[k] = orgLogo;
    }
    return n;
  };
  const cmsSchema = Array.isArray(settings?.structured_data) ? (settings!.structured_data as unknown[]) : [];
  const jsonLdNodes: unknown[] = cmsSchema.length > 0
    ? cmsSchema.map(resolveSchemaNode)
    : [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: brandName,
          url: siteUrl,
          logo: orgLogo,
          ...(settings?.contact?.email ? { email: settings.contact.email } : {}),
          ...(settings?.contact?.phone ? { telephone: settings.contact.phone } : {}),
        },
        { "@context": "https://schema.org", "@type": "WebSite", name: brandName, url: siteUrl },
      ];
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${dmSans.variable} ${gothicA1.variable} ${inter.variable} ${instrumentSans.variable}`}
      style={{ "--brand-primary": primaryColor } as React.CSSProperties}
    >
      <body className="antialiased">
        {/* Structured data (JSON-LD) — CMS-authored (Settings → structured_data). */}
        {jsonLdNodes.map((node, i) => (
          <script
            key={`ld-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
          />
        ))}
        {/* Cloak (before paint): when Arabic is active, hide the page until the
            first-party translator has swapped the text in, so the visitor never
            sees the English→Arabic reflow. Force-reveal after 3s so the page can
            never get stuck hidden if translation is slow or fails. */}
        <script
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(/(?:^|;\\s*)locale=ar/.test(document.cookie)){document.documentElement.classList.add("gt-cloak");setTimeout(function(){document.documentElement.classList.remove("gt-cloak");},3000);}}catch(e){}})();`,
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
            __html: `(function(){var h=function(e){if(window.__lsHydrated||window.__lsFallbackFired)return;var t=e.target;var btn=t&&t.closest?t.closest("[data-lang-switch]"):null;if(!btn)return;window.__lsFallbackFired=true;e.preventDefault();var toAr=!/(?:^|;\\s*)locale=ar/.test(document.cookie);var host=window.location.hostname;if(toAr){document.cookie="locale=ar; path=/; max-age=31536000; SameSite=Lax";document.cookie="googtrans=/en/ar; path=/; SameSite=Lax";document.cookie="googtrans=/en/ar; path=/; domain="+host+"; SameSite=Lax";}else{document.cookie="locale=en; path=/; max-age=31536000; SameSite=Lax";var ds=["","; domain="+host,"; domain=."+host];for(var i=0;i<ds.length;i++){document.cookie="googtrans=; path=/; max-age=0"+ds[i];}}setTimeout(function(){window.location.reload();},50);};document.addEventListener("click",h,true);document.addEventListener("pointerup",h,true);document.addEventListener("touchend",h,true);})();`,
          }}
        />
        <UtmCapture />
        <CustomCursor />
        <GoogleTranslate />
        <ArabicOverrides />
        <PagePreviewBanner />
        {children}
        {/* Analytics / tracking (GTM etc.) + embed overlay — injected from the
            CMS (Settings → tracking.head_script / body_script), so editing the
            tag in the dashboard reflects site-wide with no code change. */}
        <TrackingScripts head={headTracking} body={bodyTracking} />
      </body>
    </html>
  );
}
