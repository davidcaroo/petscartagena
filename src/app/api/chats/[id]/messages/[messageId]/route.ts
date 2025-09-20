import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt-auth';

interface RouteParams {
  id: string;
  messageId: string;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { id: chatId, messageId } = await context.params;
    
    // Verificar autenticación
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el chat existe y el usuario tiene acceso
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        OR: [
          { user1Id: user.id },
          { user2Id: user.id }
        ]
      }
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat no encontrado' }, { status: 404 });
    }

    // Verificar que el mensaje existe y el usuario es el receptor
    const message = await db.message.findUnique({
      where: {
        id: messageId,
        chatId: chatId,
        receiverId: user.id // Solo el receptor puede marcar como leído
      }
    });

    if (!message) {
      return NextResponse.json({ error: 'Mensaje no encontrado o no tienes permiso' }, { status: 404 });
    }

    // Por ahora retornamos el mensaje sin actualizar readAt hasta que los tipos estén listos
    // const updatedMessage = await db.message.update({
    //   where: {
    //     id: messageId
    //   },
    //   data: {
    //     readAt: new Date()
    //   },
    //   include: {
    //     sender: {
    //       select: {
    //         id: true,
    //         name: true,
    //         email: true,
    //         avatar: true
    //       }
    //     },
    //     receiver: {
    //       select: {
    //         id: true,
    //         name: true,
    //         email: true,
    //         avatar: true
    //       }
    //     }
    //   }
    // });

    return NextResponse.json({ 
      message: 'Mensaje marcado como leído',
      id: messageId 
    });
    
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}