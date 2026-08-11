import ContactTemplate, { contactMetadata } from "@/components/templates/ContactTemplate";
export const dynamic = "force-dynamic";
export function generateMetadata() { return contactMetadata("contact-us"); }
export default function ContactUsPage() { return <ContactTemplate slug="contact-us" />; }
