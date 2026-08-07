"use client";

import { useEffect } from "react";

/**
 * Injects the CMS-managed tracking markup (Settings → tracking.head_script /
 * body_script) into the live document. The CMS stores arbitrary HTML — inline
 * <script>, external <script src>, GTM snippets — so we parse it and recreate
 * real <script> nodes (setting innerHTML alone would NOT execute them). Runs
 * once per page load. Editing the tag in the CMS now reflects site-wide.
 */
function inject(html: string, target: HTMLElement, marker: string) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  Array.from(tpl.content.childNodes).forEach((node) => {
    if (node.nodeName === "SCRIPT") {
      const orig = node as HTMLScriptElement;
      const s = document.createElement("script");
      Array.from(orig.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.text = orig.textContent || "";
      s.setAttribute("data-cms-tracking", marker);
      target.appendChild(s);
    } else {
      const clone = node.cloneNode(true);
      target.appendChild(clone);
    }
  });
}

export default function TrackingScripts({
  head,
  body,
}: {
  head?: string | null;
  body?: string | null;
}) {
  useEffect(() => {
    const w = window as unknown as { __cmsTrackingInjected?: boolean };
    if (w.__cmsTrackingInjected) return;
    w.__cmsTrackingInjected = true;
    try {
      if (head && head.trim()) inject(head, document.head, "head");
      if (body && body.trim()) inject(body, document.body, "body");
    } catch {
      /* never let a bad tracking snippet break the page */
    }
  }, [head, body]);

  return null;
}
