"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import GlareButton from "@/components/ui/GlareButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogItem {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  published_at?: string;
  featured_image_url?: string | null;
}

interface BlogsProps {
  cmsHeading?: string;
  cmsSubheading?: string;
  cmsPosts?: BlogItem[];
  cmsViewAllCta?: { label: string; url: string };
}

interface DisplayBlog {
  img: string | null;
  category: string;
  title: string;
  href: string;
  readTime: string;
  date: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

// Normalise CMS items into the display shape — CMS-only, no placeholder images.
function normalisePosts(cmsPosts: BlogItem[]): DisplayBlog[] {
  return cmsPosts.map((post) => ({
    img:      post.featured_image_url || null,
    category: post.category || "",
    title:    post.title,
    href:     `/blog/${post.slug}`,
    readTime: "",   // not provided by blog_highlights block
    date:     post.published_at ? formatDate(post.published_at) : "",
  }));
}

/* ── Individual card — full-bleed image with overlay content ── */
function BlogCard({ blog }: { blog: DisplayBlog }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={blog.href}
      aria-label={`Read: ${blog.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: 8,
        height: 360,
        boxShadow: hovered
          ? "0 24px 52px rgba(0,0,0,0.28)"
          : "0 4px 16px rgba(0,0,0,0.12)",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "transform 400ms cubic-bezier(.22,1,.36,1), box-shadow 400ms ease",
      }}
    >
      {/* Background image — CMS cover only; neutral brand panel when none (no stock placeholder) */}
      {blog.img ? (
        <Image
          src={blog.img}
          alt={blog.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          // Covers are landscape with left-anchored titles; a portrait card crops
          // ~half the width, so anchor left to keep the text side visible
          className="object-cover object-left"
          style={{
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 700ms cubic-bezier(.22,1,.36,1)",
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0a1628 0%,#1e3a68 100%)" }} />
      )}

      {/* Gradient overlay — subtle at top, strong at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.72) 75%, rgba(0,0,0,0.88) 100%)",
          transition: "opacity 300ms ease",
        }}
      />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 pt-6 flex flex-col gap-2">
        {/* Date + read time */}
        {(blog.date || blog.readTime) && (
          <p className="font-[family-name:var(--font-dm-sans)] text-[10.5px] text-white/60">
            {blog.date}
            {blog.date && blog.readTime && <span className="mx-1.5 text-white/30">•</span>}
            {blog.readTime}
          </p>
        )}

        {/* Title */}
        <h3
          className="font-[family-name:var(--font-gothic-a1)] font-bold text-[15px] leading-[1.38] text-white line-clamp-3"
          style={{ textWrap: "pretty" } as React.CSSProperties}
        >
          {blog.title}
        </h3>

        {/* Read more */}
        <div
          className="mt-1 flex items-center gap-1 font-[family-name:var(--font-dm-sans)] font-semibold text-[12px]"
          style={{
            color: hovered ? "#ff9a5c" : "rgba(255,255,255,0.75)",
            transition: "color 220ms ease",
          }}
        >
          Read more
          <span
            style={{
              display: "inline-block",
              transform: hovered ? "translateX(4px)" : "translateX(0)",
              transition: "transform 260ms ease",
            }}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Section ── */
export default function Blogs({ cmsHeading, cmsSubheading, cmsPosts, cmsViewAllCta }: BlogsProps) {
  // CMS-only: no hardcoded heading/posts/view-all. Hide the section if no posts.
  const heading = cmsHeading?.trim() || "";
  const displayBlogs = (cmsPosts && cmsPosts.length > 0) ? normalisePosts(cmsPosts) : [];
  if (displayBlogs.length === 0) return null;

  // Split heading for blue highlight on "EHSWatch Blog" portion
  const [headingStart, headingHighlight] = heading.includes("EHSWatch")
    ? [heading.split("EHSWatch")[0], "EHSWatch" + heading.split("EHSWatch")[1]]
    : [heading, ""];

  return (
    <section className="bg-[#f8fbff] py-14 md:py-[90px] px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">

        {/* Centred heading */}
        {(heading || cmsSubheading) && (
        <Reveal variant="fade-up" duration={700}>
          <div className="text-center mb-10 md:mb-12">
            {heading && (
            <h2 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] sm:text-[36px] md:text-[42px] leading-[1.1] text-[#0f1728]">
              {headingStart}
              {headingHighlight && (
                <span className="text-[#155eef]">{headingHighlight}</span>
              )}
            </h2>
            )}
            {cmsSubheading && (
              <p className="mt-3 md:mt-4 font-[family-name:var(--font-dm-sans)] text-[15px] md:text-[17px] leading-relaxed text-[#5b6472] max-w-[640px] mx-auto">
                {cmsSubheading}
              </p>
            )}
          </div>
        </Reveal>
        )}

        {/* 4-column card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {displayBlogs.map((blog, i) => (
            <Reveal key={blog.title + i} variant="soft-up" delay={i * 90} duration={800}>
              <BlogCard blog={blog} />
            </Reveal>
          ))}
        </div>

        {/* View All CTA — only when the CMS configures it */}
        {cmsViewAllCta?.label && cmsViewAllCta.url && (
        <Reveal variant="fade-up" duration={600} delay={200}>
          <div className="flex justify-center mt-10 md:mt-12">
            <GlareButton
              href={cmsViewAllCta.url}
              fillColor="#FF6D00"
              hoverTextColor="#ffffff"
              className="gap-2 font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] text-[#ff6d00] border border-[#ffd9b8] bg-white rounded-full px-7 py-3"
            >
              {cmsViewAllCta.label}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </GlareButton>
          </div>
        </Reveal>
        )}

      </div>
    </section>
  );
}
