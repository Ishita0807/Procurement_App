import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {prisma} from '../../../../lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            supplierFiles: {
                orderBy:{
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    originalFileUrl: true,
                    processedFileUrl: true
                }
            }
            }
        });

        // Flatten supplier files array if supplier exists
        const supplierFilesflat = user?.supplierFiles?.map((file: { originalFileUrl: any; processedFileUrl: any; }) => ({
            originalFileUrl: file.originalFileUrl,
            processedFileUrl: file.processedFileUrl
        })) || [];

        // Remove supplier from user and add supplierFiles array
        const { supplierFiles, ...userData } = user || {};
        const result = { ...userData, supplierFiles: supplierFilesflat };

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
