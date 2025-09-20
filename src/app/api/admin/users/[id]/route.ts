import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No tienes permisos de administrador" },
        { status: 403 }
      );
    }

    // Don't allow deleting admin users
    const userToDelete = await db.user.findUnique({
      where: { id: params.id }
    });

    if (!userToDelete) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    if (userToDelete.role === "ADMIN") {
      return NextResponse.json(
        { error: "No se pueden eliminar usuarios administradores" },
        { status: 400 }
      );
    }

    // Delete user and all related data (cascade delete)
    await db.user.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al eliminar el usuario" },
      { status: 500 }
    );
  }
}