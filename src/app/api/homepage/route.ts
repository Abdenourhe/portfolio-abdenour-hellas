import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    ] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
      prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
      prisma.interest.findMany({ orderBy: { order: "asc" } }),
    ]);

    const degrees = education?.filter((e) => e.type !== "CERTIFICATE") || [];
    const certifications = education?.filter((e) => e.type === "CERTIFICATE") || [];

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
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch homepage data" }, { status: 500 });
  }
}
