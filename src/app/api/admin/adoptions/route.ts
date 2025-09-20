import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt-auth";
import { db } from "@/lib/db";
import { ActivityLogger } from "@/lib/activity-logger";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    // Obtener adopciones con información completa
    const adoptions = await db.adoptionRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            city: true
          }
        },
        pet: {
          select: {
            id: true,
            name: true,
            type: true,
            breed: true,
            age: true,
            isAvailable: true,
            images: {
              take: 1,
              orderBy: { order: "asc" }
            },
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    // Contar total
    const total = await db.adoptionRequest.count({ where });

    // Obtener estadísticas
    const stats = await db.adoptionRequest.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const statsFormatted = {
      total,
      pending: stats.find(s => s.status === 'PENDING')?._count.status || 0,
      accepted: stats.find(s => s.status === 'ACCEPTED')?._count.status || 0,
      rejected: stats.find(s => s.status === 'REJECTED')?._count.status || 0,
      cancelled: stats.find(s => s.status === 'CANCELLED')?._count.status || 0,
    };

    return NextResponse.json({
      adoptions,
      stats: statsFormatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching adoptions:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { adoptionId, status, adminComment } = await request.json();

    if (!adoptionId || !status) {
      return NextResponse.json(
        { error: "ID de adopción y estado son requeridos" },
        { status: 400 }
      );
    }

    // Validar estado
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Estado inválido" },
        { status: 400 }
      );
    }

    // Obtener la solicitud actual
    const adoptionRequest = await db.adoptionRequest.findUnique({
      where: { id: adoptionId },
      include: {
        user: { select: { name: true, email: true } },
        pet: { select: { name: true, ownerId: true } }
      }
    });

    if (!adoptionRequest) {
      return NextResponse.json(
        { error: "Solicitud de adopción no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la solicitud
    const updatedAdoption = await db.adoptionRequest.update({
      where: { id: adoptionId },
      data: {
        status,
        message: adminComment || adoptionRequest.message,
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

    // Si se aprueba la adopción, marcar la mascota como no disponible
    if (status === 'ACCEPTED') {
      await db.pet.update({
        where: { id: adoptionRequest.petId },
        data: { isAvailable: false }
      });

      // Log de actividad
      await ActivityLogger.adoptionApproved(
        user.id,
        adoptionRequest.pet.name,
        adoptionRequest.user.name || 'Usuario'
      );
    } else if (status === 'REJECTED') {
      // Log de actividad
      await ActivityLogger.adoptionRejected(
        user.id,
        adoptionRequest.pet.name,
        adoptionRequest.user.name || 'Usuario'
      );
    }

    // Log de acción admin
    await ActivityLogger.adminAction(
      user.id,
      `Adopción ${status.toLowerCase()}`,
      `${status === 'ACCEPTED' ? 'Aprobó' : status === 'REJECTED' ? 'Rechazó' : 'Actualizó'} la solicitud de adopción de ${adoptionRequest.pet.name}`,
      { adoptionId, petName: adoptionRequest.pet.name, adopterName: adoptionRequest.user.name }
    );

    return NextResponse.json(updatedAdoption);

  } catch (error) {
    console.error("Error updating adoption:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}