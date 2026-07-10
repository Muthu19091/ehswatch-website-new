"use client";

import { useEffect, useRef } from "react";

interface AboutStoryCmsProps {
  cmsHeading?: string | undefined;
  cmsSubheading?: string | undefined;
  cmsBody?: string | undefined;
}

export default function AboutStory({
  cmsHeading,
  cmsSubheading,
  cmsBody,
}: AboutStoryCmsProps = {}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const heading = cmsHeading || "About <span class=\"text-[#155eef]\">EHSWatch</span>";
  const subheading = cmsSubheading || "Two decades of building better safety.";
  const bodyHtml =
    cmsBody ||
    `<p>EHSWatch was built to <strong class="font-semibold text-[#1b1b1b]">eliminate the delays and errors</strong> caused by spreadsheets, paper forms, and disconnected systems — with a single platform that makes safety easier to manage. Designed for real-world EHSQ teams, it brings reporting, actions, visibility and compliance into one streamlined experience.</p>
<p>We understand that safety teams need more than software. They need speed, clarity and confidence. That is why EHSWatch is built to support organisations across industries with a platform that is <strong class="font-semibold text-[#1b1b1b]">practical, intuitive and ready for day-to-day operations</strong>.</p>
<p>With <strong class="font-semibold text-[#1b1b1b]">20+ years of perfecting safety software</strong>, we&apos;ve empowered <strong class="font-semibold text-[#1b1b1b]">25K+ users</strong> to cut reporting time by <strong class="font-semibold text-[#1b1b1b]">60%</strong> while maintaining <strong class="font-semibold text-[#1b1b1b]">95% customer satisfaction</strong>. Built for construction, manufacturing, oil &amp; gas and beyond, EHSWatch turns chaos into clarity — anywhere, anytime.</p>`;

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    // Wrap every word in a <span class="word"> so we can colour them individually
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let n = walker.nextNode();
    while (n) {
      textNodes.push(n as Text);
      n = walker.nextNode();
    }

    textNodes.forEach((tn) => {
      if (!tn.textContent?.trim()) return;
      const parts = tn.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = part;
          span.style.color = "rgba(27,27,27,0.16)";
          span.style.transition = "color 0.12s ease";
          frag.appendChild(span);
        }
      });
      tn.parentNode?.replaceChild(frag, tn);
    });

    const onScroll = () => {
      const rect = body.getBoundingClientRect();
      const wh = window.innerHeight;
      const startOffset = wh * 0.82;
      const endOffset = wh * 0.38;
      const total = rect.height + (startOffset - endOffset);
      const progress = Math.max(0, Math.min(1, (startOffset - rect.top) / total));

      const words = body.querySelectorAll<HTMLSpanElement>(".word");
      const revealCount = Math.floor(progress * words.length);
      words.forEach((w, i) => {
        w.style.color = i < revealCount ? "#1b1b1b" : "rgba(27,27,27,0.16)";
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-white py-[60px] md:py-[100px] lg:py-[120px]">
      <div className="max-w-[1160px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-[1fr_1.25fr] gap-10 md:gap-12 lg:gap-[96px] items-start">

        {/* Sticky left — title */}
        <div className="md:sticky md:top-[120px]">
          <h2
            className="font-[family-name:var(--font-gothic-a1)] font-bold text-[32px] md:text-[40px] leading-[1.12] text-[#1b1b1b] tracking-[-0.03em]"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#9ca3af] leading-relaxed max-w-[260px]">
            {subheading}
          </p>
        </div>

        {/* Scroll-reveal body */}
        <div
          ref={bodyRef}
          className="flex flex-col gap-7 font-[family-name:var(--font-dm-sans)] text-[16px] md:text-[17px] leading-[1.78] tracking-[-0.011em] font-normal [&_p]:mb-0 [&_strong]:font-semibold [&_strong]:text-[#1b1b1b]"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

      </div>
    </section>
  );
}
