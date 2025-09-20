import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, generateVerificationToken, generateVerificationEmailHTML, generateVerificationEmailText } from "@/lib/email";

// POST /api/auth/resend-verification
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email requerido" },
        { status: 400 }
      );
    }

    // Buscar el usuario
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "El email ya está verificado" },
        { status: 400 }
      );
    }

    // Generar nuevo token de verificación
    const verificationToken = generateVerificationToken(user.id);
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Actualizar el usuario con el nuevo token
    await db.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpires
      }
    });

    // Crear URL de verificación
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`;

    // Generar contenido del email
    const htmlContent = generateVerificationEmailHTML(user.name || 'Usuario', verificationUrl);
    const textContent = generateVerificationEmailText(user.name || 'Usuario', verificationUrl);

    // Enviar email
    const emailSent = await sendEmail({
      to: user.email,
      subject: "Verifica tu cuenta - PetsCartagena",
      html: htmlContent,
      text: textContent
    });

    if (emailSent) {
      return NextResponse.json(
        { message: "Email de verificación reenviado exitosamente" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Error enviando el email de verificación" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error reenviando verificación:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al reenviar la verificación" },
      { status: 500 }
    );
  }
}