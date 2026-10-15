import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BOT_PATTERN =
  /bot|crawler|spider|crawling|lighthouse|headless|pingdom|uptime|curl|wget|python-requests|postman|insomnia|facebookexternalhit|slackbot|discordbot/i;

function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent);
}

// Compte les actions uniques : 1 par adresse IP et par jour
async function countUniquePerDay(type: string): Promise<number> {
  const rows = await prisma.stat.findMany({
    where: { type },
    select: { ipAddress: true, userAgent: true, date: true },
  });
  const keys = new Set(
    rows
      .filter((r) => r.ipAddress && r.ipAddress !== "unknown" && !isBot(r.userAgent))
      .map((r) => `${r.ipAddress}-${r.date.toISOString().slice(0, 10)}`)
  );
  return keys.size;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visits = await countUniquePerDay("visit");
    const downloads = await countUniquePerDay("cv_download");
    const messages = await prisma.message.count();
    const unreadMessages = await prisma.message.count({ where: { read: false } });

    return NextResponse.json({ visits, downloads, messages, unreadMessages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Ignorer les bots et robots d'indexation
    if (isBot(userAgent)) {
      return NextResponse.json({ skipped: "bot" });
    }

    // 1 enregistrement par IP et par jour (évite l'inflation du compteur)
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    const existing = await prisma.stat.findFirst({
      where: { type, ipAddress: ip, date: { gte: dayStart } },
    });
    if (existing) {
      return NextResponse.json(existing);
    }

    const stat = await prisma.stat.create({
      data: {
        type,
        ipAddress: ip,
        userAgent,
      },
    });
    return NextResponse.json(stat);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}
