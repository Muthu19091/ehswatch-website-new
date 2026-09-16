/**
 * A single rich_text block's body — rendered at its own position in
 * content[] (see LegalPage's own comment on why order matters), not
 * merged with every other rich_text block on the page into one
 * combined string. A page with rich_text → hero → rich_text now
 * genuinely renders three sections in that order, each independently.
 */
export default function LegalPageRichText({ body }: { body: string }) {
  if (!body.trim()) return null;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div
        className="legal-body max-w-[820px] mx-auto px-6 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.8] text-[#374151]"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  );
}
