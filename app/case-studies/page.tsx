import CaseStudiesTemplate, { caseStudiesMetadata } from "@/components/templates/CaseStudiesTemplate";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return caseStudiesMetadata("case-studies");
}

export default function CaseStudiesPage() {
  return <CaseStudiesTemplate slug="case-studies" />;
}
