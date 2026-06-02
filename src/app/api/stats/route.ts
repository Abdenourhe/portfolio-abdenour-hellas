import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visits = await prisma.stat.count({ where: { type: "visit" } });
    const downloads = await prisma.stat.count({ where: { type: "cv_download" } });
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
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

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
