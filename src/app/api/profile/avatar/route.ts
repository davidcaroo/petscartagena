import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt-auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { ActivityLogger } from "@/lib/activity-logger";

// POST - Subir avatar del usuario
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validaciones del archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP)" },
        { status: 400 }
      );
    }

    // Tamaño máximo: 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Tamaño máximo: 5MB" },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directorio ya existe
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `${user.id}-${timestamp}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Guardar archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL relativa para guardar en la base de datos
    const avatarUrl = `/uploads/avatars/${fileName}`;

    // Actualizar usuario con nueva URL del avatar
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        avatar: avatarUrl,
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
    await ActivityLogger.userAction(
      user.id,
      'Avatar actualizado',
      'Subió una nueva foto de perfil',
      { fileName, fileSize: file.size }
    );

    return NextResponse.json({
      message: "Avatar actualizado exitosamente",
      user: updatedUser,
      avatarUrl
    });

  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar avatar del usuario
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Actualizar usuario removiendo el avatar
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        avatar: null,
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
    await ActivityLogger.userAction(
      user.id,
      'Avatar eliminado',
      'Eliminó su foto de perfil',
      {}
    );

    return NextResponse.json({
      message: "Avatar eliminado exitosamente",
      user: updatedUser
    });

  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}