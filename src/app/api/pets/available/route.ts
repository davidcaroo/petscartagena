import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build filters
    const where: any = {
      isAvailable: true
    };

    // Type filter
    const type = searchParams.get("type");
    if (type && type !== "") {
      where.type = type;
    }

    // Size filter
    const size = searchParams.get("size");
    if (size && size !== "") {
      where.size = size;
    }

    // Gender filter
    const gender = searchParams.get("gender");
    if (gender && gender !== "") {
      where.gender = gender;
    }

    // Age range filter
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    if (ageMin || ageMax) {
      where.age = {};
      if (ageMin) {
        where.age.gte = parseInt(ageMin);
      }
      if (ageMax) {
        where.age.lte = parseInt(ageMax);
      }
    }

    // Search filter
    const search = searchParams.get("search");
    if (search && search !== "") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { breed: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { color: { contains: search, mode: "insensitive" } }
      ];
    }

    const pets = await db.pet.findMany({
      where,
      include: {
        images: {
          orderBy: {
            order: "asc"
          },
          take: 1 // Only get the first image for the list
        },
        owner: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("Error fetching available pets:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener las mascotas disponibles" },
      { status: 500 }
    );
  }
}