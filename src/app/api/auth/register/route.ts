import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ActivityLogger } from "@/lib/activity-logger";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, phone } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !role || !phone) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      }
    });

    // Log the activity
    await ActivityLogger.userRegistered(user.id, user.name || 'Usuario', user.email);

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear la cuenta" },
      { status: 500 }
    );
  }
}