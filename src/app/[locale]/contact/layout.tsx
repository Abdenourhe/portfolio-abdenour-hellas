import type { Metadata } from "next";

const titles: Record<string, string> = {
  fr: "Contact | Abdenour Hellas",
  en: "Contact | Abdenour Hellas",
  ar: "اتصل | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Contactez Abdenour Hellas pour des opportunités professionnelles, collaborations ou questions techniques.",
  en: "Contact Abdenour Hellas for professional opportunities, collaborations or technical questions.",
  ar: "اتصل بعبد النور حلاس للفرص المهنية والتعاون أو الأسئلة التقنية.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
