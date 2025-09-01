import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {prisma} from "../../../../lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
        }

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}