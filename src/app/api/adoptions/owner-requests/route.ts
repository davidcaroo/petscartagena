import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt-auth";
import { db } from "@/lib/db";
import { ActivityLogger } from "@/lib/activity-logger";

// GET - Obtener solicitudes de adopción para las mascotas del dueño
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || user.role !== "OWNER") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    // Construir filtros
    const where: any = {
      pet: {
        ownerId: user.id
      }
    };

    if (status && status !== "all") {
      where.status = status;
    }

    // Obtener solicitudes de adopción para las mascotas del dueño
    const adoptionRequests = await db.adoptionRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            city: true,
            bio: true
          }
        },
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
            age: true,
            color: true,
            gender: true,
            size: true,
            description: true,
            isAvailable: true,
            images: {
              take: 1,
              orderBy: { order: "asc" },
              select: {
                url: true
              }
            }
          }
        }
      }
    });

    // Obtener estadísticas de las solicitudes
    const stats = await db.adoptionRequest.groupBy({
      by: ['status'],
      where: {
        pet: {
          ownerId: user.id
        }
      },
      _count: { status: true }
    });

    const statsFormatted = {
      total: adoptionRequests.length,
      pending: stats.find(s => s.status === 'PENDING')?._count.status || 0,
      accepted: stats.find(s => s.status === 'ACCEPTED')?._count.status || 0,
      rejected: stats.find(s => s.status === 'REJECTED')?._count.status || 0,
      cancelled: stats.find(s => s.status === 'CANCELLED')?._count.status || 0,
    };

    return NextResponse.json({
      requests: adoptionRequests,
      stats: statsFormatted
    });

  } catch (error) {
    console.error("Error fetching owner adoption requests:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado de solicitud de adopción (solo aceptar/rechazar)
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || user.role !== "OWNER") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { adoptionId, status, ownerComment } = await request.json();

    if (!adoptionId || !status) {
      return NextResponse.json(
        { error: "ID de adopción y estado son requeridos" },
        { status: 400 }
      );
    }

    // Validar estado (dueños solo pueden aceptar o rechazar)
    const validStatuses = ['ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Estado inválido. Solo puedes aceptar o rechazar solicitudes" },
        { status: 400 }
      );
    }

    // Obtener la solicitud actual y verificar que pertenece a una mascota del dueño
    const adoptionRequest = await db.adoptionRequest.findFirst({
      where: { 
        id: adoptionId,
        pet: {
          ownerId: user.id
        }
      },
      include: {
        user: { select: { name: true, email: true } },
        pet: { select: { id: true, name: true, ownerId: true } }
      }
    });

    if (!adoptionRequest) {
      return NextResponse.json(
        { error: "Solicitud de adopción no encontrada o no tienes permisos para modificarla" },
        { status: 404 }
      );
    }

    // Verificar que la solicitud esté pendiente
    if (adoptionRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: "Solo puedes modificar solicitudes pendientes" },
        { status: 400 }
      );
    }

    // Si se está aceptando una solicitud, verificar que la mascota esté disponible
    if (status === 'ACCEPTED') {
      const pet = await db.pet.findFirst({
        where: { 
          id: adoptionRequest.petId,
          isAvailable: true
        }
      });

      if (!pet) {
        return NextResponse.json(
          { error: "La mascota ya no está disponible para adopción" },
          { status: 400 }
        );
      }

      // Si se acepta, rechazar automáticamente todas las demás solicitudes pendientes para esta mascota
      await db.adoptionRequest.updateMany({
        where: {
          petId: adoptionRequest.petId,
          id: { not: adoptionId },
          status: 'PENDING'
        },
        data: {
          status: 'REJECTED',
          message: 'Solicitud rechazada automáticamente - la mascota fue adoptada por otro solicitante',
          updatedAt: new Date()
        }
      });

      // Marcar la mascota como no disponible
      await db.pet.update({
        where: { id: adoptionRequest.petId },
        data: { isAvailable: false }
      });
    }

    // Actualizar la solicitud principal
    const updatedAdoption = await db.adoptionRequest.update({
      where: { id: adoptionId },
      data: {
        status,
        message: ownerComment || adoptionRequest.message,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
            isAvailable: true,
            images: {
              take: 1,
              orderBy: { order: "asc" }
            }
          }
        }
      }
    });

    // Log de actividad
    if (status === 'ACCEPTED') {
      await ActivityLogger.adoptionApproved(
        user.id,
        adoptionRequest.pet.name,
        adoptionRequest.user.name || 'Usuario'
      );
    } else if (status === 'REJECTED') {
      await ActivityLogger.adoptionRejected(
        user.id,
        adoptionRequest.pet.name,
        adoptionRequest.user.name || 'Usuario'
      );
    }

    return NextResponse.json(updatedAdoption);

  } catch (error) {
    console.error("Error updating adoption request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}