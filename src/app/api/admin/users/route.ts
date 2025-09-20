import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/jwt-auth";

export const GET = requireRole('ADMIN')(async (request: NextRequest, user) => {
  try {
    const users = await db.user.findMany({
      include: {
        pets: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los usuarios" },
      { status: 500 }
    );
  }
});