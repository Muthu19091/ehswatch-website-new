import { NextRequest, NextResponse } from "next/server";
import { safeForwardedHost } from "@/lib/safeHost";

const CMS_BASE = process.env.CMS_API_SSR_BASE || "https://cmsapi.ehswatch.com/api/v1";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Page slug → frontend route
function pagePath(slug: string): string {
  return slug === "home" ? "/" : `/${slug}/`;
}

/**
 * GET /api/preview-page?slug=…&token=…&exp=…
 *
 * Verifies the signed preview token against the CMS, then sets a short-lived
 * httpOnly cookie and redirects to the real page route. getPage() sees the
 * cookie and fetches draft content from the token-gated preview endpoint —
 * so the bespoke page renders its actual design with unpublished content.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const exp = request.nextUrl.searchParams.get("exp") ?? "";

  const fail = (msg: string) =>
    new NextResponse(msg, { status: 403, headers: { "X-Robots-Tag": "noindex,nofollow" } });

  if (!slug || !token || !exp) return fail("Preview link is missing its token.");

  // Verify against the CMS before trusting anything
  try {
    const res = await fetch(
      `${CMS_BASE}/preview/page/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}&exp=${encodeURIComponent(exp)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return fail("Preview link is invalid or has expired. Generate a fresh link from the CMS.");
  } catch {
    return fail("Could not reach the CMS to verify the preview link. Try again.");
  }

  // Build the redirect from forwarded headers so the host matches what the
  // visitor's browser is on (behind nginx, request.url is the bind address).
  // safeForwardedHost checks the header against an allowlist first — these
  // headers are client-controlled, and building a redirect target from them
  // unchecked is an open-redirect vector.
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = safeForwardedHost(
    request.headers.get("x-forwarded-host"),
    request.headers.get("host"),
  );
  const target = `${proto}://${host}${BASE_PATH}${pagePath(slug)}`;
  const response = NextResponse.redirect(target);
  response.cookies.set("page_preview", JSON.stringify({ slug, token, exp }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Cookie dies with the token (CMS TTL is 1h); cap at 1h regardless
    maxAge: 3600,
  });
  response.headers.set("X-Robots-Tag", "noindex,nofollow");
  return response;
}
