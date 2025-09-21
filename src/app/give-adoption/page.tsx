"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  X,
  Upload,
  Heart,
  Dog,
  Cat,
  Rabbit,
  Bird,
  Fish,
  Circle,
  Turtle,
  Camera
} from "lucide-react";
import { PetType, PetSize, PetGender } from "@prisma/client";

interface PetFormData {
  name: string;
  type: PetType;
  breed: string;
  age: string;
  color: string;
  size: PetSize;
  gender: PetGender;
  description: string;
  favoriteFood: string;
  favoriteToy: string;
  medicalTreatment: string;
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

export default function GiveAdoptionPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    type: PetType.DOG,
    breed: "",
    age: "",
    color: "",
    size: PetSize.MEDIUM,
    gender: PetGender.MALE,
    description: "",
    favoriteFood: "",
    favoriteToy: "",
    medicalTreatment: ""
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (!isLoading && user && user.role !== "OWNER") {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 5) {
      alert("Solo puedes subir un máximo de 5 imágenes");
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add pet data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`image${index}`, image);
      });

      const response = await fetch("/api/pets", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          type: PetType.DOG,
          breed: "",
          age: "",
          color: "",
          size: PetSize.MEDIUM,
          gender: PetGender.MALE,
          description: "",
          favoriteFood: "",
          favoriteToy: "",
          medicalTreatment: ""
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        const error = await response.json();
        alert(error.error || "Ocurrió un error al crear la mascota");
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      alert("Ocurrió un error al crear la mascota");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "OWNER") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-6">
              Solo los dueños de mascotas pueden registrar mascotas para adopción
            </p>
            <Button onClick={() => router.push("/dashboard")}>
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Mascota Registrada!
            </h2>
            <p className="text-gray-600 mb-6">
              Tu mascota ha sido registrada exitosamente y ahora está disponible para adopción.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Ver Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                }}
                className="w-full"
              >
                Registrar Otra Mascota
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation"
                aria-label="Volver"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Dar en Adopción</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Encuentra un hogar amoroso para tu mascota
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Completa el formulario con la información de tu mascota. Cuantos más detalles proporciones,
            mejores serán las posibilidades de encontrar el hogar perfecto.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Información Básica</CardTitle>
              <CardDescription className="text-sm">
                Datos principales de tu mascota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nombre de la Mascota *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Max, Luna, Buddy..."
                    className="min-h-[44px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium">Tipo de Mascota *</Label>
                  <Select value={formData.type} onValueChange={(value: PetType) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(petTypeTranslations).map(([key, label]) => {
                        const IconComponent = petTypeIcons[key as keyof typeof petTypeIcons];
                        return (
                          <SelectItem key={key} value={key} className="py-3">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed" className="text-sm font-medium">Raza</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => setFormData(prev => ({ ...prev, breed: e.target.value }))}
                    placeholder="Ej: Labrador, Siames, Mestizo..."
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">Edad (en meses) *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="240"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Ej: 12 (para 1 año)"
                    className="min-h-[44px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm font-medium">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="Ej: Marrón, Blanco con manchas..."
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size" className="text-sm font-medium">Tamaño</Label>
                  <Select value={formData.size} onValueChange={(value: PetSize) => setFormData(prev => ({ ...prev, size: value }))}>
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(sizeTranslations).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="py-3">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="gender" className="text-sm font-medium">Género</Label>
                  <Select value={formData.gender} onValueChange={(value: PetGender) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="min-h-[44px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(genderTranslations).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="py-3">{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Descripción</CardTitle>
              <CardDescription className="text-sm">
                Cuenta más sobre tu mascota, su personalidad y cuidados especiales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe la personalidad de tu mascota, sus gustos, hábitos, cualquier información relevante para potenciales adoptantes..."
                  rows={4}
                  className="min-h-[100px] resize-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Información Adicional</CardTitle>
              <CardDescription className="text-sm">
                Detalles extra que ayudarán a los adoptantes a conocer mejor a tu mascota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="favoriteFood" className="text-sm font-medium">Comida Favorita</Label>
                  <Input
                    id="favoriteFood"
                    value={formData.favoriteFood}
                    onChange={(e) => setFormData(prev => ({ ...prev, favoriteFood: e.target.value }))}
                    placeholder="Ej: Pollo, Croquetas..."
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="favoriteToy" className="text-sm font-medium">Juguete Favorito</Label>
                  <Input
                    id="favoriteToy"
                    value={formData.favoriteToy}
                    onChange={(e) => setFormData(prev => ({ ...prev, favoriteToy: e.target.value }))}
                    placeholder="Ej: Pelota, Cuerda..."
                    className="min-h-[44px]"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label htmlFor="medicalTreatment" className="text-sm font-medium">Tratamiento Médico</Label>
                  <Input
                    id="medicalTreatment"
                    value={formData.medicalTreatment}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalTreatment: e.target.value }))}
                    placeholder="Ej: Medicamento, Terapia..."
                    className="min-h-[44px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Fotos de tu Mascota</CardTitle>
              <CardDescription className="text-sm">
                Sube hasta 5 fotos. Las buenas fotos aumentan las posibilidades de adopción.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center touch-manipulation">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center space-y-2">
                      <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Haz clic para subir fotos o arrastra y suelta
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG, GIF hasta 10MB cada una (máx. 5 fotos)
                      </span>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 sm:h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                          aria-label={`Eliminar imagen ${index + 1}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {images.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-500">
                      Aún no has subido ninguna foto
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-6 sm:px-8 py-3 text-base sm:text-lg min-h-[48px] w-full sm:w-auto"
              disabled={loading || !formData.name || !formData.description || !formData.age}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registrando Mascota...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Registrar Mascota para Adopción</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}