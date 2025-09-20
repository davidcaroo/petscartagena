"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
    Heart,
    MessageCircle,
    Dog,
    Cat,
    Rabbit,
    Bird,
    Fish,
    Circle,
    Turtle,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";

interface Pet {
    id: string;
    name: string;
    type: string;
    breed?: string;
    age: number;
    color?: string;
    size?: string;
    gender?: string;
    description: string;
    favoriteFood?: string;
    favoriteToy?: string;
    medicalTreatment?: string;
    isAvailable: boolean;
    images: { url: string }[];
    owner: {
        id: string;
        name: string;
        city?: string;
    };
}

interface Favorite {
    id: string;
    userId: string;
    petId: string;
    createdAt: string;
    pet: Pet;
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

const sizeTranslations = {
    SMALL: "Pequeño",
    MEDIUM: "Mediano",
    LARGE: "Grande",
    EXTRA_LARGE: "Extra Grande"
};

const genderTranslations = {
    MALE: "Macho",
    FEMALE: "Hembra"
};

export default function FavoritesPage() {
    const { user, isLoading, token } = useAuth();
    const router = useRouter();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (user && token) {
            loadFavorites();
        }
    }, [user, token, isLoading, router]);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/favorites", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const favoritesData = await response.json();
                setFavorites(favoritesData);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (petId: string) => {
        try {
            const response = await fetch(`/api/favorites?petId=${petId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setFavorites(prev => prev.filter(fav => fav.petId !== petId));
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    const contactOwner = async (petId: string, ownerId: string) => {
        try {
            // Create or get existing chat
            const response = await fetch("/api/chats/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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

    if (isLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

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
                            <h1 className="text-2xl font-bold text-gray-900">Mis Mascotas Favoritas</h1>
                            <p className="text-gray-600">Todas las mascotas que has marcado como favoritas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {favorites.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No tienes mascotas favoritas aún
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Explora las mascotas disponibles y marca las que más te gusten
                            </p>
                            <Link href="/adopt">
                                <Button className="bg-orange-500 hover:bg-orange-600">
                                    Explorar Mascotas
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {favorites.length} {favorites.length === 1 ? 'mascota favorita' : 'mascotas favoritas'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((favorite) => {
                                const pet = favorite.pet;
                                const IconComponent = petTypeIcons[pet.type as keyof typeof petTypeIcons] || Heart;

                                return (
                                    <Card key={favorite.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                                        {/* Image */}
                                        <div className="relative h-48 bg-gray-200">
                                            {pet.images.length > 0 ? (
                                                <img
                                                    src={pet.images[0].url}
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <IconComponent className="w-16 h-16 text-gray-400" />
                                                </div>
                                            )}

                                            {/* Remove from Favorites Button */}
                                            <div className="absolute top-3 left-3">
                                                <button
                                                    onClick={() => removeFavorite(pet.id)}
                                                    className="p-2 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <Heart className="w-5 h-5 fill-current" />
                                                </button>
                                            </div>

                                            {/* Disponible Badge */}
                                            <div className="absolute top-3 right-3">
                                                <Badge className={pet.isAvailable ? "bg-green-500" : "bg-gray-500"}>
                                                    {pet.isAvailable ? "Disponible" : "No disponible"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {pet.name}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <IconComponent className="w-4 h-4" />
                                                        <span>{petTypeTranslations[pet.type as keyof typeof petTypeTranslations]}</span>
                                                        {pet.breed && <span>• {pet.breed}</span>}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {getAgeInYears(pet.age)}
                                                    </div>
                                                    {pet.size && (
                                                        <div className="text-xs text-gray-500">
                                                            {sizeTranslations[pet.size as keyof typeof sizeTranslations]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {pet.description}
                                            </p>

                                            <div className="space-y-2 mb-4">
                                                {pet.color && (
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <span className="font-medium">Color:</span>
                                                        <span className="ml-1">{pet.color}</span>
                                                    </div>
                                                )}
                                                {pet.gender && (
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <span className="font-medium">Género:</span>
                                                        <span className="ml-1">{genderTranslations[pet.gender as keyof typeof genderTranslations]}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Owner Info */}
                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarFallback className="text-xs">
                                                            {pet.owner.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-900">
                                                            {pet.owner.name}
                                                        </p>
                                                        {pet.owner.city && (
                                                            <p className="text-xs text-gray-500">
                                                                {pet.owner.city}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <Button
                                                    size="sm"
                                                    onClick={() => contactOwner(pet.id, pet.owner.id)}
                                                    disabled={!pet.isAvailable}
                                                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400"
                                                >
                                                    <MessageCircle className="w-4 h-4 mr-1" />
                                                    Contactar
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}