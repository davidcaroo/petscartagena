import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt-auth";

// GET /api/favorites - Obtener favoritos del usuario
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const favorites = await db.favorite.findMany({
      where: {
        userId: user.id
      },
      include: {
        pet: {
          include: {
            images: {
              orderBy: {
                order: 'asc'
              }
            },
            owner: {
              select: {
                id: true,
                name: true,
                city: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los favoritos" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Agregar mascota a favoritos
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { petId } = await request.json();

    if (!petId) {
      return NextResponse.json(
        { error: "ID de mascota requerido" },
        { status: 400 }
      );
    }

    // Verificar que la mascota existe
    const pet = await db.pet.findUnique({
      where: { id: petId }
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // Verificar si ya está en favoritos
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_petId: {
          userId: user.id,
          petId: petId
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: "La mascota ya está en favoritos" },
        { status: 400 }
      );
    }

    // Agregar a favoritos
    const favorite = await db.favorite.create({
      data: {
        userId: user.id,
        petId: petId
      }
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al agregar a favoritos" },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Quitar mascota de favoritos
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const petId = searchParams.get('petId');

    if (!petId) {
      return NextResponse.json(
        { error: "ID de mascota requerido" },
        { status: 400 }
      );
    }

    // Verificar si está en favoritos
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_petId: {
          userId: user.id,
          petId: petId
        }
      }
    });

    if (!existingFavorite) {
      return NextResponse.json(
        { error: "La mascota no está en favoritos" },
        { status: 404 }
      );
    }

    // Quitar de favoritos
    await db.favorite.delete({
      where: {
        userId_petId: {
          userId: user.id,
          petId: petId
        }
      }
    });

    return NextResponse.json({ message: "Eliminado de favoritos" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al quitar de favoritos" },
      { status: 500 }
    );
  }
}