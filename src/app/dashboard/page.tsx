"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Plus,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  Dog,
  Cat,
  Home,
  Shield,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalPets: number;
  totalAdoptions: number;
  totalUsers: number;
  totalChats: number;
}

interface UserPet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  age: number;
  images: { url: string }[];
  isAvailable: boolean;
}

export default function DashboardPage() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userPets, setUserPets] = useState<UserPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user && token) {
      loadDashboardData();
    }
  }, [user, token, isLoading, router]);

  const loadDashboardData = async () => {
    try {
      // Load stats based on user role
      if (user?.role === "ADMIN") {
        const statsResponse = await fetch("/api/admin/stats", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      }

      // Load user pets if user is OWNER
      if (user?.role === "OWNER") {
        const petsResponse = await fetch("/api/pets/my-pets", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (petsResponse.ok) {
          const petsData = await petsResponse.json();
          setUserPets(petsData);
        }
      }

      // Load chat count for both USER and OWNER roles
      if (user?.role === "USER" || user?.role === "OWNER") {
        try {
          const chatsResponse = await fetch("/api/chats", {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (chatsResponse.ok) {
            const chatsData = await chatsResponse.json();
            setStats(prev => ({
              ...prev,
              totalChats: chatsData.length,
              totalPets: prev?.totalPets || 0,
              totalAdoptions: prev?.totalAdoptions || 0,
              totalUsers: prev?.totalUsers || 0
            }));
          }
        } catch (error) {
          console.error("Error loading chats:", error);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "USER":
        return "Adoptante";
      case "OWNER":
        return "Dueño de Mascota";
      case "ADMIN":
        return "Administrador";
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "USER":
        return <Heart className="w-5 h-5" />;
      case "OWNER":
        return <Home className="w-5 h-5" />;
      case "ADMIN":
        return <Shield className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getPetIcon = (type: string) => {
    switch (type) {
      case "DOG":
        return <Dog className="w-4 h-4" />;
      case "CAT":
        return <Cat className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/petscartagena-logo.png"
                  alt="PetsCartagena"
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-gray-900">PetsCartagena</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role)}
                    <Badge variant="secondary" className="text-xs">
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user.name}!
          </h1>
          <p className="text-gray-600">
            Gestiona tu cuenta y encuentra el compañero perfecto
          </p>
        </div>

        {/* Admin Dashboard */}
        {user.role === "ADMIN" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Mascotas</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPets}</div>
                <p className="text-xs text-muted-foreground">
                  Registradas en el sistema
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adopciones</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdoptions}</div>
                <p className="text-xs text-muted-foreground">
                  Procesos completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Usuarios registrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chats</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChats}</div>
                <p className="text-xs text-muted-foreground">
                  Conversaciones activas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Dashboard - Simple stats for Adopters */}
        {user.role === "USER" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mis Conversaciones</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChats}</div>
                <p className="text-xs text-muted-foreground">
                  Chats con dueños de mascotas
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/adopt")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Encuentra tu mascota</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Explora mascotas disponibles
                </p>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Ver mascotas
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Common Actions */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/adopt")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-orange-500" />
                <span>Adoptar una Mascota</span>
              </CardTitle>
              <CardDescription>
                Explora las mascotas disponibles y encuentra tu compañero perfecto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Ver Mascotas Disponibles
              </Button>
            </CardContent>
          </Card>

          {/* User Actions - Messages for Adopters */}
          {user.role === "USER" && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/messages")}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                  <span>Mensajes</span>
                </CardTitle>
                <CardDescription>
                  Revisa las respuestas de los dueños de mascotas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  Ver Mensajes ({stats?.totalChats || 0})
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Owner Actions */}
          {user.role === "OWNER" && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/give-adoption")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-green-500" />
                    <span>Registrar Mascota</span>
                  </CardTitle>
                  <CardDescription>
                    Añade una nueva mascota para dar en adopción
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    Nueva Mascota
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/my-pets")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="w-5 h-5 text-blue-500" />
                    <span>Mis Mascotas</span>
                  </CardTitle>
                  <CardDescription>
                    Gestiona las mascotas que has registrado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Ver Mis Mascotas ({userPets.length})
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/messages")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    <span>Mensajes</span>
                  </CardTitle>
                  <CardDescription>
                    Revisa y responde los mensajes de adopción
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    Ver Mensajes ({stats?.totalChats || 0})
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Admin Actions */}
          {user.role === "ADMIN" && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/users")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <span>Gestionar Usuarios</span>
                  </CardTitle>
                  <CardDescription>
                    Administra todos los usuarios de la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    Ver Usuarios
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/pets")}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Gestionar Mascotas</span>
                  </CardTitle>
                  <CardDescription>
                    Administra todas las mascotas registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-red-500 hover:bg-red-600">
                    Ver Mascotas
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* User's Pets (for Owners) */}
        {user.role === "OWNER" && userPets.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tus Mascotas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPets.slice(0, 3).map((pet) => (
                <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPetIcon(pet.type)}
                        <CardTitle className="text-lg">{pet.name}</CardTitle>
                      </div>
                      <Badge variant={pet.isAvailable ? "default" : "secondary"}>
                        {pet.isAvailable ? "Disponible" : "Adoptado"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {pet.images.length > 0 && (
                      <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={pet.images[0].url}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Raza:</span> {pet.breed || "No especificada"}</p>
                      <p><span className="font-medium">Edad:</span> {pet.age} meses</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {userPets.length > 3 && (
              <div className="text-center mt-4">
                <Button variant="outline" onClick={() => router.push("/my-pets")}>
                  Ver todas mis mascotas
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}