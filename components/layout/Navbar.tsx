import { getHeader, getBlogPosts, getCaseStudies, getSettings, getPageList } from "@/lib/api";
import { normalizeUrl, resolveHref, buildPageMap } from "@/lib/blocks";
import { buildNavFlags, navLinkVisible } from "@/lib/navVisibility";
import NavbarClient from "./NavbarClient";

function extractCover(item: any): string | undefined {
  const cover = item?.attributes?.cover;
  return cover?.attributes?.url ?? cover?.url ?? undefined;
}

export default async function Navbar({ lightHero }: { lightHero?: boolean }) {
  const [header, blogRes, csRes, settingsRes, pageListRes] = await Promise.all([
    getHeader(),
    getBlogPosts().catch(() => null),
    getCaseStudies().catch(() => null),
    getSettings().catch(() => null),
    getPageList().catch(() => null),
  ]);
  // Resolve internal nav items that reference a page by id (e.g. Contact Us).
  const pageMap = buildPageMap((pageListRes as any)?.data);

  const mainNav = (header?.data as any)?.attributes?.main_nav ?? [];
  const ctas    = (header?.data as any)?.attributes?.ctas ?? [];

  /* Latest cover images — first item in list that actually has one */
  const latestBlogCover = (blogRes?.data ?? []).map(extractCover).find(Boolean) as string | undefined;
  const latestCsCover   = (csRes?.data   ?? []).map(extractCover).find(Boolean) as string | undefined;

  const cmsNav = (mainNav as any[]).map((item: any) => {
    let children: { label: string; href: string; desc?: string; img?: string }[] | undefined;

    if (item.type === "dropdown" && Array.isArray(item.children)) {
      children = (item.children as any[]).map((c: any) => {
        const rawHref = c.url ? normalizeUrl(c.url as string) : "#";

        /* Blog child — force link to listing page, show latest blog cover */
        if (/^\/blog(\/|$)/.test(rawHref)) {
          return {
            label: c.label as string,
            href:  "/blog",
            desc:  c.description as string | undefined,
            img:   latestBlogCover,
          };
        }

        /* Case-studies child — force link to listing page, show latest CS cover */
        if (/^\/case-studies(\/|$)/.test(rawHref)) {
          return {
            label: c.label as string,
            href:  "/case-studies",
            desc:  c.description as string | undefined,
            img:   latestCsCover,
          };
        }

        return {
          label: c.label as string,
          href:  rawHref,
          desc:  c.description as string | undefined,
          img:   undefined,
        };
      });
    }

    return {
      label:        item.label as string,
      href:         item.type === "dropdown" ? "#" : resolveHref(item, pageMap),
      hasDropdown:  item.type === "dropdown",
      // All nav links stay visible when the navbar collapses on scroll
      // (the last link, e.g. Support, must remain in the header).
      hideOnScroll: false,
      newTab: item.open_in_new_tab === true,
      children,
    };
  });

  const firstCta = (ctas as any[])[0];
  const cmsCta = firstCta
    ? { label: firstCta.label as string, href: firstCta.url ? normalizeUrl(firstCta.url as string) : "#" }
    : undefined;
  // ALL header CTAs (not just the first) so multiple CTAs render.
  const cmsCtas = (ctas as any[])
    .filter((c) => (c?.label ?? "").toString().trim())
    .map((c) => ({
      label: c.label as string,
      href: c.url ? normalizeUrl(c.url as string) : "#",
      style: (c.style as string) || "primary",
      newTab: c.open_in_new_tab === true,
    }));
  const shrinkOnScroll = (header?.data as any)?.attributes?.behaviour?.shrink_on_scroll !== false;
  const transparentOnTop = (header?.data as any)?.attributes?.behaviour?.transparent_on_top === true;

  /* Logo: CMS header editor first; otherwise the Site Settings brand header
     logo (both resolved to URLs by the CMS). No hardcoded logo fallback. */
  const attrs = (header?.data as any)?.attributes;
  const brand = (settingsRes?.data as any)?.brand;
  // header logo URL only — the Settings brand.header_logo is a media ID, not a
  // URL, so it can never be a valid <img src>; drop it as a fallback.
  const logoUrl = attrs?.logo?.attributes?.url ?? attrs?.logo?.url;
  const cmsLogo = logoUrl
    ? {
        url: logoUrl as string,
        alt: (attrs?.logo_alt as string) || (brand?.name as string) || undefined,
        href: (attrs?.logo_url as string) || undefined,
      }
    : undefined;

  // Toggle-driven header visibility: a page link is hidden when its
  // show_in_header is off (once toggles are in use). Dropdowns drop hidden
  // children and vanish if empty. External/anchor/custom links always show.
  const navFlags = buildNavFlags((pageListRes as { data?: unknown } | null)?.data);
  const filteredNav = cmsNav
    .map((item) =>
      item.children
        ? { ...item, children: item.children.filter((c) => navLinkVisible(c.href, navFlags, "header")) }
        : item,
    )
    .filter((item) => (item.hasDropdown ? (item.children?.length ?? 0) > 0 : navLinkVisible(item.href, navFlags, "header")));

  // A page with show_in_header enabled is auto-added to the header as a top-level
  // link — but if it also lives inside a dropdown (e.g. Blogs / Case Studies under
  // Resources), it would appear twice. Drop the top-level duplicate so it shows
  // under the dropdown only.
  const normHref = (h?: string) => (h ?? "").replace(/[#?].*$/, "").replace(/\/+$/, "").toLowerCase() || "/";
  const childHrefs = new Set(
    filteredNav.flatMap((it) => (it.children ?? []).map((c) => normHref(c.href))),
  );
  // Drop a top-level link when the same page already appears in a dropdown, AND
  // when the same page appears more than once at the top level (a manual link +
  // an auto-added show_in_header link both point at it). Keep the first.
  const seenTop = new Set<string>();
  const dedupedNav = filteredNav.filter((it) => {
    if (it.hasDropdown) return true;
    const h = normHref(it.href);
    if (childHrefs.has(h)) return false;
    if (seenTop.has(h)) return false;
    seenTop.add(h);
    return true;
  });

  return (
    <NavbarClient
      lightHero={lightHero}
      cmsNav={dedupedNav.length > 0 ? dedupedNav : undefined}
      cmsCta={cmsCta}
      cmsCtas={cmsCtas.length > 0 ? cmsCtas : undefined}
      cmsLogo={cmsLogo}
      shrinkOnScroll={shrinkOnScroll}
      transparentOnTop={transparentOnTop}
    />
  );
}
