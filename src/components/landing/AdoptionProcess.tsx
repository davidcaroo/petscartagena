"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Search, MessageCircle, Heart, Home } from "lucide-react";

export function AdoptionProcess() {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-orange-500" />,
      title: "1. Encuentra tu Compañero",
      description: "Explora nuestro catálogo de mascotas disponibles y encuentra el que robó tu corazón."
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-orange-500" />,
      title: "2. Contacta al Dueño",
      description: "Habla directamente con el dueño actual para conocer más sobre la mascota."
    },
    {
      icon: <Heart className="w-12 h-12 text-orange-500" />,
      title: "3. Conoce y Conecta",
      description: "Organiza una visita para conocer a la mascota y asegurarte de que es la compatibilidad perfecta."
    },
    {
      icon: <Home className="w-12 h-12 text-orange-500" />,
      title: "4. Llévalo a Casa",
      description: "Completa el proceso de adopción y dale la bienvenida a su nuevo hogar."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Proceso de Adopción Sencillo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hemos diseñado un proceso transparente y seguro para que tu experiencia
            de adopción sea positiva y memorable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-orange-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir PetsCartagena?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Verificación de Usuarios</h4>
                <p className="text-gray-600 text-sm">Todos nuestros usuarios pasan por un proceso de verificación.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Chat Interno Seguro</h4>
                <p className="text-gray-600 text-sm">Comunica directamente con los dueños de forma segura.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Soporte Continuo</h4>
                <p className="text-gray-600 text-sm">Te acompañamos antes, durante y después de la adopción.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}