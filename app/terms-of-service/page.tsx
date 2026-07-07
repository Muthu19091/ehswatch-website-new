import LegalPage, { legalMetadata } from "@/components/sections/LegalPage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return legalMetadata("terms-of-service", "Terms of Service");
}

export default function Page() {
  return <LegalPage slug="terms-of-service" fallbackTitle="Terms of Service" />;
}
