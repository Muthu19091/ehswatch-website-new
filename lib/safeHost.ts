// Hosts this app is legitimately served on. X-Forwarded-Host / Host are
// client-controlled — building a redirect target from them unchecked is an
// open-redirect (and, via HTTP header injection, phishing) vector: a request
// can set an arbitrary value and get redirected to https://<that value>/.
const ALLOWED_HOSTS = new Set([
  "ehswatch.com",
  "www.ehswatch.com",
  "stage.ehswatch.com",
  "localhost:3000",
  "localhost:3098",
  "localhost:3099",
]);

/**
 * Resolves the forwarded host for building a same-origin redirect, but only
 * if it's one this app actually runs on. Falls back to the canonical
 * production host otherwise, so a spoofed header can only ever redirect
 * within this site — never off it.
 */
export function safeForwardedHost(forwardedHost: string | null, host: string | null): string {
  const candidate = forwardedHost ?? host;
  if (candidate && ALLOWED_HOSTS.has(candidate)) return candidate;
  return "ehswatch.com";
}
