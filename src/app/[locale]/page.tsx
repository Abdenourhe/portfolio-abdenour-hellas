import HomePageClient from "@/components/public/HomePageClient";
import { prisma } from "@/lib/prisma";

const DEFAULT_SECTIONS_ORDER = [
  "stats",
  "experience",
  "education",
  "skills",
  "projects",
  "testimonials",
  "blog",
];

const DEFAULT_SECTIONS_VISIBILITY = {
  stats: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  testimonials: true,
  blog: true,
};

const DEFAULT_VISIBLE_STATS = ["years_exp", "projects", "education", "skills"];

async function getHomepageData() {
  try {
    const [
      profile,
      experiences,
      education,
      skills,
      projects,
      testimonials,
      articles,
      interests,
      homepageSettings,
    ] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
      prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
      prisma.interest.findMany({ orderBy: { order: "asc" } }),
      prisma.homepageSettings.findFirst(),
    ]);

    const degrees = education?.filter((e) => e.type !== "CERTIFICATE") || [];

    return {
      profile,
      experiences,
      education: degrees,
      skills,
      projects,
      testimonials,
      articles,
      interests,
      homepageSettings: homepageSettings || {
        id: "1",
        sectionsOrder: DEFAULT_SECTIONS_ORDER,
        sectionsVisibility: DEFAULT_SECTIONS_VISIBILITY,
        visibleStatsTypes: DEFAULT_VISIBLE_STATS,
        featuredProjectIds: [],
        typewriterPhrasesFr: [],
        typewriterPhrasesEn: [],
        typewriterPhrasesAr: [],
        heroTitle: null,
        heroTitleEn: null,
        heroTitleAr: null,
        heroSubtitle: null,
        heroSubtitleEn: null,
        heroSubtitleAr: null,
        updatedAt: new Date(),
      },
    };
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return {
      profile: null,
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      testimonials: [],
      articles: [],
      interests: [],
      homepageSettings: null,
    };
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const data = await getHomepageData();
  return <HomePageClient data={data} />;
}
