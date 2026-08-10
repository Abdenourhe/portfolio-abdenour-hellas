"use client";

import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  name: string;
  href: string;
}

const breadcrumbLabels: Record<string, Record<string, string>> = {
  fr: {
    about: "À propos",
    cv: "CV",
    contact: "Contact",
    blog: "Blog",
    experience: "Expérience",
    education: "Formation",
    skills: "Compétences",
    projects: "Projets",
    testimonials: "Témoignages",
  },
  en: {
    about: "About",
    cv: "CV",
    contact: "Contact",
    blog: "Blog",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    projects: "Projects",
    testimonials: "Testimonials",
  },
  ar: {
    about: "عنّي",
    cv: "السيرة",
    contact: "اتصل",
    blog: "المدونة",
    experience: "الخبرة",
    education: "التعليم",
    skills: "المهارات",
    projects: "المشاريع",
    testimonials: "الشهادات",
  },
};

export default function BreadcrumbSchema({ locale, baseUrl }: { locale: string; baseUrl: string }) {
  const pathname = usePathname();
  if (!pathname || pathname === `/${locale}`) return null;

  const segments = pathname.replace(`/${locale}/`, "").split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const labels = breadcrumbLabels[locale] || breadcrumbLabels.fr;

  const items: BreadcrumbItem[] = [
    { name: locale === "fr" ? "Accueil" : locale === "ar" ? "الرئيسية" : "Home", href: `${baseUrl}/${locale}` },
  ];

  let currentPath = `${baseUrl}/${locale}`;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    items.push({
      name: labels[segment] || segment,
      href: currentPath,
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
