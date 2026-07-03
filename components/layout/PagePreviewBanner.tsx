import { cookies } from "next/headers";
import { basePath } from "@/lib/basePath";

/**
 * Fixed pill shown while the page_preview cookie is active — makes it obvious
 * the visitor is seeing draft content, and offers a one-click exit that clears
 * the cookie (after which drafts 404 again like for everyone else).
 */
export default async function PagePreviewBanner() {
  let slug: string | null = null;
  try {
    const raw = (await cookies()).get("page_preview")?.value;
    if (raw) {
      let decoded = raw;
      try { decoded = decodeURIComponent(raw); } catch { /* already decoded */ }
      slug = (JSON.parse(decoded) as { slug?: string })?.slug ?? null;
    }
  } catch { /* no valid preview cookie */ }

  if (!slug) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "10px 18px",
        borderRadius: "999px",
        background: "linear-gradient(90deg, #f59e0b, #f97316)",
        boxShadow: "0 8px 30px rgba(249,115,22,0.45)",
        color: "white",
        fontFamily: "var(--font-dm-sans, sans-serif)",
        fontSize: "13px",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      <span>
        DRAFT PREVIEW · <span style={{ opacity: 0.85 }}>{slug}</span>
      </span>
      <a
        href={`${basePath}/api/preview-page/exit`}
        style={{
          background: "rgba(255,255,255,0.22)",
          borderRadius: "999px",
          padding: "5px 12px",
          color: "white",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        Exit preview
      </a>
    </div>
  );
}
