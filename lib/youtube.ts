/**
 * Extracts a YouTube video id from any of the URL shapes the CMS's
 * HeroBlock "External video URL" field accepts (validated BE-side
 * against `/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i`, so any
 * of watch?v=, youtu.be/, embed/, shorts/ can show up).
 */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
      if (m) return m[2];
    }
    return null;
  } catch {
    return null;
  }
}

/** Autoplaying, muted, looping, chromeless embed — for a background video, not a player the visitor interacts with. */
export function youtubeBackgroundEmbedUrl(url: string): string | null {
  const id = youtubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id,
    controls: '0',
    showinfo: '0',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
