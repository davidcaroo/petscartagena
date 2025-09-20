import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/jwt-auth";
import { ActivityLogger } from "@/lib/activity-logger";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { userId, petId } = await request.json();

    if (!userId || !petId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Check if pet exists and is available
    const pet = await db.pet.findUnique({
      where: { id: petId }
    });

    if (!pet || !pet.isAvailable) {
      return NextResponse.json(
        { error: "La mascota no está disponible" },
        { status: 404 }
      );
    }

    // Check if user is trying to chat with themselves
    if (userId === user.id) {
      return NextResponse.json(
        { error: "No puedes chatear contigo mismo" },
        { status: 400 }
      );
    }

    // Check if chat already exists
    const existingChat = await db.chat.findFirst({
      where: {
        OR: [
          { user1Id: user.id, user2Id: userId },
          { user1Id: userId, user2Id: user.id }
        ]
      }
    });

    if (existingChat) {
      return NextResponse.json({ 
        chatId: existingChat.id,
        message: "El chat ya existe" 
      });
    }

    // Create new chat
    const chat = await db.chat.create({
      data: {
        user1Id: user.id,
        user2Id: userId
      }
    });

    // Create adoption request if it doesn't exist
    const existingRequest = await db.adoptionRequest.findFirst({
      where: {
        petId: petId,
        userId: user.id
      }
    });

    if (!existingRequest) {
      await db.adoptionRequest.create({
        data: {
          petId: petId,
          userId: user.id,
          status: "PENDING"
        }
      });

      // Obtener información adicional para el log
      const otherUser = await db.user.findUnique({
        where: { id: userId },
        select: { name: true }
      });

      // Log adoption request activity
      await ActivityLogger.adoptionRequested(
        user.id, 
        user.name || 'Usuario', 
        pet.name, 
        userId
      );

      // Log chat started activity
      await ActivityLogger.chatStarted(
        user.id,
        user.name || 'Usuario',
        otherUser?.name || 'Usuario',
        pet.name
      );
    }

    return NextResponse.json({ 
      chatId: chat.id,
      message: "Chat creado exitosamente" 
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear el chat" },
      { status: 500 }
    );
  }
}