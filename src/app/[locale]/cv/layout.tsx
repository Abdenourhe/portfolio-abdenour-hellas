import type { Metadata } from "next";

const titles: Record<string, string> = {
  fr: "CV | Abdenour Hellas — Spécialiste en génie électrique & développement web",
  en: "CV | Abdenour Hellas — Electrical Engineering Specialist & Web Developer",
  ar: "السيرة الذاتية | عبد النور حلاس — أخصائي في الهندسة الكهربائية وتطوير الويب",
};

const descriptions: Record<string, string> = {
  fr: "Curriculum Vitae d'Abdenour Hellas, spécialiste en génie électrique et développement web spécialisé en automatisation, supervision et systèmes embarqués.",
  en: "Curriculum Vitae of Abdenour Hellas, electrical engineering specialist and web developer specialized in automation, supervision and embedded systems.",
  ar: "السيرة الذاتية لعبد النور حلاس، أخصائي في الهندسة الكهربائية وتطوير الويب متخصص في الأتمتة والإشراف والأنظمة المدمجة.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
  };
}

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
