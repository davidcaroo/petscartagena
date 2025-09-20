import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Activities endpoint called');
    
    // Verificar autenticación y rol de admin
    const user = await getUserFromRequest(request);
    console.log('👤 User from request:', user ? `${user.name} (${user.role})` : 'null');
    
    if (!user) {
      console.log('❌ No user found');
      return NextResponse.json({ error: "Token requerido" }, { status: 401 });
    }
    
    if (user.role !== "ADMIN") {
      console.log('❌ User is not admin:', user.role);
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // Obtener límite de resultados
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    // Obtener actividades recientes con información del usuario
    console.log('🔎 Fetching activities from database...');
    const activities = await db.activity.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    console.log(`📋 Found ${activities.length} activities in database`);

    // Formatear los datos para el frontend
    const formattedActivities = activities.map(activity => {
      const timeDiff = Date.now() - activity.createdAt.getTime();
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      let timestamp;
      if (minutes < 1) {
        timestamp = "Hace un momento";
      } else if (minutes < 60) {
        timestamp = `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
      } else if (hours < 24) {
        timestamp = `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
      } else {
        timestamp = `Hace ${days} día${days > 1 ? 's' : ''}`;
      }

      // Determinar el tipo de icono basado en el tipo de actividad
      let iconType;
      switch (activity.type) {
        case 'USER_REGISTRATION':
        case 'USER_VERIFICATION':
          iconType = 'user';
          break;
        case 'PET_REGISTRATION':
          iconType = 'pet';
          break;
        case 'PET_ADOPTION_REQUEST':
        case 'ADOPTION_APPROVED':
        case 'ADOPTION_REJECTED':
          iconType = 'adoption';
          break;
        case 'CHAT_STARTED':
          iconType = 'chat';
          break;
        default:
          iconType = 'system';
      }

      return {
        id: activity.id,
        type: iconType,
        action: activity.action,
        description: activity.description,
        timestamp,
        user: activity.user ? {
          name: activity.user.name || 'Usuario',
          avatar: activity.user.avatar || ''
        } : null,
        metadata: activity.metadata ? JSON.parse(activity.metadata) : null
      };
    });

    console.log(`✅ Returning ${formattedActivities.length} activities`);
    console.log('📊 Sample activity:', formattedActivities[0]);
    
    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}