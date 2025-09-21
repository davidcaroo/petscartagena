"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Heart,
  MessageCircle,
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  Dog,
  Cat,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  PawPrint,
  Phone,
  FileCheck,
  FileX,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalPets: number;
  totalAdoptions: number;
  totalUsers: number;
  totalChats: number;
  pendingAdoptions: number;
  recentUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'pet' | 'adoption' | 'chat' | 'system';
  action: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export default function AdminDashboard() {
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/dashboard");
      return;
    }

    if (user && token && user.role === "ADMIN") {
      loadDashboardData();

      // Auto-refresh actividades cada 30 segundos
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing activities...');
        loadDashboardData();
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [user, token, isLoading, router]);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsResponse = await fetch("/api/admin/stats", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load recent activities - ahora datos reales
      console.log('Fetching activities with token:', token ? 'Present' : 'Missing');
      const activitiesResponse = await fetch("/api/admin/activities?limit=5", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Activities response status:', activitiesResponse.status);
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        console.log('Activities data:', activitiesData);
        setRecentActivity(activitiesData);
      } else {
        const errorData = await activitiesResponse.text();
        console.error('Activities error:', errorData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8 sm:py-12">
            <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Solo los administradores pueden acceder a este panel
            </p>
            <Button onClick={() => router.push("/dashboard")} className="w-full sm:w-auto">
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
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src="/petscartagena-logo.png"
                  alt="PetsCartagena"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
                <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">PetsCartagena</span>
                <span className="text-base font-bold text-gray-900 sm:hidden">Pets</span>
              </Link>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                <span className="text-xs sm:text-sm font-medium text-purple-600 hidden sm:block">Panel de Administración</span>
                <span className="text-xs font-medium text-purple-600 sm:hidden">Admin</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs sm:text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    Administrador
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="p-2 sm:px-3 sm:py-2"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gestiona usuarios, mascotas y monitorea la actividad de la plataforma
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
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
                <CardTitle className="text-sm font-medium">Chats Activos</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalChats}</div>
                <p className="text-xs text-muted-foreground">
                  Conversaciones en curso
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/users")}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Users className="w-5 h-5 text-blue-500" />
                <span>Gestionar Usuarios</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Administra todos los usuarios de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-sm sm:text-base py-2">
                Ver Usuarios
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/pets")}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Gestionar Mascotas</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Administra todas las mascotas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-sm sm:text-base py-2">
                Ver Mascotas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/adopciones")}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Adopciones</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Revisa y gestiona las solicitudes de adopción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-sm sm:text-base py-2 flex items-center justify-center">
                Ver Solicitudes
                {stats && stats.pendingAdoptions > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {stats.pendingAdoptions}
                  </Badge>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Settings className="w-5 h-5 text-purple-500" />
                <span>Configuración</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Ajustes generales de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/config">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-sm sm:text-base py-2">
                  Configurar
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {activity.type === 'user' && <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />}
                      {activity.type === 'pet' && <PawPrint className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                      {activity.type === 'adoption' && <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />}
                      {activity.type === 'chat' && <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />}
                      {activity.type === 'system' && <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-0 sm:ml-2 flex-shrink-0">
                          {activity.timestamp}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      {activity.user && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={activity.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {activity.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500 truncate">
                            {activity.user.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Acciones Rápidas</CardTitle>
              <CardDescription>
                Tareas comunes de administración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button variant="outline" className="justify-start text-sm py-2 px-3">
                  <UserCheck className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Verificar Usuarios</span>
                </Button>
                <Button variant="outline" className="justify-start text-sm py-2 px-3">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Reportes</span>
                </Button>
                <Button variant="outline" className="justify-start text-sm py-2 px-3">
                  <Dog className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Mascotas Pendientes</span>
                </Button>
                <Button variant="outline" className="justify-start text-sm py-2 px-3">
                  <MessageCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Revisar Chats</span>
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Estadísticas Rápidas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 truncate pr-2">Usuarios activos hoy:</span>
                    <span className="font-medium flex-shrink-0">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 truncate pr-2">Nuevas mascotas:</span>
                    <span className="font-medium flex-shrink-0">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 truncate pr-2">Adopciones pendientes:</span>
                    <span className="font-medium flex-shrink-0">12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}