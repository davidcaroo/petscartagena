"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestUsersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/auth/signin");
      return;
    }
  }, [user, authLoading, router]);

  const createTestUsers = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/test-users/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || "Error al crear usuarios de prueba");
      }
    } catch (error) {
      setMessage("Error al crear usuarios de prueba");
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Si no es admin, no mostrar nada (el useEffect redirigirá)
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Usuarios de Prueba</CardTitle>
          <CardDescription className="text-center">
            Crea usuarios de prueba para probar el sistema de autenticación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
              {message}
            </div>
          )}
          <div className="space-y-2">
            <h3 className="font-semibold">Usuarios que se crearán:</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Adoptante: adoptante@test.com / password123</li>
              <li>• Dueño: dueno@test.com / password123</li>
              <li>• Admin: admin@test.com / admin123</li>
            </ul>
          </div>
          <Button
            onClick={createTestUsers}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creando usuarios..." : "Crear Usuarios de Prueba"}
          </Button>
          <div className="text-center">
            <a href="/auth/signin" className="text-sm text-orange-600 hover:text-orange-700">
              Ir a Iniciar Sesión
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}