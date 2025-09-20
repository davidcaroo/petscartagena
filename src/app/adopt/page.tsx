"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  Search,
  Filter,
  MessageCircle,
  Dog,
  Cat,
  Rabbit,
  Bird,
  Fish,
  Circle,
  Turtle,
  Crown
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdoptPetButton from "@/components/AdoptPetButton";

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

export default function AdoptPage() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    type: "ALL",
    size: "ALL",
    gender: "ALL",
    ageMin: "",
    ageMax: "",
    search: ""
  });

  useEffect(() => {
    loadPets();
    if (user && token) {
      loadFavorites();
    }
  }, [user, token]);

  useEffect(() => {
    loadPets();
  }, [filters]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "ALL") {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/pets/available?${params}`);
      if (response.ok) {
        const petsData = await response.json();
        setPets(petsData);
      }
    } catch (error) {
      console.error("Error loading pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await fetch("/api/favorites", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const favoritesData = await response.json();
        const favoriteIds = new Set(favoritesData.map((fav: any) => fav.petId as string));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (petId: string) => {
    if (!user || !token) {
      router.push("/auth/signin");
      return;
    }

    try {
      const isFavorite = favorites.has(petId);

      if (isFavorite) {
        // Quitar de favoritos
        const response = await fetch(`/api/favorites?petId=${petId}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            newFavorites.delete(petId);
            return newFavorites;
          });
        }
      } else {
        // Agregar a favoritos
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ petId })
        });

        if (response.ok) {
          setFavorites(prev => new Set([...prev, petId]));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const contactOwner = async (petId: string, ownerId: string) => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

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

  const clearFilters = () => {
    setFilters({
      type: "ALL",
      size: "ALL",
      gender: "ALL",
      ageMin: "",
      ageMax: "",
      search: ""
    });
  };

  const getAgeInYears = (ageInMonths: number) => {
    if (ageInMonths < 12) {
      return `${ageInMonths} mes${ageInMonths !== 1 ? 'es' : ''}`;
    }
    const years = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;
    if (remainingMonths === 0) {
      return `${years} año${years !== 1 ? 's' : ''}`;
    }
    return `${years} año${years !== 1 ? 's' : ''} y ${remainingMonths} mes${remainingMonths !== 1 ? 'es' : ''}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Adoptar una Mascota</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="hidden sm:flex"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtros de Búsqueda</span>
            </CardTitle>
            <CardDescription>
              Encuentra la mascota perfecta usando nuestros filtros avanzados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Nombre, raza, descripción..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Mascota</label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos los tipos</SelectItem>
                    {Object.entries(petTypeTranslations).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamaño</label>
                <Select value={filters.size} onValueChange={(value) => setFilters(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Cualquier tamaño</SelectItem>
                    {Object.entries(sizeTranslations).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Género</label>
                <Select value={filters.gender} onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Cualquier género</SelectItem>
                    {Object.entries(genderTranslations).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Edad Mínima (meses)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.ageMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, ageMin: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Edad Máxima (meses)</label>
                <Input
                  type="number"
                  placeholder="240"
                  value={filters.ageMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, ageMax: e.target.value }))}
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full sm:hidden"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Mascotas Disponibles ({pets.length})
            </h2>
          </div>
        </div>

        {/* Pets Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : pets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron mascotas
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta ajustar tus filtros para ver más resultados
              </p>
              <Button onClick={clearFilters}>
                Limpiar todos los filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => {
              const IconComponent = petTypeIcons[pet.type as keyof typeof petTypeIcons] || Heart;
              return (
                <Card key={pet.id} className="hover:shadow-lg transition-shadow overflow-hidden">
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

                    {/* Favorite Heart Button */}
                    <div className="absolute top-3 left-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pet.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-200 ${favorites.has(pet.id)
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
                          }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${favorites.has(pet.id) ? 'fill-current' : ''
                            }`}
                        />
                      </button>
                    </div>

                    {/* Disponible Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500">
                        Disponible
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

                      <div className="flex items-center gap-2">
                        <AdoptPetButton
                          petId={pet.id}
                          petName={pet.name}
                          petType={pet.type}
                          isAvailable={pet.isAvailable}
                          ownerName={pet.owner.name}
                          variant="outline"
                          size="sm"
                          className="bg-red-500 hover:bg-red-600 text-white border-red-500"
                        />

                        <Button
                          size="sm"
                          onClick={() => contactOwner(pet.id, pet.owner.id)}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Contactar
                        </Button>
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