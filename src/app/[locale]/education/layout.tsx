import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

const titles: Record<string, string> = {
  fr: "Formation | Abdenour Hellas",
  en: "Education | Abdenour Hellas",
  ar: "التعليم | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Parcours académique et certifications d'Abdenour Hellas en génie électrique et développement web.",
  en: "Academic background and certifications of Abdenour Hellas in electrical engineering and web development.",
  ar: "المسار الأكاديمي والشهادات لعبد النور حلاس في الهندسة الكهربائية وتطوير الويب.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({ locale, path: "/education", titles, descriptions });
}

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
