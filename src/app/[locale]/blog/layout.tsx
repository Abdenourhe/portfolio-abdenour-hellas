import type { Metadata } from "next";

const titles: Record<string, string> = {
  fr: "Blog | Abdenour Hellas",
  en: "Blog | Abdenour Hellas",
  ar: "المدونة | عبد النور حلاس",
};

const descriptions: Record<string, string> = {
  fr: "Articles et réflexions d'Abdenour Hellas sur l'ingénierie électrique, l'automatisation et les systèmes embarqués.",
  en: "Articles and thoughts by Abdenour Hellas on electrical engineering, automation and embedded systems.",
  ar: "مقالات وأفكار عبد النور حلاس حول الهندسة الكهربائية والأتمتة والأنظمة المدمجة.",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: titles[locale] || titles.fr,
    description: descriptions[locale] || descriptions.fr,
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
