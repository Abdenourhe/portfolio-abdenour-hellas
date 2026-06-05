import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "abdenour.hellas@uqat.ca").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "Abdenour2026!";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      name: "Abdenour Hellas",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return NextResponse.json({
    success: true,
    message: "Admin user created/updated",
    email: user.email,
  });
}
