import { getHeader, getBlogPosts, getCaseStudies } from "@/lib/api";
import { normalizeUrl } from "@/lib/blocks";
import NavbarClient from "./NavbarClient";

function extractCover(item: any): string | undefined {
  const cover = item?.attributes?.cover;
  return cover?.attributes?.url ?? cover?.url ?? undefined;
}

export default async function Navbar({ lightHero }: { lightHero?: boolean }) {
  const [header, blogRes, csRes] = await Promise.all([
    getHeader(),
    getBlogPosts().catch(() => null),
    getCaseStudies().catch(() => null),
  ]);

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
      href:         item.type === "dropdown" ? "#" : (item.url ? normalizeUrl(item.url as string) : "#"),
      hasDropdown:  item.type === "dropdown",
      // All nav links stay visible when the navbar collapses on scroll
      // (the last link, e.g. Support, must remain in the header).
      hideOnScroll: false,
      children,
    };
  });

  const firstCta = (ctas as any[])[0];
  const cmsCta = firstCta
    ? { label: firstCta.label as string, href: firstCta.url ? normalizeUrl(firstCta.url as string) : "#" }
    : undefined;

  /* Logo from the CMS header editor (media url + alt + link) */
  const attrs = (header?.data as any)?.attributes;
  const logoUrl = attrs?.logo?.attributes?.url ?? attrs?.logo?.url;
  const cmsLogo = logoUrl
    ? {
        url: logoUrl as string,
        alt: (attrs?.logo_alt as string) || undefined,
        href: (attrs?.logo_url as string) || undefined,
      }
    : undefined;

  return (
    <NavbarClient
      lightHero={lightHero}
      cmsNav={cmsNav.length > 0 ? cmsNav : undefined}
      cmsCta={cmsCta}
      cmsLogo={cmsLogo}
    />
  );
}
