import type { Metadata } from "next";

const titles: Record<string, string> = {
  fr: "CV | Abdenour Hellas — Ingénieur en Génie Électrique",
  en: "CV | Abdenour Hellas — Electrical Engineer",
  ar: "السيرة الذاتية | عبد النور حلاس — مهندس كهربائي",
};

const descriptions: Record<string, string> = {
  fr: "Curriculum Vitae d'Abdenour Hellas, ingénieur en génie électrique spécialisé en automatisation, supervision et systèmes embarqués.",
  en: "Curriculum Vitae of Abdenour Hellas, electrical engineer specialized in automation, supervision and embedded systems.",
  ar: "السيرة الذاتية لعبد النور حلاس، مهندس كهربائي متخصص في الأتمتة والإشراف والأنظمة المدمجة.",
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
