import IndustriesTemplate, { industriesMetadata } from "@/components/templates/IndustriesTemplate";
export const dynamic = "force-dynamic";
export function generateMetadata() { return industriesMetadata("industries"); }
export default function IndustriesPage() { return <IndustriesTemplate slug="industries" />; }
