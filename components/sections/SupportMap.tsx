export default function SupportMap({ address }: { address?: string | null } = {}) {
  // CMS-only: the map is driven by the CMS Settings → Contact address. With no
  // address configured there is nothing to map, so the section is hidden.
  const query = address?.trim() || "";
  if (!query) return null;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <section className="bg-white pb-12 md:pb-20 px-4 md:px-6">
      <div className="max-w-[1160px] mx-auto">
        <div
          className="w-full rounded-[16px] overflow-hidden border border-[#e2e8f0]"
          style={{ height: "420px", boxShadow: "0 2px 16px rgba(20,31,56,0.06)" }}
        >
          <iframe
            title={`EHSWatch — ${query}`}
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
