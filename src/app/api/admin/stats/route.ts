import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/jwt-auth";

export const GET = requireRole('ADMIN')(async (request: NextRequest, user) => {
  try {
    // Get total pets
    const totalPets = await db.pet.count();

    // Get total adoptions (completed adoption requests)
    const totalAdoptions = await db.adoptionRequest.count({
      where: { status: "ACCEPTED" }
    });

    // Get total users
    const totalUsers = await db.user.count();

    // Get total chats
    const totalChats = await db.chat.count();

    const stats = {
      totalPets,
      totalAdoptions,
      totalUsers,
      totalChats
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener las estadísticas" },
      { status: 500 }
    );
  }
});