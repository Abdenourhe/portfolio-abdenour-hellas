import { NextResponse } from "next/server";
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

const DEFAULT_VISIBLE_STATS = ["visit", "cv_download"];

export async function GET() {
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
    const certifications = education?.filter((e) => e.type === "CERTIFICATE") || [];

    const settings = homepageSettings || {
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
    };

    return NextResponse.json({
      profile,
      experiences,
      education: degrees,
      certifications,
      skills,
      projects,
      testimonials,
      articles,
      interests,
      homepageSettings: settings,
    });
  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return NextResponse.json({ error: "Failed to fetch homepage data" }, { status: 500 });
  }
}
