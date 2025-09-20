import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/jwt-auth";

export const GET = requireRole('OWNER')(async (request: NextRequest, user) => {
  try {
    // Extract pet ID from URL
    const url = new URL(request.url);
    const petId = url.pathname.split('/').pop();

    if (!petId) {
      return NextResponse.json(
        { error: "ID de mascota no válido" },
        { status: 400 }
      );
    }

    const pet = await db.pet.findFirst({
      where: {
        id: petId,
        ownerId: user.id
      },
      include: {
        images: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });

    if (!pet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener la mascota" },
      { status: 500 }
    );
  }
});

export const PATCH = requireRole('OWNER')(async (request: NextRequest, user) => {
  try {
    // Extract pet ID from URL
    const url = new URL(request.url);
    const petId = url.pathname.split('/').pop();

    if (!petId) {
      return NextResponse.json(
        { error: "ID de mascota no válido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Verificar que la mascota pertenece al usuario
    const existingPet = await db.pet.findFirst({
      where: {
        id: petId,
        ownerId: user.id
      }
    });

    if (!existingPet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar la mascota
    const updatedPet = await db.pet.update({
      where: {
        id: petId
      },
      data: {
        name: body.name,
        type: body.type,
        breed: body.breed || null,
        age: body.age,
        color: body.color || null,
        size: body.size || null,
        gender: body.gender || null,
        description: body.description || null,
        favoriteFood: body.favoriteFood || null,
        favoriteToy: body.favoriteToy || null,
        medicalTreatment: body.medicalTreatment || null,
        isAvailable: body.isAvailable !== undefined ? body.isAvailable : existingPet.isAvailable,
        updatedAt: new Date()
      },
      include: {
        images: {
          orderBy: {
            order: "asc"
          }
        }
      }
    });

    return NextResponse.json(updatedPet);
  } catch (error) {
    console.error("Error updating pet:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al actualizar la mascota" },
      { status: 500 }
    );
  }
});

export const DELETE = requireRole('OWNER')(async (request: NextRequest, user) => {
  try {
    // Extract pet ID from URL
    const url = new URL(request.url);
    const petId = url.pathname.split('/').pop();

    if (!petId) {
      return NextResponse.json(
        { error: "ID de mascota no válido" },
        { status: 400 }
      );
    }

    // Verificar que la mascota pertenece al usuario
    const existingPet = await db.pet.findFirst({
      where: {
        id: petId,
        ownerId: user.id
      }
    });

    if (!existingPet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // Eliminar la mascota (esto también eliminará las imágenes y solicitudes de adopción en cascada)
    await db.pet.delete({
      where: {
        id: petId
      }
    });

    return NextResponse.json({ 
      message: "Mascota eliminada exitosamente" 
    });
  } catch (error) {
    console.error("Error deleting pet:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al eliminar la mascota" },
      { status: 500 }
    );
  }
});