import type { Metadata } from "next";
import PricingTemplate, { pricingMetadata } from "@/components/templates/PricingTemplate";
import ProductTemplate, { productMetadata } from "@/components/templates/ProductTemplate";
import IrisTemplate, { irisMetadata } from "@/components/templates/IrisTemplate";
import AboutTemplate, { aboutMetadata } from "@/components/templates/AboutTemplate";
import IndustriesTemplate, { industriesMetadata } from "@/components/templates/IndustriesTemplate";
import ContactTemplate, { contactMetadata } from "@/components/templates/ContactTemplate";
import BlogTemplate, { blogMetadata } from "@/components/templates/BlogTemplate";
import CaseStudiesTemplate, { caseStudiesMetadata } from "@/components/templates/CaseStudiesTemplate";

// Maps a page's CMS `template` value → the bespoke React component that renders
// it. The catch-all route (app/[slug]) looks the page's template up here, so a
// renamed page keeps its design at the new slug. Add a new template here after
// creating its <XTemplate slug> component.
type TemplateComponent = (props: { slug: string }) => Promise<React.JSX.Element>;
type TemplateMetadata = (slug: string) => Promise<Metadata>;

export const TEMPLATE_COMPONENTS: Record<string, TemplateComponent> = {
  pricing: PricingTemplate as TemplateComponent,
  product: ProductTemplate as TemplateComponent,
  iris: IrisTemplate as TemplateComponent,
  about: AboutTemplate as TemplateComponent,
  industries: IndustriesTemplate as TemplateComponent,
  contact: ContactTemplate as TemplateComponent,
  blog: BlogTemplate as TemplateComponent,
  "case-studies": CaseStudiesTemplate as TemplateComponent,
};

export const TEMPLATE_METADATA: Record<string, TemplateMetadata> = {
  pricing: pricingMetadata,
  product: productMetadata,
  iris: irisMetadata,
  about: aboutMetadata,
  industries: industriesMetadata,
  contact: contactMetadata,
  blog: blogMetadata,
  "case-studies": caseStudiesMetadata,
};
