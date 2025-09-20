"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
    Heart,
    PlusCircle,
    Edit3,
    Trash2,
    Camera,
    Dog,
    Cat,
    Rabbit,
    Bird,
    Fish,
    Circle,
    Turtle,
    ArrowLeft,
    Eye,
    EyeOff
} from "lucide-react";

interface Pet {
    id: string;
    name: string;
    type: string;
    breed?: string;
    age: number;
    color?: string;
    size?: string;
    gender?: string;
    description?: string;
    favoriteFood?: string;
    favoriteToy?: string;
    medicalTreatment?: string;
    isAvailable: boolean;
    images: Array<{
        id: string;
        url: string;
        order: number;
    }>;
    createdAt: string;
    updatedAt: string;
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

const typeTranslations = {
    DOG: "Perro",
    CAT: "Gato",
    RABBIT: "Conejo",
    BIRD: "Pájaro",
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

export default function MyPetsPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        breed: "",
        age: "",
        color: "",
        size: "",
        gender: "",
        description: "",
        favoriteFood: "",
        favoriteToy: "",
        medicalTreatment: "",
        isAvailable: true
    });

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (!isLoading && user && user.role !== "OWNER") {
            router.push("/dashboard");
            return;
        }

        if (!isLoading && user && user.role === "OWNER") {
            loadMyPets();
        }
    }, [isLoading, user, router]);

    const loadMyPets = async () => {
        try {
            const response = await fetch("/api/pets/my-pets", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const petsData = await response.json();
                setPets(petsData);
            } else {
                console.error("Error loading pets");
            }
        } catch (error) {
            console.error("Error loading pets:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (ageInMonths: number) => {
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

    const openEditDialog = (pet: Pet) => {
        setEditingPet(pet);
        setFormData({
            name: pet.name,
            type: pet.type,
            breed: pet.breed || "",
            age: pet.age.toString(),
            color: pet.color || "",
            size: pet.size || "",
            gender: pet.gender || "",
            description: pet.description || "",
            favoriteFood: pet.favoriteFood || "",
            favoriteToy: pet.favoriteToy || "",
            medicalTreatment: pet.medicalTreatment || "",
            isAvailable: pet.isAvailable
        });
        setIsEditDialogOpen(true);
    };

    const handleEdit = async () => {
        if (!editingPet) return;

        try {
            const response = await fetch(`/api/pets/${editingPet.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    age: parseInt(formData.age)
                })
            });

            if (response.ok) {
                setIsEditDialogOpen(false);
                setEditingPet(null);
                loadMyPets(); // Recargar la lista
            } else {
                console.error("Error updating pet");
            }
        } catch (error) {
            console.error("Error updating pet:", error);
        }
    };

    const handleDelete = async (pet: Pet) => {
        try {
            const response = await fetch(`/api/pets/${pet.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                setPets(pets.filter(p => p.id !== pet.id));
                setIsDeleteDialogOpen(false);
                setPetToDelete(null);
            } else {
                console.error("Error deleting pet");
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    const toggleAvailability = async (pet: Pet) => {
        try {
            const response = await fetch(`/api/pets/${pet.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    isAvailable: !pet.isAvailable
                })
            });

            if (response.ok) {
                loadMyPets(); // Recargar la lista
            } else {
                console.error("Error updating pet availability");
            }
        } catch (error) {
            console.error("Error updating pet availability:", error);
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user || user.role !== "OWNER") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Acceso no autorizado
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Solo los dueños pueden acceder a esta página.
                    </p>
                    <Button onClick={() => router.push("/dashboard")}>
                        Ir al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
                            <p className="text-gray-600">Gestiona todas tus mascotas registradas</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push("/give-adoption")}
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Añadir Mascota
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Mascotas</p>
                                    <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
                                </div>
                                <Heart className="h-8 w-8 text-orange-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Disponibles</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {pets.filter(p => p.isAvailable).length}
                                    </p>
                                </div>
                                <Eye className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">No Disponibles</p>
                                    <p className="text-2xl font-bold text-gray-600">
                                        {pets.filter(p => !p.isAvailable).length}
                                    </p>
                                </div>
                                <EyeOff className="h-8 w-8 text-gray-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pets Grid */}
                {pets.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <Heart className="h-16 w-16 text-gray-300" />
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No tienes mascotas registradas
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Comienza añadiendo tu primera mascota para darla en adopción
                                </p>
                                <Button
                                    onClick={() => router.push("/give-adoption")}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Añadir Primera Mascota
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => {
                            const IconComponent = petTypeIcons[pet.type as keyof typeof petTypeIcons] || Heart;

                            return (
                                <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative">
                                        {pet.images.length > 0 ? (
                                            <img
                                                src={pet.images[0].url}
                                                alt={pet.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                                <IconComponent className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Badge
                                                variant={pet.isAvailable ? "default" : "secondary"}
                                                className={pet.isAvailable ? "bg-green-500" : "bg-gray-500"}
                                            >
                                                {pet.isAvailable ? "Disponible" : "No disponible"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{pet.name}</CardTitle>
                                                <CardDescription>
                                                    {typeTranslations[pet.type as keyof typeof typeTranslations]} • {calculateAge(pet.age)}
                                                </CardDescription>
                                            </div>
                                            <IconComponent className="h-6 w-6 text-orange-500" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {pet.breed && (
                                                <Badge variant="outline" className="text-xs">
                                                    {pet.breed}
                                                </Badge>
                                            )}
                                            {pet.size && (
                                                <Badge variant="outline" className="text-xs">
                                                    {sizeTranslations[pet.size as keyof typeof sizeTranslations]}
                                                </Badge>
                                            )}
                                            {pet.gender && (
                                                <Badge variant="outline" className="text-xs">
                                                    {genderTranslations[pet.gender as keyof typeof genderTranslations]}
                                                </Badge>
                                            )}
                                        </div>

                                        {pet.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {pet.description}
                                            </p>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditDialog(pet)}
                                                className="flex-1"
                                            >
                                                <Edit3 className="h-4 w-4 mr-1" />
                                                Editar
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleAvailability(pet)}
                                                className="flex-1"
                                            >
                                                {pet.isAvailable ? (
                                                    <EyeOff className="h-4 w-4 mr-1" />
                                                ) : (
                                                    <Eye className="h-4 w-4 mr-1" />
                                                )}
                                                {pet.isAvailable ? "Ocultar" : "Mostrar"}
                                            </Button>

                                            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => setPetToDelete(pet)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Eliminar mascota?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Se eliminará permanentemente
                                                            la mascota "{petToDelete?.name}" y todos sus datos asociados.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setPetToDelete(null)}>
                                                            Cancelar
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => petToDelete && handleDelete(petToDelete)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl">
                        <DialogHeader className="bg-orange-50 -m-6 mb-4 p-6 border-b border-orange-200">
                            <DialogTitle className="text-xl font-bold text-gray-900">Editar Mascota</DialogTitle>
                            <DialogDescription className="text-gray-700">
                                Modifica la información de tu mascota
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4 bg-white">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name" className="text-gray-800 font-medium">Nombre *</Label>
                                    <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nombre de la mascota"
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-type" className="text-gray-800 font-medium">Tipo *</Label>
                                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Selecciona el tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-300">
                                            <SelectItem value="DOG" className="text-gray-900">Perro</SelectItem>
                                            <SelectItem value="CAT" className="text-gray-900">Gato</SelectItem>
                                            <SelectItem value="RABBIT" className="text-gray-900">Conejo</SelectItem>
                                            <SelectItem value="BIRD" className="text-gray-900">Pájaro</SelectItem>
                                            <SelectItem value="FISH" className="text-gray-900">Pez</SelectItem>
                                            <SelectItem value="HAMSTER" className="text-gray-900">Hámster</SelectItem>
                                            <SelectItem value="TURTLE" className="text-gray-900">Tortuga</SelectItem>
                                            <SelectItem value="OTHER">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-breed" className="text-gray-800 font-medium">Raza</Label>
                                    <Input
                                        id="edit-breed"
                                        value={formData.breed}
                                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                        placeholder="Raza de la mascota"
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-age" className="text-gray-800 font-medium">Edad (en meses) *</Label>
                                    <Input
                                        id="edit-age"
                                        type="number"
                                        min="1"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="Edad en meses"
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-color" className="text-gray-800 font-medium">Color</Label>
                                    <Input
                                        id="edit-color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="Color principal"
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-size" className="text-gray-800 font-medium">Tamaño</Label>
                                    <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Tamaño" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-300">
                                            <SelectItem value="SMALL" className="text-gray-900">Pequeño</SelectItem>
                                            <SelectItem value="MEDIUM" className="text-gray-900">Mediano</SelectItem>
                                            <SelectItem value="LARGE" className="text-gray-900">Grande</SelectItem>
                                            <SelectItem value="EXTRA_LARGE" className="text-gray-900">Extra Grande</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-gender" className="text-gray-800 font-medium">Género</Label>
                                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Género" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-300">
                                            <SelectItem value="MALE" className="text-gray-900">Macho</SelectItem>
                                            <SelectItem value="FEMALE" className="text-gray-900">Hembra</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description" className="text-gray-800 font-medium">Descripción</Label>
                                <Textarea
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe las características especiales de tu mascota..."
                                    rows={3}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-favoriteFood" className="text-gray-800 font-medium">Comida Favorita</Label>
                                    <Input
                                        id="edit-favoriteFood"
                                        value={formData.favoriteFood}
                                        onChange={(e) => setFormData({ ...formData, favoriteFood: e.target.value })}
                                        placeholder="¿Cuál es su comida favorita?"
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-favoriteToy" className="text-gray-800 font-medium">Juguete Favorito</Label>
                                    <Input
                                        id="edit-favoriteToy"
                                        value={formData.favoriteToy}
                                        onChange={(e) => setFormData({ ...formData, favoriteToy: e.target.value })}
                                        placeholder="¿Con qué le gusta jugar?"
                                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-medicalTreatment" className="text-gray-800 font-medium">Tratamiento Médico</Label>
                                <Textarea
                                    id="edit-medicalTreatment"
                                    value={formData.medicalTreatment}
                                    onChange={(e) => setFormData({ ...formData, medicalTreatment: e.target.value })}
                                    placeholder="¿Tiene algún tratamiento médico especial?"
                                    rows={2}
                                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>

                        <DialogFooter className="bg-gray-50 -m-6 mt-4 p-6 border-t border-gray-200">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                                Cancelar
                            </Button>
                            <Button onClick={handleEdit} className="bg-orange-500 hover:bg-orange-600 text-white">
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}