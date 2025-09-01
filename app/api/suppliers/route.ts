import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";


console.log("Supabase URL: ", process.env.NEXT_PUBLIC_SUPABASE_URL)
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
  } catch {
    return null;
  }
}

// Save suppliers into Supabase (processed file for latest SupplierFile)
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suppliers = await req.json();

    // Find latest SupplierFile
    const latestFile = await prisma.supplierFile.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!latestFile) {
      return NextResponse.json(
        { error: "No SupplierFile found for this user" },
        { status: 404 }
      );
    }

    // If processedFileUrl exists, reuse it, otherwise create new one
    let processedFilePath = latestFile.processedFileUrl;
    if (!processedFilePath) {
      const filename = `${Date.now()}-suppliers.json`;
      processedFilePath = `${user.id}/processed/${filename}`;

      await prisma.supplierFile.update({
        where: { id: latestFile.id },
        data: { processedFileUrl: processedFilePath },
      });
    }

    // Upload JSON to Supabase
    const { error: uploadError } = await supabase.storage
      .from("supplier_files")
      .upload(processedFilePath, JSON.stringify(suppliers, null, 2), {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return NextResponse.json(
        { error: `Failed to save suppliers: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from("supplier_files")
      .getPublicUrl(processedFilePath);

    return NextResponse.json({
      message: "Suppliers saved successfully",
      processedFileUrl: data.publicUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to save suppliers: ${error.message}` },
      { status: 500 }
    );
  }
}

// Load suppliers JSON from Supabase
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const latestFile = await prisma.supplierFile.findFirst({
      where: { userId: user.id, processedFileUrl: { not: null } },
      orderBy: { createdAt: "desc" },
    });

    if (!latestFile?.processedFileUrl) {
      return NextResponse.json([]);
    }

    // Download JSON from Supabase
    const { data, error } = await supabase.storage
      .from("supplier_files")
      .download(latestFile.processedFileUrl);

    if (error || !data) {
      console.error("Supabase download error:", error?.message);
      return NextResponse.json([]);
    }

    const text = await data.text();
    return NextResponse.json(JSON.parse(text));
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to load suppliers: ${error.message}` },
      { status: 500 }
    );
  }
}
