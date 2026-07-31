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
 * Heading guard for the "half black / half blue" pattern. Editors wrap the
 * part they want highlighted in a <span> (`first half <span>second half</span>`)
 * and this preserves ONLY that span — stripping every other tag and all span
 * attributes for safety — then recolours the span to the brand blue (#1d4ed8).
 * Headings with no <span> come out as plain text, identical to stripHtml, so
 * existing headings are unaffected. Output is safe HTML for
 * dangerouslySetInnerHTML (only a bare, recoloured <span> can survive).
 */
export function headingHtml(value: string | null | undefined): string {
  if (!value) return "";
  const decoded = value
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");
  return decoded
    // Drop every tag except <span>/</span> (removes <p>, <strong>, scripts, …).
    .replace(/<(?!\/?span\b)[^>]*>/gi, "")
    // Sanitise span open tags (strip attributes) and recolour to brand blue.
    // The .hd-hl class lets CSS restore the inline gap in Arabic (RTL), where
    // the machine translator drops the space at the span's edge and glues the
    // adjacent words together (e.g. "النشاطمصمم").
    .replace(/<span\b[^>]*>/gi, '<span class="hd-hl" style="color:#1d4ed8">')
    .replace(/\s+/g, " ")
    .trim();
}

/** headingHtml that preserves undefined for optional-prop chains */
export function headingHtmlOpt(value: string | null | undefined): string | undefined {
  const s = headingHtml(value);
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
