import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

const titles: Record<string, string> = {
  fr: "À propos | Abdenour Hellas",
  en: "About | Abdenour Hellas",
  ar: "عني | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Découvrez le parcours, les passions et les centres d'intérêt d'Abdenour Hellas, ingénieur en génie électrique.",
  en: "Discover the journey, passions and interests of Abdenour Hellas, electrical engineer.",
  ar: "اكتشف مسيرة وشغف واهتمامات عبد النور حلاس، مهندس كهربائي.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/about", titles, descriptions });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
