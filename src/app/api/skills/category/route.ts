import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldCategory, newCategory } = await request.json();
    if (!oldCategory || !newCategory) {
      return NextResponse.json({ error: "Missing category names" }, { status: 400 });
    }

    await prisma.skill.updateMany({
      where: { category: oldCategory },
      data: { category: newCategory },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to rename category" }, { status: 500 });
  }
}
