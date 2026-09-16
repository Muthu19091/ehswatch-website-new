import { NextRequest, NextResponse } from "next/server";

const CMS_BASE = process.env.CMS_API_SSR_BASE || "https://cmsapi.ehswatch.com/api/v1";

/**
 * Bespoke-page previews keep their tokenised URL.
 *
 * /preview/page/<slug>?token=…&exp=… used to bounce through
 * /api/preview-page which 302'd to the live page path — the address bar
 * lost the token, so the link stopped being shareable/reloadable once the
 * cookie expired. Instead: verify the token here, inject the preview
 * cookie into THIS request, and rewrite (not redirect) to the real page
 * route. The browser stays on the preview URL with all its parameters.
 *
 * Scoped strictly to /preview/page/* — no other route goes through here.
 */
export const config = {
  matcher: "/preview/page/:slug*",
};

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const slug = decodeURIComponent(
    nextUrl.pathname.replace(/^\/preview\/page\//, "").replace(/\/$/, ""),
  );
  const token = nextUrl.searchParams.get("token");
  const exp = nextUrl.searchParams.get("exp");

  // Missing pieces → fall through to the existing preview route, which
  // routes into /api/preview-page and produces the proper error message.
  if (!slug || !token || !exp) return NextResponse.next();

  // Verify against the CMS before trusting anything
  try {
    const res = await fetch(
      `${CMS_BASE}/preview/page/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}&exp=${encodeURIComponent(exp)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return NextResponse.next();
  } catch {
    return NextResponse.next();
  }

  const target = nextUrl.clone();
  target.pathname = slug === "home" ? "/" : `/${slug}/`;
  target.search = "";

  // getPage() reads the page_preview cookie from the incoming request —
  // inject it for this first render so no reload is needed.
  const cookiePayload = JSON.stringify({ slug, token, exp });
  const headers = new Headers(request.headers);
  const existing = headers.get("cookie");
  // A browser that already holds a page_preview cookie from an earlier
  // preview visit (lives up to 1hr — very plausible after clicking a
  // couple of preview links in one session) would otherwise end up with
  // TWO page_preview= entries in this header once the fresh one below is
  // appended; cookie parsers conventionally take the FIRST match, so the
  // stale cookie silently won over a genuinely fresh token — confirmed:
  // a brand-new preview link rendered the old draft content, not the
  // current one. Strip any existing page_preview entry first so only
  // the fresh value this request just verified can ever be read.
  const strippedCookie = (existing ?? "")
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c && !c.startsWith("page_preview="))
    .join("; ");
  headers.set(
    "cookie",
    `${strippedCookie ? strippedCookie + "; " : ""}page_preview=${encodeURIComponent(cookiePayload)}`,
  );

  const response = NextResponse.rewrite(target, { request: { headers } });
  // Persist for in-site navigation away and back; dies with the token TTL
  response.cookies.set("page_preview", cookiePayload, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });
  response.headers.set("X-Robots-Tag", "noindex,nofollow");
  return response;
}
