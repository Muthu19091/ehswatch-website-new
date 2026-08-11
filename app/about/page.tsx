import AboutTemplate, { aboutMetadata } from "@/components/templates/AboutTemplate";
export const dynamic = "force-dynamic";
export function generateMetadata() { return aboutMetadata("about"); }
export default function AboutPage() { return <AboutTemplate slug="about" />; }
