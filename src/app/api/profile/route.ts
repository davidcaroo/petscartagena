import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt-auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { ActivityLogger } from "@/lib/activity-logger";

// GET - Obtener información del perfil del usuario
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener información completa del usuario (sin contraseña)
    const userProfile = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        role: true,
        avatar: true,
        bio: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(userProfile);

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar información del perfil
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      email, 
      phone, 
      address, 
      city, 
      bio, 
      currentPassword, 
      newPassword 
    } = body;

    // Validaciones básicas
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    if (phone && phone.length > 0 && !/^\+?[\d\s\-\(\)]+$/.test(phone)) {
      return NextResponse.json(
        { error: "Formato de teléfono inválido" },
        { status: 400 }
      );
    }

    // Obtener usuario actual para validaciones
    const currentUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        password: true
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== currentUser.email) {
      const existingUser = await db.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Este email ya está en uso por otro usuario" },
          { status: 400 }
        );
      }
    }

    // Preparar datos para actualizar
    const updateData: any = {};

    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    if (address !== undefined) updateData.address = address || null;
    if (city !== undefined) updateData.city = city || null;
    if (bio !== undefined) updateData.bio = bio || null;

    // Manejar cambio de contraseña
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Debes proporcionar tu contraseña actual para cambiarla" },
          { status: 400 }
        );
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "La contraseña actual es incorrecta" },
          { status: 400 }
        );
      }

      // Validar nueva contraseña
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "La nueva contraseña debe tener al menos 6 caracteres" },
          { status: 400 }
        );
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedNewPassword;
    }

    // Actualizar usuario
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        role: true,
        avatar: true,
        bio: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Log de actividad
    const changes = [];
    if (email && email !== currentUser.email) changes.push('email');
    if (phone !== undefined) changes.push('teléfono');
    if (address !== undefined) changes.push('dirección');
    if (city !== undefined) changes.push('ciudad');
    if (bio !== undefined) changes.push('biografía');
    if (newPassword) changes.push('contraseña');

    if (changes.length > 0) {
      await ActivityLogger.userAction(
        user.id,
        'Perfil actualizado',
        `Actualizó: ${changes.join(', ')}`,
        { updatedFields: changes }
      );
    }

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}