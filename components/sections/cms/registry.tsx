import type { ComponentType } from "react";
import CmsHero from "@/components/sections/cms/CmsHero";
import CmsRichText from "@/components/sections/cms/CmsRichText";

/**
 * Props every registered section component receives. `pageMap` (page
 * id → slug) lets a component resolve a LinkPicker "internal" CTA to
 * a real href via lib/cmsLink's resolveLink() — components that don't
 * have any CTA fields (like CmsRichText) just ignore it.
 */
export type CmsSectionProps = {
  data: Record<string, unknown>;
  pageMap?: Record<number, string>;
};

/**
 * content[].type → the component that renders it. Deliberately small
 * today — only the two block types the CMS's "blank" page template
 * seeds (hero, rich_text). Add an entry here as each additional
 * SectionRegistry block type gets a real FE component; an
 * unregistered type is skipped rather than crashing the page (see
 * CmsPageContent), so adding new mappings over time is additive and
 * safe.
 */
export const CMS_SECTION_REGISTRY: Record<string, ComponentType<CmsSectionProps>> = {
  hero: CmsHero,
  rich_text: CmsRichText,
};
