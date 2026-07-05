import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import {
  DEFAULT_SECTIONS_ORDER,
  DEFAULT_SECTIONS_VISIBILITY,
  DEFAULT_VISIBLE_STATS,
  getDefaultHomepageSettings,
} from "@/lib/homepageDefaults";

export async function GET() {
  try {
    let settings = await prisma.homepageSettings.findFirst();

    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: {
          ...getDefaultHomepageSettings(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch homepage settings:", error);
    return NextResponse.json({ error: "Failed to fetch homepage settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    let settings = await prisma.homepageSettings.findFirst();

    const sanitizedData = {
      heroTitle: data.heroTitle,
      heroTitleEn: data.heroTitleEn,
      heroTitleAr: data.heroTitleAr,
      heroSubtitle: data.heroSubtitle,
      heroSubtitleEn: data.heroSubtitleEn,
      heroSubtitleAr: data.heroSubtitleAr,
      typewriterPhrasesFr: Array.isArray(data.typewriterPhrasesFr) ? data.typewriterPhrasesFr : [],
      typewriterPhrasesEn: Array.isArray(data.typewriterPhrasesEn) ? data.typewriterPhrasesEn : [],
      typewriterPhrasesAr: Array.isArray(data.typewriterPhrasesAr) ? data.typewriterPhrasesAr : [],
      sectionsOrder: Array.isArray(data.sectionsOrder) ? data.sectionsOrder : DEFAULT_SECTIONS_ORDER,
      sectionsVisibility:
        typeof data.sectionsVisibility === "object" && data.sectionsVisibility !== null
          ? data.sectionsVisibility
          : DEFAULT_SECTIONS_VISIBILITY,
      featuredProjectIds: Array.isArray(data.featuredProjectIds) ? data.featuredProjectIds : [],
      visibleStatsTypes: Array.isArray(data.visibleStatsTypes)
        ? data.visibleStatsTypes
        : DEFAULT_VISIBLE_STATS,
    };

    if (settings) {
      settings = await prisma.homepageSettings.update({
        where: { id: settings.id },
        data: sanitizedData,
      });
    } else {
      settings = await prisma.homepageSettings.create({
        data: { id: "1", ...sanitizedData },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update homepage settings:", error);
    return NextResponse.json({ error: "Failed to update homepage settings" }, { status: 500 });
  }
}
