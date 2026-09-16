/**
 * Data-driven Rich Text section for CMS-authored pages
 * (content[].type === "rich_text") — a CKEditor-authored HTML body,
 * optionally with a heading/subheading above it.
 *
 * The Body field's CKEditor toolbar (full profile — Source, H1-H6,
 * font family/size/color/highlight, tables, images, blockquote, lists
 * incl. checklist, alignment) is much richer than any other CKEditor
 * field in the CMS, so every tag it can actually produce needs a real
 * style here. font-family/font-size/font-color/highlight are emitted
 * by CKEditor as inline `style` attributes (its default behaviour,
 * not classes), so they render correctly with zero extra CSS — inline
 * styles always win the cascade over these Tailwind arbitrary-variant
 * rules regardless, so there's no conflict to guard against.
 *
 * No @tailwindcss/typography plugin is installed in this project, so
 * the markup is styled with Tailwind's `[&_selector]` arbitrary-variant
 * syntax instead of a separate prose stylesheet.
 */
export interface CmsRichTextProps {
  data: Record<string, unknown>;
  pageMap?: Record<number, string>; // accepted for CmsSectionProps compatibility; this block has no CTA field to resolve
}

const HEADING_FONT = "font-[family-name:var(--font-gothic-a1)] font-bold text-gray-900";

const BODY_CLASSES = [
  "font-[family-name:var(--font-dm-sans)] text-[15px] sm:text-[16px] leading-[1.75] text-gray-700 overflow-x-hidden",

  // Headings — full h1-h6, not just h2/h3. Body itself already sits
  // below an optional section <h2> (the block's own "Title" field),
  // so an editor-inserted <h1> inside the body is sized just under
  // that section heading rather than competing with it.
  `[&_h1]:${HEADING_FONT} [&_h1]:text-[30px] [&_h1]:mt-9 [&_h1]:mb-4 [&_h1]:leading-[1.2]`,
  `[&_h2]:${HEADING_FONT} [&_h2]:text-[24px] [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:leading-[1.25]`,
  `[&_h3]:${HEADING_FONT} [&_h3]:text-[20px] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:leading-[1.3]`,
  `[&_h4]:${HEADING_FONT} [&_h4]:text-[17px] [&_h4]:mt-5 [&_h4]:mb-2`,
  `[&_h5]:${HEADING_FONT} [&_h5]:text-[16px] [&_h5]:mt-4 [&_h5]:mb-2`,
  `[&_h6]:${HEADING_FONT} [&_h6]:text-[15px] [&_h6]:mt-4 [&_h6]:mb-2 [&_h6]:uppercase [&_h6]:tracking-[0.04em]`,

  // Text
  "[&_p]:mb-4 [&_span]:inline",
  "[&_a]:text-[#ff6d00] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#e66200]",
  "[&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through",
  // CKEditor's Highlight plugin marks text with <mark> (background
  // color set inline, per the toolbar comment above) — a default so a
  // highlight is still visible if that inline style is ever missing.
  "[&_mark]:bg-yellow-200 [&_mark]:rounded-[2px] [&_mark]:px-[2px]",

  // Lists — including CKEditor's checklist/todo-list plugin, whose
  // items carry their own checkbox and shouldn't also get a bullet.
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-1.5",
  "[&_ul.todo-list]:list-none [&_ul.todo-list]:pl-0 [&_ul.todo-list_li]:flex [&_ul.todo-list_li]:items-start [&_ul.todo-list_li]:gap-2",

  // Blockquote
  "[&_blockquote]:border-l-4 [&_blockquote]:border-[#ff6d00]/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4",

  // Media — never let an editor-pasted asset break mobile layout.
  "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4",
  "[&_iframe]:max-w-full",

  // Tables — real borders/padding (previously unstyled default
  // browser table look), and each table gets its OWN horizontal
  // scroll container rather than pushing the whole page wide, same
  // pattern as any wide code block.
  "[&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full [&_table]:my-4 [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:whitespace-nowrap",
  "[&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top",

  // Code
  "[&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-gray-100 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5",
  "[&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0",

  // CKEditor's alignment toolbar sets these as classes, not inline styles.
  "[&_.text-align-center]:text-center [&_.text-align-right]:text-right [&_.text-align-justify]:text-justify",
].join(" ");

export default function CmsRichText({ data }: CmsRichTextProps) {
  const heading = str(data.heading);
  const subheading = str(data.subheading);
  const body = str(data.body);
  const maxWidth = str(data.max_width) === "wide" ? "max-w-[900px]" : "max-w-[720px]";

  if (!heading && !subheading && !body) return null;

  return (
    <section className="px-4 sm:px-6 py-[50px] sm:py-[70px] md:py-[90px]">
      <div className={`mx-auto ${maxWidth}`}>
        {heading && (
          <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[26px] sm:text-[32px] md:text-[38px] leading-[1.2] text-gray-900 mb-3">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="font-[family-name:var(--font-dm-sans)] text-[16px] sm:text-[18px] text-gray-600 mb-6">
            {subheading}
          </p>
        )}
        {body && <div className={BODY_CLASSES} dangerouslySetInnerHTML={{ __html: body }} />}
      </div>
    </section>
  );
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
