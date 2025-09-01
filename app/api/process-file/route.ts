import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { parse } from "csv-parse/sync";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { Supplier } from "../../../types";

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

    return prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { supplierFileId } = await req.json();
    if (!supplierFileId) {
      return NextResponse.json(
        { error: "Missing supplierFileId" },
        { status: 400 }
      );
    }

    // Fetch supplier file record
    const supplierFile = await prisma.supplierFile.findUnique({
      where: { id: supplierFileId },
    });

    if (!supplierFile?.originalFileUrl) {
      return NextResponse.json(
        { error: "Supplier file not found" },
        { status: 404 }
      );
    }

    // Download original file from Supabase
    // supplierFile.originalFileUrl should be like: "userId/original/filename.csv"
    // Remove Supabase public URL prefix if present
    const originalPath = supplierFile.originalFileUrl.replace(
      /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/supplier_files\//,
      ""
    );

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("supplier_files")
      .download(originalPath);
    if (downloadError || !fileData) {
      return NextResponse.json({ error: downloadError }, { status: 500 });
    }
    const buffer = Buffer.from(await fileData.arrayBuffer());

    // Process CSV
    let processedData: Supplier[] = [];
    if (supplierFile.originalFileUrl.endsWith(".csv")) {
      processedData = processCsvBuffer(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file format" },
        { status: 400 }
      );
    }

    // Upload processed JSON back to Supabase
    const processedFilename = `${Date.now()}-processed.json`;
    const processedPath = `${user.id}/processed/${processedFilename}`;
    const processedContent = JSON.stringify(processedData, null, 2);

    const { error: uploadError } = await supabase.storage
      .from("supplier_files")
      .upload(processedPath, processedContent, {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError.message);
      return NextResponse.json(
        { error: `Failed to upload processed file: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Update DB with processed file path
    await prisma.supplierFile.update({
      where: { id: supplierFileId },
      data: { processedFileUrl: processedPath },
    });

    const { data: urlData } = supabase.storage
      .from("supplier_files")
      .getPublicUrl(processedPath);

    return NextResponse.json({
      status: "success",
      processedFileUrl: urlData.publicUrl,
      output: processedData,
      recordCount: processedData.length,
    });
  } catch (error: any) {
    console.error("Processing error:", error);
    return NextResponse.json(
      { status: "error", details: error?.message },
      { status: 500 }
    );
  }
}

// --- Helpers ---
function processCsvBuffer(buffer: Buffer): Supplier[] {
  const csvText = buffer.toString("utf-8");
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  return records.map((row: any) => processRowData(row)) as Supplier[];
}

function processRowData(row: any) {
  const processed: any = {};

  Object.keys(row).forEach((key) => {
    const value = row[key];
    const cleanKey = key.toLowerCase().replace(/\s+/g, "_");

    if (typeof value === "string") {
      if (["true", "yes"].includes(value.toLowerCase())) {
        processed[cleanKey] = true;
      } else if (["false", "no"].includes(value.toLowerCase())) {
        processed[cleanKey] = false;
      } else if (!isNaN(parseFloat(value))) {
        processed[cleanKey] = parseFloat(value);
      } else {
        processed[cleanKey] = value;
      }
    } else {
      processed[cleanKey] = value;
    }
  });

  return processed;
}
