import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyEmailToken } from "@/lib/email";

// GET /api/auth/verify-email?token=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: "Token de verificación requerido" },
        { status: 400 }
      );
    }

    // Verificar el token
    const tokenData = verifyEmailToken(token);
    if (!tokenData) {
      return NextResponse.json(
        { error: "Token de verificación inválido o expirado" },
        { status: 400 }
      );
    }

    // Buscar el usuario
    const user = await db.user.findUnique({
      where: { id: tokenData.userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        verificationToken: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el token coincida con el almacenado
    if (user.verificationToken !== token) {
      return NextResponse.json(
        { error: "Token de verificación inválido" },
        { status: 400 }
      );
    }

    // Si ya está verificado
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email ya verificado", user: { email: user.email, name: user.name } },
        { status: 200 }
      );
    }

    // Actualizar el usuario como verificado
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null
      }
    });

    return NextResponse.json(
      { 
        message: "Email verificado exitosamente",
        user: { email: user.email, name: user.name }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error verificando email:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al verificar el email" },
      { status: 500 }
    );
  }
}