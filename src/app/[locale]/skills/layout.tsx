import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

const titles: Record<string, string> = {
  fr: "Compétences | Abdenour Hellas",
  en: "Skills | Abdenour Hellas",
  ar: "المهارات | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Compétences techniques d'Abdenour Hellas en génie électrique, automatisation industrielle et développement web.",
  en: "Technical skills of Abdenour Hellas in electrical engineering, industrial automation and web development.",
  ar: "المهارات التقنية لعبد النور حلاس في الهندسة الكهربائية والأتمتة الصناعية وتطوير الويب.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/skills", titles, descriptions });
}

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
