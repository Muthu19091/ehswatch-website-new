import type { PageSectionBlock } from "@/lib/cms";
import { CMS_SECTION_REGISTRY } from "@/components/sections/cms/registry";

/**
 * Walks a Page's content[] blocks in order and renders each via the
 * matching component in CMS_SECTION_REGISTRY, keyed by block `type`.
 *
 * A block type with no registered component is skipped silently —
 * this project builds via `output: "export"` (no server at runtime),
 * so there's no way to hot-patch a missing mapping; better to render
 * the page minus that one section than fail the whole build. Same
 * reasoning for tolerating a missing/malformed `content` array itself
 * (defaults to none rendered) — every Page in a `next build` run is
 * built together, so one page's bad data shouldn't fail every page's
 * static export.
 */
export default function CmsPageContent({
  content,
  pageMap,
}: {
  content: PageSectionBlock[] | null | undefined;
  pageMap?: Record<number, string>;
}) {
  const blocks = Array.isArray(content) ? content : [];

  return (
    <>
      {blocks.map((block, index) => {
        if (!block || typeof block.type !== "string") return null;

        const Section = CMS_SECTION_REGISTRY[block.type];
        if (!Section) return null;

        return <Section key={`${block.type}-${index}`} data={block.data ?? {}} pageMap={pageMap} />;
      })}
    </>
  );
}
