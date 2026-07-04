import type { Metadata } from "next";
import { DM_Sans, Gothic_A1, Inter, Instrument_Sans } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import PagePreviewBanner from "@/components/layout/PagePreviewBanner";
import GoogleTranslate from "@/components/layout/GoogleTranslate";
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
    icon:     BASE + "/images/EHS%20fav%20icon.svg",
    shortcut: BASE + "/images/EHS%20fav%20icon.svg",
    apple:    BASE + "/images/EHS%20fav%20icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      /* Layout stays LTR — the design's sliders/marquees are LTR-built.
         Arabic text from Google Translate still renders RTL within its own
         lines via the Unicode bidi algorithm. */
      dir="ltr"
      suppressHydrationWarning
      className={`${dmSans.variable} ${gothicA1.variable} ${inter.variable} ${instrumentSans.variable}`}
    >
      <body className="antialiased">
        <CustomCursor />
        <GoogleTranslate />
        <PagePreviewBanner />
        {children}
      </body>
    </html>
  );
}
