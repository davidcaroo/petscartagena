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

    // Verify user is part of the chat
    const chat = await db.chat.findUnique({
      where: {
        id: id,
        OR: [
          { user1Id: user.id },
          { user2Id: user.id }
        ]
      }
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 }
      );
    }

    const messages = await db.message.findMany({
      where: {
        chatId: id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al obtener los mensajes" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const { content, receiverId } = await request.json();

    if (!content || !receiverId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Verify user is part of the chat
    const chat = await db.chat.findUnique({
      where: {
        id: id,
        OR: [
          { user1Id: user.id },
          { user2Id: user.id }
        ]
      }
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat no encontrado" },
        { status: 404 }
      );
    }

    // Verify receiver is the other user in the chat
    if (chat.user1Id !== receiverId && chat.user2Id !== receiverId) {
      return NextResponse.json(
        { error: "Destinatario inválido" },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        content,
        senderId: user.id,
        receiverId,
        chatId: id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al crear el mensaje" },
      { status: 500 }
    );
  }
}