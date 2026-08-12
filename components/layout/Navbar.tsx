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
  // Dropdown children are explicitly curated in the CMS header nav, so they are
  // NOT filtered by their target page's show_in_header toggle (that toggle only
  // governs auto top-level insertion + top-level page links). This lets an editor
  // add a child (e.g. a Terms link under Resources) even when that page is hidden
  // from the top-level header.
  const filteredNav = cmsNav
    .filter((item) => (item.hasDropdown ? (item.children?.length ?? 0) > 0 : navLinkVisible(item.href, navFlags, "header")));

  // A page with show_in_header enabled is auto-added to the header as a top-level
  // link — but if it also lives inside a dropdown (e.g. Blogs / Case Studies under
  // Resources), it would appear twice. Drop the top-level duplicate so it shows
  // under the dropdown only.
  const normHref = (h?: string) => (h ?? "").replace(/[#?].*$/, "").replace(/\/+$/, "").toLowerCase() || "/";
  const normLabel = (l?: string) => (l ?? "").replace(/\s+/g, " ").trim().toLowerCase();
  const labelOf = (it: unknown) => normLabel((it as { label?: string }).label);
  const childHrefs = new Set(
    filteredNav.flatMap((it) => (it.children ?? []).map((c) => normHref(c.href))),
  );

  // Paths that map to a CURRENTLY-EXISTING page, so a nav link left pointing at
  // an OLD slug after a rename can be recognised as stale.
  const currentPaths = new Set(
    (((pageListRes as { data?: Array<{ attributes?: { slug?: string } }> } | null)?.data) ?? [])
      .map((pg) => normHref("/" + String(pg?.attributes?.slug ?? "").replace(/^\/+/, "")))
      .filter((h) => h !== "/"),
  );

  // Per label, choose the href to actually render: prefer one that points at a
  // current page over a stale old-slug link. Renaming a page leaves the old nav
  // link behind (a duplicate); this makes the SURVIVING entry resolve to the
  // live slug even when the first CMS entry still holds the pre-rename URL.
  const hrefByLabel = new Map<string, string>();
  for (const it of filteredNav) {
    if (it.hasDropdown) continue;
    const lbl = labelOf(it);
    if (!lbl) continue;
    const cur = hrefByLabel.get(lbl);
    if (cur === undefined || (!currentPaths.has(normHref(cur)) && currentPaths.has(normHref(it.href)))) {
      hrefByLabel.set(lbl, it.href);
    }
  }

  // Drop a top-level link when the same page already appears in a dropdown, when
  // the same href repeats, or when the label repeats — keeping the FIRST
  // position but swapping in the current-page href chosen above, so a stale
  // duplicate can never be the one that survives.
  const seenTop = new Set<string>();
  const seenLabel = new Set<string>();
  const dedupedNav = filteredNav.flatMap((it) => {
    if (it.hasDropdown) return [it];
    const lbl = labelOf(it);
    const href = lbl && hrefByLabel.has(lbl) ? (hrefByLabel.get(lbl) as string) : it.href;
    const h = normHref(href);
    if (childHrefs.has(h)) return [];
    if (seenTop.has(h)) return [];
    if (lbl && seenLabel.has(lbl)) return [];
    seenTop.add(h);
    if (lbl) seenLabel.add(lbl);
    return [href === it.href ? it : { ...it, href }];
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
