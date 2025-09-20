import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const chat = await db.chat.findUnique({
      where: {
        id: id,
        OR: [
          { user1Id: user.id },
          { user2Id: user.id }
        ]
      },
      include: {
        user1: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        user2: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener el chat" },
      { status: 500 }
    );
  }
}