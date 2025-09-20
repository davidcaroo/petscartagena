"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    // Redirigir a la página de inicio de sesión después de 3 segundos
    const timer = setTimeout(() => {
      router.push("/auth/signin");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Credenciales inválidas. Por favor, verifica tu email y contraseña.";
      case "SessionRequired":
        return "Se requiere iniciar sesión para acceder a esta página.";
      case "Default":
        return "Ocurrió un error durante la autenticación.";
      default:
        return "Ocurrió un error desconocido. Por favor, intenta nuevamente.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
          <CardDescription>
            {getErrorMessage(error)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Serás redirigido a la página de inicio de sesión en unos segundos...
            </p>
            <Button 
              onClick={() => router.push("/auth/signin")}
              className="w-full"
            >
              Volver al Inicio de Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}