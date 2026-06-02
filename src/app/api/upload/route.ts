import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate PDF for CV uploads
    if (type === "cv") {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Le CV doit être un fichier PDF" }, { status: 400 });
      }
      const fileName = `cv-${Date.now()}.pdf`;
      const filePath = join(process.cwd(), "public", "uploads", fileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
    }

    // Images for photo
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format d'image non supporté (JPG, PNG, WebP)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `photo-${Date.now()}.${ext}`;
    const filePath = join(process.cwd(), "public", "uploads", fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
