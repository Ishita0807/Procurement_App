import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

async function getUserFromRequest(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    return prisma.user.findUnique({
      where: { id: decoded.userId },
    });
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Prepare folder structure: /public/uploads/<userId>/original
    const uploadBase = path.join("/tmp", user.id);
    const originalDir = path.join(uploadBase, "original");
    const processedDir = path.join(uploadBase, "processed");

    // Ensure folders exist
    await mkdir(originalDir, { recursive: true });
    await mkdir(processedDir, { recursive: true });

    // Save file
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = path.join(originalDir, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Public URL (Next.js serves /public)
    const fileUrl = `/uploads/${user.id}/original/${filename}`;

    // Save DB record
    const supplierFile = await prisma.supplierFile.create({
      data: {
        userId: user.id,
        originalFileUrl: fileUrl,
      },
    });
    return NextResponse.json({
      success: true,
      file_url: fileUrl,
      supplierFile,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
