"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageCircle, 
  Heart, 
  Home, 
  Shield, 
  CheckCircle, 
  Users, 
  Clock,
  FileText,
  Star,
  Award,
  ThumbsUp
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-orange-500" />,
      title: "1. Explora y Encuentra",
      description: "Navega por nuestro catálogo de mascotas disponibles. Usa nuestros filtros avanzados para encontrar la mascota perfecta según tipo, raza, edad, ubicación y más.",
      tips: [
        "Tómate tu tiempo para explorar todas las opciones",
        "Lee detenidamente la descripción de cada mascota",
        "Considera tu estilo de vida y el espacio disponible"
      ]
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-blue-500" />,
      title: "2. Contacta al Dueño",
      description: "Una vez que encuentres una mascota que te interese, usa nuestro sistema de chat interno para comunicarte directamente con el dueño actual.",
      tips: [
        "Haz preguntas sobre la personalidad y hábitos de la mascota",
        "Pregunta sobre su historial médico y vacunas",
        "Sé honesto sobre tu experiencia y situación"
      ]
    },
    {
      icon: <Heart className="w-12 h-12 text-red-500" />,
      title: "3. Conoce y Conecta",
      description: "Coordina una visita para conocer a la mascota en persona. Esta es una oportunidad importante para ver si hay química y compatibilidad.",
      tips: [
        "Lleva a todos los miembros de la familia",
        "Observa el comportamiento de la mascota",
        "Pasa tiempo interactuando con ella"
      ]
    },
    {
      icon: <FileText className="w-12 h-12 text-green-500" />,
      title: "4. Completa el Proceso",
      description: "Si ambos están de acuerdo, completa el proceso de adopción. Esto incluye firmar un acuerdo de adopción y preparar tu hogar para la nueva llegada.",
      tips: [
        "Revisa y firma el contrato de adopción",
        "Prepara tu hogar con los elementos necesarios",
        "Programa la primera visita veterinaria"
      ]
    },
    {
      icon: <Home className="w-12 h-12 text-purple-500" />,
      title: "5. Bienvenida a Casa",
      description: "Lleva a tu nuevo compañero a su hogar para siempre. Recuerda que los primeros días son de adaptación para ambos.",
      tips: [
        "Sé paciente durante el período de adaptación",
        "Establece rutinas claras desde el principio",
        "Disfruta de esta nueva etapa juntos"
      ]
    }
  ];

  const requirements = [
    {
      title: "Responsabilidad Comprometida",
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      description: "Las mascotas son miembros de la familia para toda la vida. Debes estar comprometido a cuidarlas por muchos años.",
      items: [
        "Compromiso a largo plazo (10-20 años para algunas mascotas)",
        "Responsabilidad financiera (alimento, veterinaria, cuidados)",
        "Tiempo diario para atención y ejercicio"
      ]
    },
    {
      title: "Hogar Adecuado",
      icon: <Home className="w-8 h-8 text-green-500" />,
      description: "Necesitas proporcionar un ambiente seguro y confortable para tu nueva mascota.",
      items: [
        "Espacio suficiente según el tamaño y tipo de mascota",
        "Ambiente seguro sin peligros potenciales",
        "Permiso de todos los miembros de la familia"
      ]
    },
    {
      title: "Cuidados Veterinarios",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      description: "La salud de tu mascota es primordial. Debes estar preparado para proporcionar atención médica regular.",
      items: [
        "Vacunas al día y desparasitación regular",
        "Visitas veterinarias preventivas anuales",
        "Atención médica de emergencia cuando sea necesario"
      ]
    }
  ];

  const benefits = [
    {
      title: "Salud y Bienestar",
      icon: <Heart className="w-10 h-10 text-red-500" />,
      description: "Las mascotas mejoran la salud física y mental de sus dueños, reduciendo el estrés y aumentando la felicidad."
    },
    {
      title: "Compañía Incondicional",
      icon: <Users className="w-10 h-10 text-blue-500" />,
      description: "Recibirás amor y lealtad incondicionales. Las mascotas son excelentes compañeros que siempre estarán ahí para ti."
    },
    {
      title: "Responsabilidad",
      icon: <Award className="w-10 h-10 text-purple-500" />,
      description: "Cuidar de una mascota enseña responsabilidad, especialmente a los niños, y desarrolla rutinas saludables."
    },
    {
      title: "Salvar Vidas",
      icon: <Star className="w-10 h-10 text-yellow-500" />,
      description: "Al adoptar, no solo salvamos la vida de esa mascota, sino que también liberamos espacio para que otra pueda ser rescatada."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Cómo Funciona la Adopción en PetsCartagena
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hemos diseñado un proceso simple, seguro y transparente para que 
              tu experiencia de adopción sea positiva y memorable.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Process Steps */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nuestro Proceso de Adopción en 5 Pasos
            </h2>
            <p className="text-lg text-gray-600">
              Un camino claro hacia encontrar tu compañero perfecto
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">
                      {step.description}
                    </p>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-orange-500" />
                        Consejos importantes:
                      </h4>
                      <ul className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start text-sm text-gray-700">
                            <span className="text-orange-500 mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-7">
                    <div className="bg-white rounded-xl shadow-lg p-8 h-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-2">
                              {step.icon}
                            </div>
                            <p className="text-sm text-gray-600">Paso {index + 1}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {index === 0 ? "Tiempo: Variable" : 
                               index === 1 ? "Tiempo: 1-3 días" :
                               index === 2 ? "Tiempo: 3-7 días" :
                               index === 3 ? "Tiempo: 1-2 días" : "¡Para siempre!"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {index === 0 ? "Participantes: Tú" :
                               index === 1 ? "Participantes: Tú y el dueño" :
                               index === 2 ? "Participantes: Tú, dueño y mascota" :
                               index === 3 ? "Participantes: Tú y el dueño" : "Participantes: Tú y tu mascota"}
                            </span>
                          </div>
                          <Badge variant={index < 4 ? "secondary" : "default"} className="w-fit">
                            {index < 4 ? "Proceso en curso" : "¡Completado!"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-orange-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Requisitos para Adoptar
            </h2>
            <p className="text-lg text-gray-600">
              Para garantizar el mejor hogar para nuestras mascotas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {requirements.map((req, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    {req.icon}
                    <CardTitle className="text-xl">{req.title}</CardTitle>
                  </div>
                  <CardDescription>{req.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {req.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Beneficios de Adoptar
            </h2>
            <p className="text-lg text-gray-600">
              La adopción transforma vidas, tanto la tuya como la de la mascota
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para cambiar una vida?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Miles de mascotas esperan por un hogar amoroso. 
            Tu próximo mejor amigo está a solo unos clics de distancia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/adopt">
              <Button size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
                <Heart className="w-5 h-5 mr-2" />
                Ver Mascotas Disponibles
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-500">
                <Users className="w-5 h-5 mr-2" />
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}