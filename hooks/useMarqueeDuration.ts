"use client";

import { useEffect, useRef, useState } from "react";

/** Constant crawl speed (px/sec) every marquee strip on the site shares —
 * change this one value and every marquee (homepage logos, module-page
 * client strips, any future one) speeds up/slows down together. */
const MARQUEE_PX_PER_SECOND = 40;

/**
 * A CSS marquee track that duplicates its content N times and slides by
 * `translateX(-100% / N)` moves a DIFFERENT physical pixel distance on every
 * page, because that translate is a percentage of the track's own width --
 * which changes with however many items happen to be on that page (e.g.
 * the homepage's full client-logo pool vs. a module page's smaller curated
 * strip). A fixed animation-duration (e.g. "90s") then covers those
 * different distances in the same time, so the visual speed (px/sec)
 * silently varies page to page even though every page uses the identical
 * animation. This hook measures the actual rendered width of ONE copy and
 * derives the duration needed to hold a single, constant px/sec speed
 * everywhere, no matter how many items or copies are rendered.
 */
export function useMarqueeDuration(copies: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || copies <= 0) return;

    const measure = () => {
      const oneCopyWidth = el.scrollWidth / copies;
      if (oneCopyWidth > 0) {
        setDurationSeconds(oneCopyWidth / MARQUEE_PX_PER_SECOND);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [copies]);

  return { trackRef, durationSeconds };
}
