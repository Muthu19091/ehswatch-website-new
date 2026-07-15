import Navbar from "@/components/layout/Navbar";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SupportHero from "@/components/sections/SupportHero";
import SupportContact from "@/components/sections/SupportContact";
import SupportMap from "@/components/sections/SupportMap";
import { getPage, getForm, getSettings } from "@/lib/api";
import { findBlock } from "@/lib/blocks";
import { robotsFrom } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const pageRes = await getPage("support").catch(() => null);
  const meta = (pageRes?.data as { attributes?: { meta?: { meta_title?: string; meta_description?: string; robots?: string } } } | undefined)?.attributes?.meta;
  return {
    robots: robotsFrom(meta?.robots),
    title: meta?.meta_title || "Support — EHSWatch",
    description:
      meta?.meta_description ||
      "Get in touch with the EHSWatch team for demos, onboarding support, or to find out how we can help your organisation.",
  };
}

export default async function SupportPage() {
  const [pageRes, settingsRes] = await Promise.all([
    getPage("support").catch(() => null),
    getSettings().catch(() => null),
  ]);
  // CMS page record must be published — drafts and missing records 404
  if (!pageRes?.data) notFound();

  const blocks = (pageRes?.data as { attributes?: { content?: Array<{ type: string; data: Record<string, unknown> }> } } | undefined)?.attributes?.content ?? [];
  const contact = (settingsRes?.data as { contact?: { email?: string; phone?: string; address?: string } } | undefined)?.contact;

  // ── hero block ──
  const heroBlock = findBlock<{ eyebrow?: string; headline?: string; subheadline?: string }>(blocks, "hero");

  // ── form_embed block (heading/copy + which CMS form to render) ──
  const formEmbed = findBlock<{ heading?: string; subheading?: string; description?: string; form_slug?: string }>(blocks, "form_embed");
  const formSlug = formEmbed?.form_slug ?? "support";
  // null means the CMS form is disabled → SupportContact hides the form column
  const formRes = await getForm(formSlug).catch(() => null);
  const formAttrs = formRes?.data?.attributes ?? null;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <SupportHero
          cmsEyebrow={heroBlock?.eyebrow || undefined}
          cmsHeadline={heroBlock?.headline || undefined}
          cmsSubheadline={heroBlock?.subheadline || undefined}
        />
        <SupportContact
          heading={formEmbed?.heading || undefined}
          subheading={formEmbed?.subheading || formEmbed?.description || undefined}
          contactEmail={contact?.email}
          contactPhone={contact?.phone}
          contactAddress={contact?.address}
          formAttrs={formAttrs}
          formSlug={formSlug}
        />
        <SupportMap address={contact?.address} />
      </main>
      <Footer />
    </>
  );
}
