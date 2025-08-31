import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const processedDir = path.join(process.cwd(), "public", "processed");
const processedFile = path.join(processedDir, "suppliers.json");

// Save suppliers
export async function POST(req: Request) {
  try {
    const suppliers = await req.json();

    // Ensure folder exists
    if (!fs.existsSync(processedDir)) {
      fs.mkdirSync(processedDir, { recursive: true });
    }

    // Save as JSON
    fs.writeFileSync(processedFile, JSON.stringify(suppliers, null, 2));

    return NextResponse.json({ message: "Suppliers saved successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to save suppliers: ${error.message}` },
      { status: 500 }
    );
  }
}

// Load suppliers
export async function GET() {
  try {
    if (!fs.existsSync(processedFile)) {
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(processedFile, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to load suppliers: ${error.message}` },
      { status: 500 }
    );
  }
}
