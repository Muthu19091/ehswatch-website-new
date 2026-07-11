import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SupportHero from "@/components/sections/SupportHero";
import SupportContact from "@/components/sections/SupportContact";
import SupportMap from "@/components/sections/SupportMap";
import { getSettings } from "@/lib/api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support — EHSWatch",
  description: "Get in touch with the EHSWatch team for demos, onboarding support, or to find out how we can help your organisation.",
};

export default async function SupportPage() {
  const settingsRes = await getSettings();
  const contact = (settingsRes?.data as { contact?: { email?: string; phone?: string; address?: string } } | undefined)?.contact;

  return (
    <>
      <Navbar lightHero={true} />
      <main>
        <SupportHero />
        <SupportContact
          contactEmail={contact?.email}
          contactPhone={contact?.phone}
          contactAddress={contact?.address}
        />
        <SupportMap />
      </main>
      <Footer />
    </>
  );
}
