// app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { hash } from "bcryptjs";
import { signUpSchema } from "../../../lib/type";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password } = signUpSchema.parse(body);

    // Check for existing email
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Check for existing username
    const existingUserByUsername = await db.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Hash password and create new user
    const hashedPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Exclude password from the response
    const { password: newUserPassword, ...user } = newUser;
    return NextResponse.json({
      user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
