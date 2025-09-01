import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // fallback for dev

export function generateUUID(): string {
  // RFC 4122 version 4 compliant UUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User Already Exists" },
      { status: 409 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const uuid = generateUUID();

  // Save user
  const newUser = await prisma.user.create({
    data: {
      id: uuid,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return NextResponse.json(
    {
      accessToken,
      refreshToken,
      user: { id: newUser.id, firstName, lastName, email },
    },
    { status: 201 }
  );
}
