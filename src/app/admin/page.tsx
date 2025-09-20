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
  UserX
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
  type: 'user' | 'pet' | 'adoption';
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

      // Load recent activity (mock data for now)
      setRecentActivity([
        {
          id: "1",
          type: "user",
          action: "Nuevo usuario",
          description: "María García se registró como adoptante",
          timestamp: "Hace 5 minutos",
          user: {
            name: "María García",
            avatar: ""
          }
        },
        {
          id: "2",
          type: "pet",
          action: "Nueva mascota",
          description: "Max (Labrador) registrado para adopción",
          timestamp: "Hace 15 minutos"
        },
        {
          id: "3",
          type: "adoption",
          action: "Solicitud de adopción",
          description: "Juan Pérez quiere adoptar a Luna",
          timestamp: "Hace 1 hora"
        }
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
    }
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
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
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
              <Link href="/" className="flex items-center space-x-2">
                <img 
                  src="/petscartagena-logo.png" 
                  alt="PetsCartagena" 
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-gray-900">PetsCartagena</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-purple-600">Panel de Administración</span>
              </div>
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
                  <Badge variant="secondary" className="text-xs">
                    Administrador
                  </Badge>
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
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios, mascotas y monitorea la actividad de la plataforma
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
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
                <CardTitle className="text-sm font-medium">Chats Activos</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalChats}</div>
                <p className="text-xs text-muted-foreground">
                  Conversaciones en curso
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/users")}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>Gestionar Usuarios</span>
              </CardTitle>
              <CardDescription>
                Administra todos los usuarios de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
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

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Adopciones</span>
              </CardTitle>
              <CardDescription>
                Revisa y gestiona las solicitudes de adopción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Ver Solicitudes
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-purple-500" />
                <span>Configuración</span>
              </CardTitle>
              <CardDescription>
                Ajustes generales de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-500 hover:bg-purple-600">
                Configurar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas acciones en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === 'user' && <UserCheck className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'pet' && <Heart className="w-5 h-5 text-red-500" />}
                      {activity.type === 'adoption' && <Clock className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      {activity.user && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={activity.user.avatar} />
                            <AvatarFallback className="text-xs">
                              {activity.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">
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
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Tareas comunes de administración
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Verificar Usuarios
                </Button>
                <Button variant="outline" className="justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Reportes
                </Button>
                <Button variant="outline" className="justify-start">
                  <Dog className="w-4 h-4 mr-2" />
                  Mascotas Pendientes
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Revisar Chats
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">Estadísticas Rápidas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuarios activos hoy:</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nuevas mascotas:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adopciones pendientes:</span>
                    <span className="font-medium">12</span>
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