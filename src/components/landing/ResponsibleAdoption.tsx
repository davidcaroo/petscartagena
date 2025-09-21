"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Heart, Stethoscope } from "lucide-react";

export function ResponsibleAdoption() {
  const principles = [
    {
      icon: <Home className="w-8 h-8 text-orange-500" />,
      title: "Hogar Estable",
      description: "Asegúrate de tener un espacio adecuado y seguro para tu nueva mascota."
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      title: "Compromiso a Largo Plazo",
      description: "Las mascotas son miembros de la familia para toda la vida."
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-orange-500" />,
      title: "Cuidado Veterinario",
      description: "Mantén al día sus vacunas y visitas al veterinario."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-orange-500" />,
      title: "Paciencia y Amor",
      description: "Cada mascota necesita tiempo para adaptarse a su nuevo hogar."
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Adopción Responsable
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Adoptar es un acto de amor que requiere compromiso y responsabilidad.
            En PetsCartagena, te guiamos en cada paso del proceso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {principles.map((principle, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  {principle.icon}
                </div>
                <CardTitle className="text-xl">{principle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {principle.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-orange-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para cambiar una vida?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Cada adopción salva dos vidas: la de la mascota que encuentra un hogar
            y la de la que puede rescatarse en su lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Ver Mascotas Disponibles
            </button>
            <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-lg font-medium transition-colors">
              Conoce el Proceso
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}