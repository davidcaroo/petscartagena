"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, MoreVertical } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/chat";

interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ChatMessage extends Message {
  sender: ChatUser;
  receiver: ChatUser;
}

export default function ChatPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (!isLoading && user && chatId) {
      initializeChat();
    }
  }, [isLoading, user, chatId, router]);

  const initializeChat = async () => {
    try {
      // Fetch chat details
      const chatResponse = await fetch(`/api/chats/${chatId}`);
      if (!chatResponse.ok) {
        router.push("/adopt");
        return;
      }

      const chatData = await chatResponse.json();

      // Set other user
      const other = chatData.user1.id === user?.id ? chatData.user2 : chatData.user1;
      setOtherUser(other);

      // Fetch messages
      const messagesResponse = await fetch(`/api/chats/${chatId}/messages`);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      }

      // Initialize socket
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000");
      setSocket(newSocket);

      // Join chat room
      newSocket.emit("join_chat", chatId);

      // Listen for new messages
      newSocket.on("new_message", (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      });

      setLoading(false);
    } catch (error) {
      console.error("Error initializing chat:", error);
      router.push("/adopt");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user || !otherUser) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        receiverId: otherUser.id,
        chatId: chatId
      };

      // Send via socket for real-time update
      socket?.emit("send_message", messageData);

      // Send via API to persist
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat no encontrado</h2>
          <Button onClick={() => router.push("/adopt")}>
            Volver a Adoptar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={otherUser.avatar} />
                  <AvatarFallback>
                    {otherUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
                  <p className="text-sm text-gray-500">{otherUser.email}</p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay mensajes aún. ¡Comienza la conversación!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === user?.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-900 shadow-sm"
                    }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${message.senderId === user?.id
                      ? "text-orange-100"
                      : "text-gray-500"
                      }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={sendMessage} className="flex space-x-4">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}