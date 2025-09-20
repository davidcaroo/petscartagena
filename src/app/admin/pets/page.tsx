"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Search, 
  Plus,
  Trash2,
  Edit,
  Eye,
  Dog,
  Cat,
  Filter,
  MoreHorizontal,
  Calendar,
  MapPin,
  User
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

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
  isAvailable: boolean;
  createdAt: string;
  images: { url: string }[];
  owner: {
    id: string;
    name: string;
    email: string;
    city?: string;
  };
}

export default function AdminPetsPage() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard");
      return;
    }

    if (user && token && user.role === "ADMIN") {
      loadPets();
    }
  }, [user, token, isLoading, router]);

  useEffect(() => {
    let filtered = pets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(pet => 
        statusFilter === "available" ? pet.isAvailable : !pet.isAvailable
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(pet => pet.type === typeFilter);
    }

    setFilteredPets(filtered);
  }, [searchTerm, statusFilter, typeFilter, pets]);

  const loadPets = async () => {
    try {
      const response = await fetch("/api/admin/pets", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const petsData = await response.json();
        setPets(petsData);
        setFilteredPets(petsData);
      }
    } catch (error) {
      console.error("Error loading pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePet = async (petId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta mascota? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pets/${petId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        setPets(prev => prev.filter(pet => pet.id !== petId));
        setFilteredPets(prev => prev.filter(pet => pet.id !== petId));
      } else {
        alert("Ocurrió un error al eliminar la mascota");
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Ocurrió un error al eliminar la mascota");
    }
  };

  const togglePetAvailability = async (petId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/pets/${petId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: !currentStatus }),
      });

      if (response.ok) {
        setPets(prev => prev.map(pet => 
          pet.id === petId ? { ...pet, isAvailable: !currentStatus } : pet
        ));
      } else {
        alert("Ocurrió al actualizar el estado de la mascota");
      }
    } catch (error) {
      console.error("Error toggling pet availability:", error);
      alert("Ocurrió al actualizar el estado de la mascota");
    }
  };

  const getPetTypeIcon = (type: string) => {
    switch (type) {
      case "DOG":
        return <Dog className="w-4 h-4" />;
      case "CAT":
        return <Cat className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getPetTypeTranslation = (type: string) => {
    switch (type) {
      case "DOG":
        return "Perro";
      case "CAT":
        return "Gato";
      case "RABBIT":
        return "Conejo";
      case "BIRD":
        return "Ave";
      case "FISH":
        return "Pez";
      case "HAMSTER":
        return "Hámster";
      case "TURTLE":
        return "Tortuga";
      default:
        return "Otro";
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Solo los administradores pueden acceder a este panel
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-7xl px-4">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Mascotas</h1>
                <p className="text-sm text-gray-600">Administra todas las mascotas registradas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mascotas</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-muted-foreground">
                Registradas en total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pets.filter(p => p.isAvailable).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Para adopción
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Adoptadas</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pets.filter(p => !p.isAvailable).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Procesos completados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perros</CardTitle>
              <Dog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pets.filter(p => p.type === "DOG").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Mascotas caninas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtrar Mascotas</CardTitle>
            <CardDescription>
              Busca y filtra mascotas por diferentes criterios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, raza..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="available">Disponibles</SelectItem>
                  <SelectItem value="adopted">Adoptadas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="DOG">Perros</SelectItem>
                  <SelectItem value="CAT">Gatos</SelectItem>
                  <SelectItem value="RABBIT">Conejos</SelectItem>
                  <SelectItem value="BIRD">Aves</SelectItem>
                  <SelectItem value="OTHER">Otros</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}>
                <Filter className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Mascotas</CardTitle>
            <CardDescription>
              Todas las mascotas registradas en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Información</TableHead>
                    <TableHead>Dueño</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPets.map((pet) => (
                    <TableRow key={pet.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {pet.images.length > 0 ? (
                              <img 
                                src={pet.images[0].url} 
                                alt={pet.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                {getPetTypeIcon(pet.type)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{pet.name}</div>
                            <div className="text-sm text-gray-500">
                              {getPetTypeTranslation(pet.type)} {pet.breed && `• ${pet.breed}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">Edad:</span> {getAgeInYears(pet.age)}
                          </div>
                          {pet.color && (
                            <div className="text-sm">
                              <span className="font-medium">Color:</span> {pet.color}
                            </div>
                          )}
                          {pet.gender && (
                            <div className="text-sm">
                              <span className="font-medium">Género:</span> {pet.gender === "MALE" ? "Macho" : "Hembra"}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {pet.owner.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{pet.owner.name}</div>
                            {pet.owner.city && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {pet.owner.city}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={pet.isAvailable ? "default" : "secondary"}
                          className={
                            pet.isAvailable 
                              ? "bg-green-100 text-green-800 hover:bg-green-200" 
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        >
                          {pet.isAvailable ? "Disponible" : "Adoptado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(pet.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/adopt?pet=${pet.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePetAvailability(pet.id, pet.isAvailable)}>
                              {pet.isAvailable ? (
                                <>
                                  <Heart className="w-4 h-4 mr-2" />
                                  Marcar como adoptado
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Marcar como disponible
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deletePet(pet.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar mascota
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredPets.length === 0 && (
              <div className="text-center py-8">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No se encontraron mascotas
                </h3>
                <p className="text-gray-600">
                  No hay mascotas que coincidan con tus filtros
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}