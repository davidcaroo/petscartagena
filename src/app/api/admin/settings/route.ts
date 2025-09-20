import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/jwt-auth";

// GET /api/admin/settings - Obtener todas las configuraciones
export const GET = requireRole('ADMIN')(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const settings = await db.setting.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { label: 'asc' }
      ]
    });

    // Agrupar por categoría
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {} as Record<string, typeof settings>);

    return NextResponse.json({
      settings: category ? settings : groupedSettings,
      categories: Object.keys(groupedSettings)
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Error al obtener las configuraciones" },
      { status: 500 }
    );
  }
});

// POST /api/admin/settings - Crear nueva configuración
export const POST = requireRole('ADMIN')(async (request: NextRequest, user) => {
  try {
    const data = await request.json();
    
    const setting = await db.setting.create({
      data: {
        key: data.key,
        value: data.value,
        type: data.type,
        category: data.category,
        label: data.label,
        description: data.description,
        isPublic: data.isPublic || false,
        order: data.order || 0
      }
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error creating setting:", error);
    return NextResponse.json(
      { error: "Error al crear la configuración" },
      { status: 500 }
    );
  }
});

// PUT /api/admin/settings - Actualizar múltiples configuraciones
export const PUT = requireRole('ADMIN')(async (request: NextRequest, user) => {
  try {
    const { settings } = await request.json();

    // Actualizar en batch
    const updates = await Promise.all(
      settings.map((setting: any) =>
        db.setting.update({
          where: { key: setting.key },
          data: { value: setting.value }
        })
      )
    );

    return NextResponse.json({ 
      message: "Configuraciones actualizadas exitosamente",
      updated: updates.length 
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Error al actualizar las configuraciones" },
      { status: 500 }
    );
  }
});