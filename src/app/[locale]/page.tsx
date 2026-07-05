import HomePageClient from "@/components/public/HomePageClient";
import { prisma } from "@/lib/prisma";
import { getDefaultHomepageSettings } from "@/lib/homepageDefaults";

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
      homepageSettings: homepageSettings || getDefaultHomepageSettings(),
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
      homepageSettings: getDefaultHomepageSettings(),
    };
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const data = await getHomepageData();
  return <HomePageClient data={data} />;
}
