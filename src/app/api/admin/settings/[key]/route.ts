import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/jwt-auth";

// GET /api/admin/settings/[key] - Obtener configuración específica
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const setting = await db.setting.findUnique({
      where: { key: params.key }
    });

    if (!setting) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { error: "Error al obtener la configuración" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings/[key] - Actualizar configuración específica
export const PUT = requireRole('ADMIN')(async (
  request: NextRequest,
  user,
  { params }: { params: { key: string } }
) => {
  try {
    const data = await request.json();

    const setting = await db.setting.update({
      where: { key: params.key },
      data: {
        value: data.value,
        label: data.label,
        description: data.description,
        type: data.type,
        category: data.category,
        isPublic: data.isPublic,
        order: data.order
      }
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Error al actualizar la configuración" },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/settings/[key] - Eliminar configuración
export const DELETE = requireRole('ADMIN')(async (
  request: NextRequest,
  user,
  { params }: { params: { key: string } }
) => {
  try {
    await db.setting.delete({
      where: { key: params.key }
    });

    return NextResponse.json({ message: "Configuración eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { error: "Error al eliminar la configuración" },
      { status: 500 }
    );
  }
});