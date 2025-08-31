import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database and token generation for demonstration
const users: any[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use env var in production



export async function POST(req: NextRequest) {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Save user (password should be hashed in production)
    const newUser = { id: users.length + 1, firstName, lastName, email, password };
    users.push(newUser);

    // Generate tokens
    const accessToken = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
    
    const refreshToken = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: '7d' }
            );
    

    return NextResponse.json({
        accessToken,
        refreshToken,
        user: { id: newUser.id, firstName, lastName, email }
    }, { status: 201 });
}