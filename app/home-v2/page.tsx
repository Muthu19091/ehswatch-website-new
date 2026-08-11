import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroV2 from "@/components/sections/HeroV2";
import TrustedLogos from "@/components/sections/TrustedLogos";
import Stats from "@/components/sections/Stats";
import PainPoints from "@/components/sections/PainPoints";
import OnePlatform from "@/components/sections/OnePlatform";
import AISection from "@/components/sections/AISection";
import WorkEnvironments from "@/components/sections/WorkEnvironments";
import Testimonials from "@/components/sections/Testimonials";
import Blogs from "@/components/sections/Blogs";
import CTABanner from "@/components/sections/CTABanner";
import type { Metadata } from "next";

// Unlinked experimental home variant — keep it out of the index so it
// never competes with "/" for search results.
export const metadata: Metadata = {
  title: "Home — EHSWatch",
  robots: { index: false, follow: false },
};

export default function HomeV2Page() {
  return (
    <>
      <Navbar lightHero />
      <main>
        <HeroV2 />
        <TrustedLogos />
        <Stats />
        <PainPoints />
        <OnePlatform />
        <AISection />
        <WorkEnvironments />
        <Testimonials />
        <Blogs />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
