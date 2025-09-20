import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/jwt-auth";

export const GET = requireRole('ADMIN')(async (request: NextRequest, user) => {
  try {
    const pets = await db.pet.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true
          }
        },
        images: {
          select: {
            url: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener las mascotas" },
      { status: 500 }
    );
  }
});