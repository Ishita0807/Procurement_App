import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    // Generate unique filename and folder path in Supabase
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filePath = `${user.id}/original/${filename}`;

    // Convert File to ArrayBuffer/Uint8Array for Supabase
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("supplier_files") // bucket name
      .upload(filePath, buffer, {
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get a public URL for the uploaded file
    const { data } = supabase.storage
      .from("supplier_files")
      .getPublicUrl(filePath);

    const fileUrl = data.publicUrl;

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
