import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") === "en" ? "en" : "fr";

    const logs = await prisma.cvGenerationLog.findMany({
      where: { locale },
      orderBy: { generatedAt: "desc" },
      take: 20,
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Failed to fetch CV generation logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch CV generation logs", message: error?.message },
      { status: 500 }
    );
  }
}
