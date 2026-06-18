"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** Trigger threshold (0–1). Default 0.15 */
  threshold?: number;
  /** Re-fire each time the element re-enters the viewport. Default false */
  repeat?: boolean;
  /** Root margin (e.g. "0px 0px -10% 0px") */
  rootMargin?: string;
}

/**
 * Detects when an element enters the viewport.
 * Returns a ref to attach + a boolean `inView` state.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.10,
  repeat = false,
  rootMargin = "0px",
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!repeat) observer.unobserve(node);
        } else if (repeat) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, repeat, rootMargin]);

  return { ref, inView };
}
