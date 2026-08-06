// Client-side bookmark store backed by localStorage. Blog posts write here via
// toggleBookmark; the header BookmarksMenu reads + subscribes. A custom event
// keeps every mounted consumer in sync within the tab, and the native `storage`
// event syncs across tabs. All functions are SSR-safe (no-op without window).

export interface Bookmark {
  slug: string;
  title: string;
  url: string;
  savedAt: number;
}

const KEY = "ehswatch_bookmarks";
const EVENT = "ehswatch:bookmarks";

export function getBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? (arr as Bookmark[]) : [];
  } catch {
    return [];
  }
}

function persist(list: Bookmark[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota exceeded / storage blocked — ignore */
  }
  // Notify same-tab consumers (storage event only fires in *other* tabs).
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().some((b) => b.slug === slug);
}

/** Toggle a post's bookmark. Returns the new state (true = now bookmarked). */
export function toggleBookmark(item: Omit<Bookmark, "savedAt">): boolean {
  const list = getBookmarks();
  const idx = list.findIndex((b) => b.slug === item.slug);
  if (idx >= 0) {
    list.splice(idx, 1);
    persist(list);
    return false;
  }
  list.unshift({ ...item, savedAt: Date.now() });
  persist(list);
  return true;
}

export function removeBookmark(slug: string) {
  persist(getBookmarks().filter((b) => b.slug !== slug));
}

/** Subscribe to bookmark changes (same tab + cross tab). Returns unsubscribe. */
export function subscribeBookmarks(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
