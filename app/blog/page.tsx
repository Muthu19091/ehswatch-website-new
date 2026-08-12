import BlogTemplate, { blogMetadata } from "@/components/templates/BlogTemplate";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return blogMetadata("blog");
}

// Thin wrapper — the listing body lives in BlogTemplate so the catch-all can
// render it at a renamed slug too. BlogTemplate redirects /blog → /<newslug>.
export default function BlogPage() {
  return <BlogTemplate slug="blog" />;
}
