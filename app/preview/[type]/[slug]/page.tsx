export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogPost from "@/components/sections/BlogPost";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";
import ModuleTemplate from "@/components/sections/ModuleTemplate";
import { getPreview, getProductModules } from "@/lib/api";
import { buildModuleTemplateProps } from "@/lib/moduleContent";
import type { CmsBlogPost, CmsCaseStudy, CmsProductModule } from "@/lib/types";

// Draft previews must never be indexed
export const metadata: Metadata = {
  title: "Draft Preview | EHSWatch",
  robots: { index: false, follow: false },
};

function PreviewBanner({ label }: { label: string }) {
  return (
    <div
      className="w-full text-center py-2.5 px-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-white"
      style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)", position: "relative", zIndex: 60 }}
    >
      DRAFT PREVIEW — {label} · This content is not published and this link expires automatically.
    </div>
  );
}

function PreviewError({ message }: { message: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center pt-[120px]">
      <h1 className="font-[family-name:var(--font-gothic-a1)] font-bold text-[28px] text-[#0a0f1e]">
        Preview unavailable
      </h1>
      <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#6b7280] max-w-[420px] leading-[1.7]">
        {message}
      </p>
    </div>
  );
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; slug: string }>;
  searchParams: Promise<{ token?: string; exp?: string }>;
}) {
  const { type, slug } = await params;
  const { token, exp } = await searchParams;

  // Bespoke pages render through their real routes: the preview-page handler
  // verifies the token, sets the preview cookie, and redirects to the page.
  if (type === "page" && token && exp) {
    redirect(
      `/api/preview-page?slug=${encodeURIComponent(slug)}&token=${encodeURIComponent(token)}&exp=${encodeURIComponent(exp)}`,
    );
  }

  let body: React.ReactNode;

  if (!token || !exp) {
    body = <PreviewError message="This preview link is missing its access token. Generate a fresh link from the CMS edit page." />;
  } else if (type === "blog-post") {
    const res = await getPreview<CmsBlogPost>(type, slug, token, exp);
    body = res?.data ? (
      <BlogPost slug={slug} cmsPost={res.data} />
    ) : (
      <PreviewError message="This preview link is invalid or has expired. Generate a fresh link from the CMS edit page." />
    );
  } else if (type === "case-study") {
    const res = await getPreview<CmsCaseStudy>(type, slug, token, exp);
    body = res?.data ? (
      <CaseStudyTemplate slug={slug} cmsStudy={res.data} />
    ) : (
      <PreviewError message="This preview link is invalid or has expired. Generate a fresh link from the CMS edit page." />
    );
  } else if (type === "product-module") {
    const [res, allRes] = await Promise.all([
      getPreview<CmsProductModule>(type, slug, token, exp),
      getProductModules(),
    ]);
    body = res?.data?.attributes ? (
      <ModuleTemplate {...buildModuleTemplateProps(res.data.attributes, slug, allRes?.data ?? [])} />
    ) : (
      <PreviewError message="This preview link is invalid or has expired. Generate a fresh link from the CMS edit page." />
    );
  } else {
    body = (
      <PreviewError
        message={`Visual previews aren't available for "${type}" content. The preview data is still accessible to editors through the CMS API preview endpoint.`}
      />
    );
  }

  return (
    <>
      <PreviewBanner label={`${type} / ${slug}`} />
      <Navbar lightHero />
      <main>{body}</main>
      <Footer />
    </>
  );
}
