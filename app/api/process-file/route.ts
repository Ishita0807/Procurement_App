import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { parse } from "csv-parse/sync";
import path from "path";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import { Supplier } from "../../../types";

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
    console.log(supplierFileId)
    // Find supplier file record
    const supplierFile = await prisma.supplierFile.findUnique({
      where: { id: supplierFileId },
    });

    if (!supplierFile) {
      return NextResponse.json(
        { error: "Supplier file not found" },
        { status: 404 }
      );
    }

    // Original file is in /public/uploads/<userId>/original/...
    const filename = path.basename(supplierFile.originalFileUrl);
    console.log(filename)
    const filepath = path.join(
      process.cwd(),
      "public",
      "uploads",
      user.id,
      "original",
      filename
    );

    // Check file exists
    try {
      await fs.access(filepath);
    } catch {
      return NextResponse.json(
        { error: "File not found on server" },
        { status: 404 }
      );
    }

    // Read file
    const buffer = await fs.readFile(filepath);

    // Process CSV
    let processedData: Supplier[] = [];
    if (filename.endsWith(".csv")) {
      processedData = processCsvBuffer(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file format" },
        { status: 400 }
      );
    }

    // Save processed file to /processed folder
    const processedDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      user.id,
      "processed"
    );
    await fs.mkdir(processedDir, { recursive: true });

    const processedFilename = `${Date.now()}-processed.json`;
    const processedFilepath = path.join(processedDir, processedFilename);
    const output = JSON.stringify(processedData, null, 2);
    await fs.writeFile(
      processedFilepath,
      output,
      "utf-8"
    );

    const processedUrl = `/uploads/${user.id}/processed/${processedFilename}`;

    // Update DB
    await prisma.supplierFile.update({
      where: { id: supplierFileId },
      data: { processedFileUrl: processedUrl },
    });

    return NextResponse.json({
      status: "success",
      processedFileUrl: processedUrl,
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

  // Normalize rows
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
