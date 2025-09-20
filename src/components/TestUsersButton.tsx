"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, CheckCircle, AlertCircle } from "lucide-react";

export function TestUsersButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const createTestUsers = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/test/users", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "¡Usuarios de prueba creados exitosamente!"
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Error al crear usuarios de prueba"
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error de conexión al crear usuarios de prueba"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuarios de Prueba
          </CardTitle>
          <CardDescription>
            Crea usuarios de prueba para probar la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={createTestUsers} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Creando usuarios..." : "Crear Usuarios de Prueba"}
          </Button>

          {message && (
            <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Usuarios que se crearán:</strong></p>
            <div className="bg-gray-50 p-3 rounded space-y-1">
              <p><strong>Adoptante:</strong> adoptante@test.com / password123</p>
              <p><strong>Dueño:</strong> dueno@test.com / password123</p>
              <p><strong>Administrador:</strong> admin@test.com / admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}