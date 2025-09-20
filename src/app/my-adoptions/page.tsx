"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
    Heart,
    Search,
    Filter,
    Calendar,
    MessageCircle,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Dog,
    Cat,
    Rabbit,
    Bird,
    Fish,
    Circle,
    Turtle
} from "lucide-react";
import Link from "next/link";

interface AdoptionRequest {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
    message: string;
    createdAt: string;
    updatedAt: string;
    pet: {
        id: string;
        name: string;
        type: string;
        breed?: string;
        age: number;
        isAvailable: boolean;
        images: { url: string }[];
        owner: {
            id: string;
            name: string;
            email: string;
        };
    };
}

const petTypeIcons = {
    DOG: Dog,
    CAT: Cat,
    RABBIT: Rabbit,
    BIRD: Bird,
    FISH: Fish,
    HAMSTER: Circle,
    TURTLE: Turtle,
    OTHER: Heart
};

const petTypeTranslations = {
    DOG: "Perro",
    CAT: "Gato",
    RABBIT: "Conejo",
    BIRD: "Ave",
    FISH: "Pez",
    HAMSTER: "Hámster",
    TURTLE: "Tortuga",
    OTHER: "Otro"
};

const statusTranslations = {
    PENDING: "Pendiente",
    ACCEPTED: "Aprobada",
    REJECTED: "Rechazada",
    CANCELLED: "Cancelada"
};

const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    ACCEPTED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
    CANCELLED: "bg-gray-100 text-gray-800 border-gray-200"
};

const statusIcons = {
    PENDING: Clock,
    ACCEPTED: CheckCircle,
    REJECTED: XCircle,
    CANCELLED: AlertCircle
};

export default function MyAdoptionsPage() {
    const { user, isLoading, token } = useAuth();
    const router = useRouter();
    const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
    const [filteredAdoptions, setFilteredAdoptions] = useState<AdoptionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (user && token) {
            loadAdoptions();
        }
    }, [user, token, isLoading, router]);

    useEffect(() => {
        let filtered = adoptions;

        // Filtro de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(adoption =>
                adoption.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                adoption.pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                adoption.pet.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro de estado
        if (statusFilter !== "all") {
            filtered = filtered.filter(adoption => adoption.status === statusFilter);
        }

        // Filtro de tipo de mascota
        if (typeFilter !== "all") {
            filtered = filtered.filter(adoption => adoption.pet.type === typeFilter);
        }

        setFilteredAdoptions(filtered);
    }, [searchTerm, statusFilter, typeFilter, adoptions]);

    const loadAdoptions = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/adoptions/my-requests", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const adoptionsData = await response.json();
                setAdoptions(adoptionsData);
            }
        } catch (error) {
            console.error("Error loading adoptions:", error);
        } finally {
            setLoading(false);
        }
    };

    const contactOwner = async (petId: string, ownerId: string) => {
        try {
            const response = await fetch("/api/chats/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: ownerId,
                    petId: petId
                }),
            });

            if (response.ok) {
                const chat = await response.json();
                router.push(`/chat/${chat.chatId || chat.id}`);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    const getAgeInYears = (ageInMonths: number) => {
        if (ageInMonths < 12) {
            return `${ageInMonths} ${ageInMonths === 1 ? 'mes' : 'meses'}`;
        } else {
            const years = Math.floor(ageInMonths / 12);
            const months = ageInMonths % 12;
            if (months === 0) {
                return `${years} ${years === 1 ? 'año' : 'años'}`;
            } else {
                return `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusStats = () => {
        const stats = {
            total: adoptions.length,
            pending: adoptions.filter(a => a.status === 'PENDING').length,
            accepted: adoptions.filter(a => a.status === 'ACCEPTED').length,
            rejected: adoptions.filter(a => a.status === 'REJECTED').length,
        };
        return stats;
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const stats = getStatusStats();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto max-w-6xl px-4 py-6">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al Dashboard
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes de Adopción</h1>
                            <p className="text-gray-600">Revisa el estado de todas tus solicitudes de adopción</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="container mx-auto max-w-6xl px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                                <Heart className="w-8 h-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pendientes</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                </div>
                                <Clock className="w-8 h-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                                </div>
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                                </div>
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nombre de mascota, raza o dueño..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="PENDING">Pendiente</SelectItem>
                                    <SelectItem value="ACCEPTED">Aprobada</SelectItem>
                                    <SelectItem value="REJECTED">Rechazada</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelada</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Type Filter */}
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    <SelectItem value="DOG">Perro</SelectItem>
                                    <SelectItem value="CAT">Gato</SelectItem>
                                    <SelectItem value="RABBIT">Conejo</SelectItem>
                                    <SelectItem value="BIRD">Ave</SelectItem>
                                    <SelectItem value="OTHER">Otro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Adoptions List */}
                {filteredAdoptions.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {adoptions.length === 0
                                    ? "No has hecho solicitudes de adopción aún"
                                    : "No se encontraron solicitudes con esos filtros"
                                }
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {adoptions.length === 0
                                    ? "Explora las mascotas disponibles y envía tu primera solicitud"
                                    : "Intenta cambiar los filtros para ver más resultados"
                                }
                            </p>
                            {adoptions.length === 0 && (
                                <Link href="/adopt">
                                    <Button className="bg-orange-500 hover:bg-orange-600">
                                        Explorar Mascotas
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredAdoptions.map((adoption) => {
                            const pet = adoption.pet;
                            const IconComponent = petTypeIcons[pet.type as keyof typeof petTypeIcons] || Heart;
                            const StatusIcon = statusIcons[adoption.status];

                            return (
                                <Card key={adoption.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Pet Image */}
                                            <div className="flex-shrink-0">
                                                <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                                                    {pet.images.length > 0 ? (
                                                        <img
                                                            src={pet.images[0].url}
                                                            alt={pet.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                            <IconComponent className="w-12 h-12 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pet Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                            {pet.name}
                                                        </h3>
                                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                                            <IconComponent className="w-4 h-4" />
                                                            <span>{petTypeTranslations[pet.type as keyof typeof petTypeTranslations]}</span>
                                                            {pet.breed && <span>• {pet.breed}</span>}
                                                            <span>• {getAgeInYears(pet.age)}</span>
                                                        </div>
                                                    </div>

                                                    <Badge className={`${statusColors[adoption.status]} border`}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusTranslations[adoption.status]}
                                                    </Badge>
                                                </div>

                                                {/* Message */}
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium text-gray-900 mb-1">Tu mensaje:</p>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                        {adoption.message}
                                                    </p>
                                                </div>

                                                {/* Owner Info and Actions */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarFallback className="text-sm">
                                                                {pet.owner.name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {pet.owner.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Dueño de {pet.name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => contactOwner(pet.id, pet.owner.id)}
                                                        >
                                                            <MessageCircle className="w-4 h-4 mr-1" />
                                                            Chatear
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Dates */}
                                                <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
                                                    <span>
                                                        <Calendar className="w-3 h-3 inline mr-1" />
                                                        Solicitada: {formatDate(adoption.createdAt)}
                                                    </span>
                                                    {adoption.updatedAt !== adoption.createdAt && (
                                                        <span>
                                                            Actualizada: {formatDate(adoption.updatedAt)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}