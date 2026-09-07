import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

const titles: Record<string, string> = {
  fr: "Expériences | Abdenour Hellas",
  en: "Experience | Abdenour Hellas",
  ar: "الخبرات | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Parcours professionnel d'Abdenour Hellas : automatisation industrielle, maintenance électrique et développement web.",
  en: "Professional background of Abdenour Hellas: industrial automation, electrical maintenance and web development.",
  ar: "المسار المهني لعبد النور حلاس: الأتمتة الصناعية والصيانة الكهربائية وتطوير الويب.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/experience", titles, descriptions });
}

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
