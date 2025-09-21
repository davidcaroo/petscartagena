import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/settings/public - Obtener configuraciones públicas (sin autenticación)
export async function GET(request: NextRequest) {
  try {
    // Obtener solo las configuraciones marcadas como públicas o específicas de contacto
    const settings = await db.setting.findMany({
      where: {
        OR: [
          { isPublic: true },
          { 
            key: {
              in: [
                'company_email',
                'company_phone', 
                'company_address',
                'platform_name',
                'company_description'
              ]
            }
          }
        ]
      },
      select: {
        key: true,
        value: true,
        type: true,
        category: true,
        label: true,
        description: true
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { label: 'asc' }
      ]
    });

    // Convertir a un objeto key-value para facilitar el uso
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        type: setting.type,
        category: setting.category,
        label: setting.label,
        description: setting.description
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      settings: settingsObject,
      raw: settings
    });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: "Error al obtener las configuraciones públicas" },
      { status: 500 }
    );
  }
}