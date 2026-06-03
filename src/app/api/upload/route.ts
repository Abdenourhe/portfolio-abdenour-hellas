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
    const base64Data = formData.get("base64") as string;

    if (base64Data) {
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return NextResponse.json({ error: "Invalid base64 data" }, { status: 400 });
      }
      const mimeType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");

      if (type === "cv") {
        if (mimeType !== "application/pdf") {
          return NextResponse.json({ error: "Le CV doit être un fichier PDF" }, { status: 400 });
        }
        const fileName = `cv-${Date.now()}.pdf`;
        const filePath = join(process.cwd(), "public", "uploads", fileName);
        await writeFile(filePath, buffer);
        return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
      }

      const ext = mimeType.split("/")[1] || "jpg";
      const fileName = `photo-${Date.now()}.${ext}`;
      const filePath = join(process.cwd(), "public", "uploads", fileName);
      await writeFile(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === "cv") {
      if (file.type !== "application/pdf") {
        return NextResponse.json({ error: "Le CV doit être un fichier PDF" }, { status: 400 });
      }
      const fileName = `cv-${Date.now()}.pdf`;
      const filePath = join(process.cwd(), "public", "uploads", fileName);
      await writeFile(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
    }

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format d'image non supporté (JPG, PNG, WebP)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `photo-${Date.now()}.${ext}`;
    const filePath = join(process.cwd(), "public", "uploads", fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${fileName}`, fileName });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
