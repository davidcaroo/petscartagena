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
  unreadMessages: number;
  favoriteCount: number;
  myAdoptionRequests?: number;
  pendingAdoptionRequests?: number;
  ownerTotalRequests?: number;
  ownerPendingRequests?: number;
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

            // For now, count unread messages as messages where the last message was not sent by current user
            let unreadCount = 0;
            if (chatsData && chatsData.length > 0) {
              for (const chat of chatsData) {
                if (chat.lastMessage && chat.lastMessage.senderId !== user.id) {
                  unreadCount++;
                }
              }
            }

            // Load favorites count for USER role
            let favCount = 0;
            let adoptionRequestsCount = 0;
            let pendingRequestsCount = 0;
            let ownerPendingRequests = 0;
            let ownerTotalRequests = 0;

            if (user?.role === "USER") {
              try {
                const favoritesResponse = await fetch("/api/favorites", {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if (favoritesResponse.ok) {
                  const favoritesData = await favoritesResponse.json();
                  favCount = favoritesData.length;
                }
              } catch (error) {
                console.error("Error loading favorites count:", error);
              }

              // Load adoption requests count
              try {
                const adoptionsResponse = await fetch("/api/adoptions/my-requests", {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if (adoptionsResponse.ok) {
                  const adoptionsData = await adoptionsResponse.json();
                  adoptionRequestsCount = adoptionsData.length;
                  pendingRequestsCount = adoptionsData.filter((req: any) => req.status === 'PENDING').length;
                }
              } catch (error) {
                console.error("Error loading adoption requests count:", error);
              }
            }

            // Load adoption requests for OWNER role
            if (user?.role === "OWNER") {
              try {
                const ownerAdoptionsResponse = await fetch("/api/adoptions/owner-requests", {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if (ownerAdoptionsResponse.ok) {
                  const ownerAdoptionsData = await ownerAdoptionsResponse.json();
                  ownerTotalRequests = ownerAdoptionsData.stats?.total || 0;
                  ownerPendingRequests = ownerAdoptionsData.stats?.pending || 0;
                }
              } catch (error) {
                console.error("Error loading owner adoption requests count:", error);
              }
            }

            setStats(prev => ({
              ...prev,
              totalChats: chatsData.length,
              unreadMessages: unreadCount,
              favoriteCount: favCount,
              myAdoptionRequests: adoptionRequestsCount,
              pendingAdoptionRequests: pendingRequestsCount,
              ownerTotalRequests: ownerTotalRequests,
              ownerPendingRequests: ownerPendingRequests,
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
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/petscartagena-logo.png"
                  alt="PetsCartagena"
                  className="w-8 h-8 flex-shrink-0"
                />
                <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">PetsCartagena</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="font-medium text-gray-900 text-sm">{user.name}</p>
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
                className="px-2 sm:px-4"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user.name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestiona tu cuenta y encuentra el compañero perfecto
          </p>
        </div>

        {/* Admin Dashboard */}
        {user.role === "ADMIN" && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Mascotas</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalPets}</div>
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
                <div className="text-xl sm:text-2xl font-bold">{stats.totalAdoptions}</div>
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
                <div className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</div>
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
                <div className="text-xl sm:text-2xl font-bold">{stats.totalChats}</div>
                <p className="text-xs text-muted-foreground">
                  Conversaciones activas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced User Dashboard for Adopters */}
        {user.role === "USER" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Cards Row */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-purple-500 rounded-lg flex-shrink-0">
                        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl sm:text-2xl font-bold text-purple-700">{stats?.totalChats || 0}</p>
                        <p className="text-xs sm:text-sm text-purple-600 truncate">Conversaciones</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-orange-50 border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/my-favorites")}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-orange-500 rounded-lg flex-shrink-0">
                        <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl sm:text-2xl font-bold text-orange-700">{stats?.favoriteCount || 0}</p>
                        <p className="text-xs sm:text-sm text-orange-600 truncate">Mascotas Favoritas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="bg-red-50 border-red-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push("/my-adoptions")}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-red-500 rounded-lg flex-shrink-0">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl sm:text-2xl font-bold text-red-700">{stats?.myAdoptionRequests || 0}</p>
                        <p className="text-xs sm:text-sm text-red-600 truncate">Mis Solicitudes</p>
                        {(stats?.pendingAdoptionRequests || 0) > 0 && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            {stats?.pendingAdoptionRequests} pendientes
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-blue-500 rounded-lg flex-shrink-0">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats?.unreadMessages || 0}</p>
                        <p className="text-xs sm:text-sm text-blue-600 truncate">Mensajes Pendientes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Adoptar una Mascota Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-orange-300"
                onClick={() => router.push("/adopt")}>
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Adoptar una Mascota</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Explora las mascotas disponibles y encuentra tu compañero perfecto
                      </p>
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium min-h-[44px]">
                      Ver Mascotas Disponibles
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mis Solicitudes Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-red-300"
                onClick={() => router.push("/my-adoptions")}>
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Mis Solicitudes</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Revisa el estado de todas tus solicitudes de adopción
                      </p>
                    </div>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium flex items-center justify-center min-h-[44px]">
                      Ver Mis Solicitudes
                      {(stats?.myAdoptionRequests || 0) > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-white text-red-500">
                          {stats?.myAdoptionRequests}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Mensajes Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-300"
                onClick={() => router.push("/messages")}>
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                      <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Mensajes</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Revisa las respuestas de los dueños de mascotas
                      </p>
                    </div>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-medium min-h-[44px]">
                      Ver Mensajes ({stats?.totalChats || 0})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración Card */}
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-gray-300"
                onClick={() => router.push("/profile-settings")}>
                <CardContent className="p-6 sm:p-8">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-500 rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                      <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Configuración</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Edita tu perfil, foto y datos personales
                      </p>
                    </div>
                    <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium min-h-[44px]">
                      Editar Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* User Dashboard - Simple stats for Adopters */}
        {user.role === "USER" && false && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mis Conversaciones</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats?.totalChats || 0}</div>
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
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 min-h-[40px]">
                  Ver mascotas
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Cards - Only for OWNER and ADMIN */}
        {user.role !== "USER" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Common Actions */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/adopt")}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Heart className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <span>Adoptar una Mascota</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Explora las mascotas disponibles y encuentra tu compañero perfecto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 min-h-[44px]">
                  Ver Mascotas Disponibles
                </Button>
              </CardContent>
            </Card>

            {/* Owner Actions */}
            {user.role === "OWNER" && (
              <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/give-adoption")}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Plus className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>Registrar Mascota</span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Añade una nueva mascota para dar en adopción
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-green-500 hover:bg-green-600 min-h-[44px]">
                      Nueva Mascota
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/my-pets")}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Home className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span>Mis Mascotas</span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Gestiona las mascotas que has registrado
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 min-h-[44px]">
                      Ver Mis Mascotas ({userPets.length})
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/messages")}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <MessageCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                      <span>Mensajes</span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Revisa y responde los mensajes de adopción
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 min-h-[44px]">
                      Ver Mensajes ({stats?.totalChats || 0})
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/adoption-requests")}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Heart className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span>Solicitudes de Adopción</span>
                      {stats?.ownerPendingRequests && stats.ownerPendingRequests > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {stats.ownerPendingRequests} pendientes
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Gestiona las solicitudes para adoptar tus mascotas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 min-h-[44px]">
                      Ver Solicitudes ({stats?.ownerTotalRequests || 0})
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/profile-settings")}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      <Settings className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span>Configuración</span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Edita tu perfil, foto y datos personales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gray-500 hover:bg-gray-600 min-h-[44px]">
                      Editar Perfil
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
        )}

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