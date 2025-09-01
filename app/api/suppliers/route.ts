import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
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
  } catch {
    return null;
  }
}

// Save suppliers into the existing processed file for latest SupplierFile
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suppliers = await req.json();

    // Find the latest SupplierFile for this user
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

    // If processedFileUrl exists, reuse it, otherwise create a new one
    let processedFileUrl = latestFile.processedFileUrl;
    if (!processedFileUrl) {
      const filename = `${Date.now()}-suppliers.json`;
      processedFileUrl = `/uploads/${user.id}/processed/${filename}`;

      await prisma.supplierFile.update({
        where: { id: latestFile.id },
        data: { processedFileUrl },
      });
    }

    // Resolve absolute path
    const filepath = path.join(process.cwd(), "public", processedFileUrl);

    // Ensure directory exists
    await fs.mkdir(path.dirname(filepath), { recursive: true });

    // Write suppliers JSON (overwrite if file exists)
    await fs.writeFile(filepath, JSON.stringify(suppliers, null, 2), "utf-8");

    return NextResponse.json({
      message: "Suppliers saved successfully",
      processedFileUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to save suppliers: ${error.message}` },
      { status: 500 }
    );
  }
}

// Load suppliers from the processed file of the latest SupplierFile
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

    const filepath = path.join(process.cwd(), "public", latestFile.processedFileUrl);

    try {
      const data = await fs.readFile(filepath, "utf-8");
      return NextResponse.json(JSON.parse(data));
    } catch {
      return NextResponse.json([]);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to load suppliers: ${error.message}` },
      { status: 500 }
    );
  }
}
