import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/pageMetadata";

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
  return buildPageMetadata({ locale, path: "/blog", titles, descriptions });
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
