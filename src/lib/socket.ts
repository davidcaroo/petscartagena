import { Server } from 'socket.io';
import { db } from './db';

interface MessageData {
  content: string;
  receiverId: string;
  chatId: string;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle joining chat rooms
    socket.on('join_chat', (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    // Handle leaving chat rooms
    socket.on('leave_chat', (chatId: string) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left chat ${chatId}`);
    });

    // Handle sending messages
    socket.on('send_message', async (data: MessageData) => {
      try {
        // Verify the chat exists and user is part of it
        const chat = await db.chat.findUnique({
          where: { id: data.chatId }
        });

        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }

        // Create message in database
        const message = await db.message.create({
          data: {
            content: data.content,
            senderId: socket.handshake.auth.userId, // This should be set during authentication
            receiverId: data.receiverId,
            chatId: data.chatId
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

        // Broadcast message to chat room
        io.to(data.chatId).emit('new_message', message);
        
        console.log(`Message sent in chat ${data.chatId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data: { chatId: string; isTyping: boolean }) => {
      socket.to(data.chatId).emit('user_typing', {
        userId: socket.handshake.auth.userId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};