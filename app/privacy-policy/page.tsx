import LegalPage, { legalMetadata } from "@/components/sections/LegalPage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return legalMetadata("privacy-policy", "Privacy Policy");
}

export default function Page() {
  return <LegalPage slug="privacy-policy" fallbackTitle="Privacy Policy" />;
}
