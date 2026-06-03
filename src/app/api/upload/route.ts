import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

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

    let uploadStr: string;
    let resourceType: "image" | "raw" = "image";

    if (base64Data) {
      uploadStr = base64Data;
    } else if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      uploadStr = `data:${file.type};base64,${buffer.toString("base64")}`;
    } else {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (type === "cv") {
      resourceType = "raw";
    }

    const result = await cloudinary.uploader.upload(uploadStr, {
      folder: "portfolio",
      resource_type: resourceType,
    });

    return NextResponse.json({
      url: result.secure_url,
      filename: result.public_id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
