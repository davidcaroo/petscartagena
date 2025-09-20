import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt-auth";

const testUsers = [
  {
    name: "Usuario Adoptante",
    email: "adoptante@test.com",
    password: "password123",
    role: "USER",
    phone: "+57 300 123 4567",
  },
  {
    name: "Usuario Dueño",
    email: "dueno@test.com",
    password: "password123",
    role: "OWNER",
    phone: "+57 300 234 5678",
  },
  {
    name: "Administrador",
    email: "admin@test.com",
    password: "admin123",
    role: "ADMIN",
    phone: "+57 300 345 6789",
  },
];

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y rol de administrador
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere autenticación." },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo los administradores pueden crear usuarios de prueba." },
        { status: 403 }
      );
    }
    const results = [];
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user
        const user = await db.user.create({
          data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role,
            phone: userData.phone,
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

        results.push(`✅ ${user.name} (${user.email}) creado exitosamente`);
      } else {
        results.push(`⚠️ ${userData.email} ya existe`);
      }
    }

    return NextResponse.json({
      message: "Proceso completado:\n" + results.join("\n"),
      results
    });
  } catch (error) {
    console.error("Test users creation error:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear los usuarios de prueba" },
      { status: 500 }
    );
  }
}