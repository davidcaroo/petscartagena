import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/jwt-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener todas las solicitudes de adopción del usuario
    const adoptionRequests = await db.adoptionRequest.findMany({
      where: {
        userId: user.id
      },
      orderBy: { createdAt: "desc" },
      include: {
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
              orderBy: { order: "asc" },
              select: {
                url: true
              }
            },
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

    return NextResponse.json(adoptionRequests);

  } catch (error) {
    console.error("Error fetching user adoption requests:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}