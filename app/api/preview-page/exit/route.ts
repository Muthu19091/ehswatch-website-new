import { NextRequest, NextResponse } from "next/server";
import { safeForwardedHost } from "@/lib/safeHost";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function pagePath(slug: string): string {
  return slug === "home" ? "/" : `/${slug}/`;
}

/**
 * GET /api/preview-page/exit — clears the draft-preview cookie and sends the
 * visitor back to the page's public URL (which 404s if it's still a draft).
 */
export async function GET(request: NextRequest) {
  let slug = "home";
  const raw = request.cookies.get("page_preview")?.value;
  if (raw) {
    try {
      let decoded = raw;
      try { decoded = decodeURIComponent(raw); } catch { /* already decoded */ }
      slug = (JSON.parse(decoded) as { slug?: string })?.slug || "home";
    } catch { /* fall back to home */ }
  }

  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = safeForwardedHost(
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
  );
  const target = `${proto}://${host}${BASE_PATH}${pagePath(slug)}`;

  const response = NextResponse.redirect(target);
  response.cookies.set("page_preview", "", { path: "/", maxAge: 0 });
  return response;
}
