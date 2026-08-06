"use client";

import { useEffect, useRef, useState } from "react";
import { getBookmarks, removeBookmark, subscribeBookmarks, type Bookmark } from "@/lib/bookmarks";

/**
 * Header bookmarks dropdown. Reads the localStorage bookmark store and stays in
 * sync via subscribeBookmarks (same tab + cross tab). Renders nothing until
 * mounted to avoid an SSR/hydration mismatch (localStorage is client-only).
 */
export default function BookmarksMenu({ lightHero = false }: { lightHero?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Bookmark[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setItems(getBookmarks());
    return subscribeBookmarks(() => setItems(getBookmarks()));
  }, []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) return null;

  const count = items.length;
  const iconColor = lightHero ? "#0a0f1e" : "#0a0f1e";

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Bookmarks"
        aria-expanded={open}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer"
        style={{ color: iconColor }}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M4 2h8a1 1 0 0 1 1 1v11l-5-3-5 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {count > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-white font-[family-name:var(--font-dm-sans)] font-semibold"
            style={{ background: "#FF6D00", fontSize: "10px", lineHeight: 1 }}
          >
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[300px] max-h-[400px] overflow-y-auto rounded-2xl bg-white shadow-xl z-[60] py-2"
          style={{ border: "1px solid #E5E7EB", boxShadow: "0 12px 40px rgba(10,15,30,0.16)" }}
        >
          <p className="px-4 pt-1 pb-2 font-[family-name:var(--font-gothic-a1)] font-bold text-[13px] tracking-wide uppercase" style={{ color: "#9ca3af" }}>
            Bookmarks
          </p>
          {count === 0 ? (
            <p className="px-4 py-4 font-[family-name:var(--font-dm-sans)] text-[13px]" style={{ color: "#6b7280" }}>
              No bookmarks yet. Tap “Bookmark” on any article to save it here.
            </p>
          ) : (
            <ul className="flex flex-col">
              {items.map((b) => (
                <li key={b.slug} className="group flex items-start gap-2 px-4 py-2 hover:bg-[#f9fafb]">
                  <a href={b.url} className="flex-1 min-w-0 no-underline">
                    <span className="block font-[family-name:var(--font-dm-sans)] text-[13.5px] leading-snug line-clamp-2" style={{ color: "#111827" }}>
                      {b.title}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => removeBookmark(b.slug)}
                    aria-label={`Remove bookmark: ${b.title}`}
                    className="shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 cursor-pointer"
                    style={{ color: "#9ca3af" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
