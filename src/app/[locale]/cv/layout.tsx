import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

const titles: Record<string, string> = {
  fr: "CV | Abdenour Hellas",
  en: "Resume | Abdenour Hellas",
  ar: "السيرة الذاتية | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Consultez et téléchargez le CV d'Abdenour Hellas, ingénieur en génie électrique et développeur web full-stack.",
  en: "View and download the resume of Abdenour Hellas, electrical engineer and full-stack web developer.",
  ar: "اطّلع على السيرة الذاتية لعبد النور حلاس وحمّلها، مهندس كهربائي ومطور ويب متكامل.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/cv", titles, descriptions });
}

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
