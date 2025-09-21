"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Search,
    ArrowLeft,
    MoreVertical,
    Send,
    Phone,
    Video,
    Info,
    Check,
    CheckCheck
} from "lucide-react";

interface ChatUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
}

interface Chat {
    id: string;
    user1: ChatUser;
    user2: ChatUser;
    lastMessage?: {
        content: string;
        createdAt: string;
        senderId: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    chatId: string;
    createdAt: string;
    readAt?: string | null;
    sender: ChatUser;
    receiver: ChatUser;
}

export default function MessagesPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (!isLoading && user) {
            fetchChats();
        }
    }, [isLoading, user, router]);

    const fetchChats = async () => {
        try {
            const response = await fetch("/api/chats", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
            });

            if (response.ok) {
                const chatsData = await response.json();
                setChats(chatsData);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const response = await fetch(`/api/chats/${chatId}/messages`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
            });

            if (response.ok) {
                const messagesData = await response.json();
                setMessages(messagesData);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedChat || !user) return;

        const otherUser = selectedChat.user1.id === user.id ? selectedChat.user2 : selectedChat.user1;

        try {
            const messageData = {
                content: newMessage.trim(),
                receiverId: otherUser.id,
                chatId: selectedChat.id,
            };

            const response = await fetch(`/api/chats/${selectedChat.id}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
                body: JSON.stringify(messageData),
            });

            if (response.ok) {
                const message = await response.json();
                setMessages((prev) => [...prev, message]);
                setNewMessage("");
                // Refresh chats to update last message
                fetchChats();
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const selectChat = (chat: Chat) => {
        setSelectedChat(chat);
        fetchMessages(chat.id);
        // Marcar mensajes como leídos cuando se selecciona el chat
        markMessagesAsRead(chat.id);
    };

    const markMessagesAsRead = async (chatId: string) => {
        if (!user) return;

        try {
            await fetch(`/api/chats/${chatId}/messages/read-all`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                },
            });
            // Actualizar la lista de chats para reflejar los cambios
            fetchChats();
            // También actualizar los mensajes para mostrar el estado correcto
            fetchMessages(chatId);
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    };

    // Función para refrescar mensajes periódicamente
    useEffect(() => {
        if (selectedChat) {
            const interval = setInterval(() => {
                fetchMessages(selectedChat.id);
            }, 5000); // Refrescar cada 5 segundos

            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    const getOtherUser = (chat: Chat): ChatUser => {
        return chat.user1.id === user?.id ? chat.user2 : chat.user1;
    };

    const hasUnreadMessages = (chat: Chat): boolean => {
        // Simulamos mensajes no leídos si el último mensaje no es mío
        // y fue enviado en las últimas 24 horas
        if (chat.lastMessage && chat.lastMessage.senderId !== user?.id) {
            const messageTime = new Date(chat.lastMessage.createdAt);
            const now = new Date();
            const hoursDiff = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
            return hoursDiff < 24; // Considerar no leído si es menor a 24 horas
        }
        return false;
    };

    const getMessageReadStatus = (lastMessage: any) => {
        // Si el mensaje tiene readAt, mostrar double check (leído)
        if (lastMessage.readAt) {
            return <CheckCheck className="w-3 h-3 text-blue-500" />;
        }
        // Si no tiene readAt, mostrar single check (enviado pero no leído)
        return <Check className="w-3 h-3 text-gray-400" />;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return "Hoy";
        } else if (diffDays === 2) {
            return "Ayer";
        } else if (diffDays <= 7) {
            return `${diffDays - 1} días`;
        } else {
            return date.toLocaleDateString("es-CO");
        }
    };

    const formatMessageTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("es-CO", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredChats = chats.filter((chat) => {
        const otherUser = getOtherUser(chat);
        return otherUser.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Mobile Header - Solo visible en móviles */}
            <div className="lg:hidden bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/dashboard")}
                        className="p-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-lg font-semibold">
                        {selectedChat ? getOtherUser(selectedChat).name : "Mensajes"}
                    </h1>
                    <Button variant="ghost" size="sm" className="p-2">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Left Sidebar - Chat List */}
            <div className={`bg-white border-r border-gray-200 flex flex-col ${selectedChat
                    ? "hidden lg:flex lg:w-80"
                    : "w-full lg:w-80"
                }`}>
                {/* Desktop Header */}
                <div className="hidden lg:block p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/dashboard")}
                            className="p-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h1 className="text-xl font-semibold">Mensajes</h1>
                        <Button variant="ghost" size="sm" className="p-2">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar conversaciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="lg:hidden p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar conversaciones..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <p className="text-sm md:text-base">No tienes conversaciones aún</p>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/adopt")}
                                className="mt-2 touch-target"
                                size="sm"
                            >
                                Explorar mascotas
                            </Button>
                        </div>
                    ) : (
                        filteredChats.map((chat) => {
                            const otherUser = getOtherUser(chat);
                            const isSelected = selectedChat?.id === chat.id;

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => selectChat(chat)}
                                    className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors touch-target ${isSelected ? "bg-purple-50 border-l-4 border-l-purple-500" : ""
                                        }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                                            <AvatarImage src={otherUser.avatar} />
                                            <AvatarFallback className="bg-purple-100 text-purple-600">
                                                {otherUser.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 min-w-0 flex-1">
                                                    <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">
                                                        {otherUser.name}
                                                    </h3>
                                                    {/* Punto azul para mensajes no leídos */}
                                                    {chat.lastMessage &&
                                                        chat.lastMessage.senderId !== user?.id &&
                                                        hasUnreadMessages(chat) && (
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                                        )}
                                                </div>
                                                <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                    {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : formatTime(chat.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs md:text-sm text-gray-600 truncate flex-1">
                                                    {chat.lastMessage?.content || "Conversación iniciada"}
                                                </p>
                                                {/* Check marks para el último mensaje si lo envié yo */}
                                                {chat.lastMessage &&
                                                    chat.lastMessage.senderId === user?.id && (
                                                        <div className="ml-2 flex-shrink-0">
                                                            {getMessageReadStatus(chat.lastMessage)}
                                                        </div>
                                                    )}
                                            </div>
                                            <Badge variant="outline" className="mt-1 text-xs">
                                                {otherUser.role === "USER" ? "Adoptante" : "Dueño"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Center - Chat Interface */}
            <div className={`flex-1 flex flex-col ${selectedChat
                    ? "w-full lg:flex"
                    : "hidden lg:flex"
                }`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-3 md:p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedChat(null)}
                                        className="lg:hidden p-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                    <Avatar className="w-8 h-8 md:w-10 md:h-10">
                                        <AvatarImage src={getOtherUser(selectedChat).avatar} />
                                        <AvatarFallback className="bg-purple-100 text-purple-600">
                                            {getOtherUser(selectedChat).name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <h2 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                                            {getOtherUser(selectedChat).name}
                                        </h2>
                                        <p className="text-xs md:text-sm text-gray-500 truncate">
                                            {getOtherUser(selectedChat).role === "USER" ? "Adoptante" : "Dueño de mascota"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    <Button variant="ghost" size="sm" className="touch-target p-2">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="touch-target p-2">
                                        <Video className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="touch-target p-2">
                                        <Info className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
                            {messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-sm md:text-base">No hay mensajes aún. ¡Comienza la conversación!</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg ${message.senderId === user?.id
                                                ? "bg-purple-500 text-white"
                                                : "bg-white text-gray-900 shadow-sm border"
                                                }`}
                                        >
                                            <p className="text-sm break-words">{message.content}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p
                                                    className={`text-xs ${message.senderId === user?.id
                                                        ? "text-purple-100"
                                                        : "text-gray-500"
                                                        }`}
                                                >
                                                    {formatMessageTime(message.createdAt)}
                                                </p>
                                                {/* Check marks solo para mensajes que envié */}
                                                {message.senderId === user?.id && (
                                                    <div className="ml-2">
                                                        {getMessageReadStatus(message)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-3 md:p-4">
                            <form onSubmit={sendMessage} className="flex space-x-2 md:space-x-4">
                                <Input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 min-h-[44px]"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(e);
                                        }
                                    }}
                                />
                                <Button
                                    type="submit"
                                    className="bg-purple-500 hover:bg-purple-600 touch-target px-3 md:px-4"
                                    disabled={!newMessage.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    /* No Chat Selected */
                    <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
                        <div className="text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
                            </div>
                            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                                Selecciona una conversación
                            </h3>
                            <p className="text-sm md:text-base text-gray-500 max-w-sm mx-auto">
                                Elige una conversación de la lista para comenzar a chatear
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar - User Info - Solo visible en desktop */}
            {selectedChat && (
                <div className="hidden xl:block w-80 bg-white border-l border-gray-200 p-4">
                    <div className="text-center">
                        <Avatar className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4">
                            <AvatarImage src={getOtherUser(selectedChat).avatar} />
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-lg lg:text-xl">
                                {getOtherUser(selectedChat).name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                            {getOtherUser(selectedChat).name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 break-words">
                            {getOtherUser(selectedChat).email}
                        </p>
                        <Badge className="mb-6 text-xs">
                            {getOtherUser(selectedChat).role === "USER" ? "Adoptante" : "Dueño de mascota"}
                        </Badge>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Información de contacto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium break-words">{getOtherUser(selectedChat).email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Tipo de usuario</p>
                                    <p className="text-sm font-medium">
                                        {getOtherUser(selectedChat).role === "USER" ? "Adoptante" : "Dueño de mascota"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Conversación</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500">Iniciada</p>
                                    <p className="text-sm font-medium">{formatTime(selectedChat.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Mensajes</p>
                                    <p className="text-sm font-medium">{messages.length}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2">
                        <Button variant="outline" className="w-full touch-target" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Llamar
                        </Button>
                        <Button variant="outline" className="w-full touch-target" size="sm">
                            <Video className="w-4 h-4 mr-2" />
                            Videollamada
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}