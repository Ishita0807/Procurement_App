import { NextRequest, NextResponse } from 'next/server';
import { storage, ID } from '@/lib/appwrite';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const appwriteFile = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    );

    const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${appwriteFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    // Save file metadata to your database
    await prisma.supplierFile.create({
      data: {
        userId: userId,
        originalFileUrl: fileUrl,
      }
    });

    return NextResponse.json({
      success: true,
      file_url: fileUrl,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}