import { NextResponse } from "next/server";
import { getSettings } from "@/lib/api";

export const runtime = "nodejs";
export const revalidate = 3600;

/**
 * Favicon proxy.
 *
 * Site Settings lets the client upload a favicon in the CMS (BUG-154), but
 * that file lives on cms.ehswatch.com, which disallows ALL crawling via
 * robots.txt — so Google can never fetch an icon linked straight to that
 * domain, no matter how often it re-crawls the homepage. Serving the same
 * bytes from here (ehswatch.com, which Google can crawl) keeps the CMS
 * editable while making the icon actually indexable.
 */
export async function GET(request: Request) {
  const isApple = new URL(request.url).searchParams.get("v") === "apple";
  const fallbackPath = isApple ? "/images/apple-touch-icon.png" : "/images/favicon-96.png";

  const settingsRes = await getSettings().catch(() => null);
  const data = settingsRes?.data as {
    brand?: {
      favicon?: { attributes?: { url?: string; mime_type?: string } };
      apple_touch_icon?: { attributes?: { url?: string; mime_type?: string } };
    };
  } | null;
  const fav = (isApple ? data?.brand?.apple_touch_icon : data?.brand?.favicon)?.attributes;

  if (!fav?.url) {
    return NextResponse.redirect(new URL(fallbackPath, request.url));
  }

  const upstream = await fetch(fav.url, { next: { revalidate: 3600 } }).catch(() => null);
  if (!upstream?.ok) {
    return NextResponse.redirect(new URL(fallbackPath, request.url));
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    headers: {
      "Content-Type": fav.mime_type || upstream.headers.get("content-type") || "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
