import LegalPage, { legalMetadata } from "@/components/sections/LegalPage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return legalMetadata("cookie-settings", "Cookie Settings");
}

export default function Page() {
  return <LegalPage slug="cookie-settings" fallbackTitle="Cookie Settings" />;
}
