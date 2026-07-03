export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ModuleTemplate from "@/components/sections/ModuleTemplate";
import { getProductModule, getProductModules } from "@/lib/api";
import { buildModuleTemplateProps } from "@/lib/moduleContent";
import { robotsFrom } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductModule(slug);
  const mod = res?.data?.attributes;
  if (!mod) return { title: "Module | EHSWatch" };
  return {
    robots: robotsFrom(mod.meta?.robots),
    title: mod.meta?.meta_title || `${mod.name.trim()} | EHSWatch`,
    description: mod.meta?.meta_description || mod.tagline || mod.description || undefined,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [res, allRes] = await Promise.all([
    getProductModule(slug),
    getProductModules(),
  ]);

  const mod = res?.data?.attributes;
  if (!mod || mod.status !== "active") notFound();

  const templateProps = buildModuleTemplateProps(mod, slug, allRes?.data ?? []);

  return (
    <>
      <Navbar lightHero />
      <main>
        <ModuleTemplate {...templateProps} />
      </main>
      <Footer />
    </>
  );
}
