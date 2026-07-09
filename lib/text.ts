/**
 * Plain-text guard for short CMS fields (labels, titles, subheadings…).
 *
 * Editors sometimes paste or type HTML into single-line fields. Fields that
 * are rendered as text would show the tags literally — browsers never do
 * that. This strips tags and decodes common entities so only the text
 * content survives, exactly like the browser would display it.
 *
 * NOT for rich-text fields (bodies, FAQ answers, text_cta blocks) — those
 * render their HTML via dangerouslySetInnerHTML.
 */
export function stripHtml(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** stripHtml that preserves undefined for optional-prop chains */
export function stripHtmlOpt(value: string | null | undefined): string | undefined {
  const s = stripHtml(value);
  return s || undefined;
}

/**
 * Rich editors escape tags an editor TYPES into them (&lt;p&gt;…), so typed
 * markup would display literally. For rich-text renders we decode escape
 * sequences that look like real HTML tags — so hand-typed markup behaves
 * like HTML — while leaving other escaped text (e.g. "5 &lt; 10") alone.
 */
export function unescapeTypedTags(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/&lt;(\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^&<>]*?)?\/?)&gt;/g, "<$1>");
}
