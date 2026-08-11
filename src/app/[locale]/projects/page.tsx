import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/lib/getBaseUrl";
import SectionHeader from "@/components/public/SectionHeader";
import ProjectsSection from "@/components/public/sections/ProjectsSection";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();

  const titles = {
    fr: "Projets — Abdenour Hellas",
    en: "Projects — Abdenour Hellas",
    ar: "المشاريع — عبد النور هلاس",
  };

  const descriptions = {
    fr: "Découvrez mes réalisations techniques en génie électrique et développement web : automatisation industrielle, applications web et systèmes embarqués.",
    en: "Explore my technical achievements in electrical engineering and web development: industrial automation, web applications and embedded systems.",
    ar: "اكتشف إنجازاتي التقنية في الهندسة الكهربائية وتطوير الويب: الأتمتة الصناعية، التطبيقات الويب والأنظمة المدمجة.",
  };

  const title = titles[locale as keyof typeof titles] || titles.fr;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.fr;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : locale,
      url: `${baseUrl}/${locale}/projects`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/projects`,
      languages: {
        fr: `${baseUrl}/fr/projects`,
        en: `${baseUrl}/en/projects`,
        ar: `${baseUrl}/ar/projects`,
      },
    },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-20 md:py-28">
      <SectionHeader title={messages.projects.title} subtitle={messages.projects.subtitle} />
      <div className="mt-12">
        <ProjectsSection data={projects} />
      </div>
    </div>
  );
}
