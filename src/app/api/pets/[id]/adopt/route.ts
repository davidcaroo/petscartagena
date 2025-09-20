import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt-auth";
import { db } from "@/lib/db";
import { ActivityLogger } from "@/lib/activity-logger";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "Debes iniciar sesión para adoptar una mascota" }, { status: 401 });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json({ error: "Los administradores no pueden adoptar mascotas" }, { status: 403 });
    }

    const petId = params.id;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Por favor, escribe un mensaje para el dueño de la mascota" }, { status: 400 });
    }

    // Verificar que la mascota exista y esté disponible
    const pet = await db.pet.findUnique({
      where: { id: petId },
      include: {
        owner: { select: { id: true, name: true, email: true } }
      }
    });

    if (!pet) {
      return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });
    }

    if (!pet.isAvailable) {
      return NextResponse.json({ error: "Esta mascota ya no está disponible para adopción" }, { status: 400 });
    }

    if (pet.ownerId === user.id) {
      return NextResponse.json({ error: "No puedes adoptar tu propia mascota" }, { status: 400 });
    }

    // Verificar si ya existe una solicitud de este usuario para esta mascota
    const existingRequest = await db.adoptionRequest.findFirst({
      where: {
        userId: user.id,
        petId: petId,
        status: {
          in: ['PENDING', 'ACCEPTED']
        }
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'PENDING') {
        return NextResponse.json({ 
          error: "Ya tienes una solicitud pendiente para esta mascota" 
        }, { status: 400 });
      } else if (existingRequest.status === 'ACCEPTED') {
        return NextResponse.json({ 
          error: "Ya has adoptado esta mascota" 
        }, { status: 400 });
      }
    }

    // Crear la solicitud de adopción
    const adoptionRequest = await db.adoptionRequest.create({
      data: {
        userId: user.id,
        petId: petId,
        message: message.trim(),
        status: 'PENDING'
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
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Log de actividad
    await ActivityLogger.adoptionRequested(
      user.id,
      user.name || 'Usuario',
      pet.name,
      pet.ownerId!
    );

    return NextResponse.json({
      success: true,
      message: "🎉 ¡Solicitud de adopción enviada exitosamente!",
      adoptionRequest: {
        id: adoptionRequest.id,
        status: adoptionRequest.status,
        createdAt: adoptionRequest.createdAt,
        pet: {
          name: adoptionRequest.pet.name,
          type: adoptionRequest.pet.type
        },
        owner: {
          name: adoptionRequest.pet.owner.name
        }
      }
    });

  } catch (error) {
    console.error("Error creating adoption request:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Inténtalo más tarde." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
    }

    const petId = params.id;

    // Obtener todas las solicitudes del usuario para esta mascota
    const adoptionRequests = await db.adoptionRequest.findMany({
      where: {
        userId: user.id,
        petId: petId
      },
      orderBy: { createdAt: 'desc' },
      include: {
        pet: {
          select: {
            name: true,
            isAvailable: true
          }
        }
      }
    });

    return NextResponse.json({
      requests: adoptionRequests,
      hasActiveRequest: adoptionRequests.some(req => 
        req.status === 'PENDING' || req.status === 'ACCEPTED'
      )
    });

  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}