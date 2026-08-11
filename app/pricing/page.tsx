import PricingTemplate, { pricingMetadata } from "@/components/templates/PricingTemplate";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return pricingMetadata("pricing");
}

export default function PricingPage() {
  return <PricingTemplate slug="pricing" />;
}
