import LegalPage, { legalMetadata } from "@/components/sections/LegalPage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return legalMetadata("cookie-policy", "Cookie Policy");
}

export default function Page() {
  return <LegalPage slug="cookie-policy" fallbackTitle="Cookie Policy" />;
}
