import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

const titles: Record<string, string> = {
  fr: "Témoignages | Abdenour Hellas",
  en: "Testimonials | Abdenour Hellas",
  ar: "الشهادات | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Ce que disent collègues et clients d'Abdenour Hellas, ingénieur en génie électrique et développeur web.",
  en: "What colleagues and clients say about Abdenour Hellas, electrical engineer and web developer.",
  ar: "آراء الزملاء والعملاء حول عبد النور حلاس، مهندس كهربائي ومطور ويب.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/testimonials", titles, descriptions });
}

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
