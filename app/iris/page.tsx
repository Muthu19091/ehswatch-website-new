import IrisTemplate, { irisMetadata } from "@/components/templates/IrisTemplate";
export const dynamic = "force-dynamic";
export function generateMetadata() { return irisMetadata("iris"); }
export default function IrisPage() { return <IrisTemplate slug="iris" />; }
