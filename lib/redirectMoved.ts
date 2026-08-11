import { permanentRedirect } from "next/navigation";

// After a CMS slug rename, getPage() follows the slug_history 301 internally and
// returns the renamed page's data at the OLD path (HTTP 200), so the browser URL
// never moves. Compare the requested slug to the canonical slug from the API and
// issue a real browser redirect when they differ. permanentRedirect() throws a
// NEXT_REDIRECT signal — call this OUTSIDE any try/catch so it isn't swallowed.
export function redirectIfMoved(
  requested: string,
  res: { data?: { attributes?: { slug?: string } } } | null,
): void {
  const canonical = res?.data?.attributes?.slug;
  if (canonical && canonical !== requested) {
    permanentRedirect(`/${canonical}`);
  }
}
