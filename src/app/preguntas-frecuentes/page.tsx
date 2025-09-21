"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
    ArrowLeft,
    HelpCircle,
    CreditCard,
    Heart,
    Users,
    Shield,
    Stethoscope,
    MapPin,
    RefreshCw,
    Mail,
    Search,
    MessageCircle,
    Home,
    Clock,
    CheckCircle
} from "lucide-react";

export default function PreguntasFrecuentesPage() {
    const faqs = [
        {
            id: "cobra-adopcion",
            question: "¿PetsCartagena cobra por la adopción?",
            answer: "No. Nuestra plataforma es completamente gratuita. El único compromiso que asumes es brindar un hogar amoroso, seguro y responsable a la mascota que adoptes.",
            icon: <CreditCard className="w-5 h-5 text-green-500" />,
            category: "Costos"
        },
        {
            id: "como-adoptar",
            question: "¿Cómo puedo adoptar una mascota?",
            answer: "El proceso es muy sencillo:",
            steps: [
                "Explora el catálogo de mascotas disponibles",
                "Envía tu solicitud de adopción",
                "Habla con el dueño actual a través del chat seguro",
                "Organiza una visita para conocer a la mascota",
                "Formaliza la adopción desde la plataforma"
            ],
            icon: <Heart className="w-5 h-5 text-red-500" />,
            category: "Proceso"
        },
        {
            id: "dar-adopcion",
            question: "¿Puedo dar en adopción a mi mascota?",
            answer: "Sí. Si ya no puedes cuidar de tu mascota, puedes registrarla en PetsCartagena como OWNER (dueño). Solo deberás crear un perfil de la mascota con fotos e información veraz, y gestionar las solicitudes de adoptantes interesados.",
            icon: <Users className="w-5 h-5 text-blue-500" />,
            category: "Dueños"
        },
        {
            id: "responsabilidades",
            question: "¿Qué responsabilidades asumo al adoptar?",
            answer: "Adoptar implica comprometerte a:",
            steps: [
                "Ofrecer un hogar seguro y estable",
                "Cubrir gastos de alimentación y cuidados veterinarios",
                "Dar tiempo, paciencia y amor incondicional"
            ],
            note: "Recuerda: adoptar es una decisión de por vida.",
            icon: <Shield className="w-5 h-5 text-orange-500" />,
            category: "Responsabilidades"
        },
        {
            id: "control-veterinario",
            question: "¿Las mascotas tienen control veterinario?",
            answer: "La información médica depende del dueño que publica la mascota. Es importante que durante la comunicación preguntes por su historial de vacunas, desparasitaciones y chequeos recientes, y lleves a tu nuevo compañero al veterinario apenas llegue a tu hogar.",
            icon: <Stethoscope className="w-5 h-5 text-purple-500" />,
            category: "Salud"
        },
        {
            id: "seguridad",
            question: "¿Cómo se asegura la seguridad en la plataforma?",
            answer: "Contamos con múltiples medidas de seguridad:",
            steps: [
                "Sistema de verificación de usuarios",
                "Todo el contacto se realiza a través de un chat interno seguro",
                "Los administradores pueden moderar publicaciones y usuarios que incumplan las normas"
            ],
            icon: <Shield className="w-5 h-5 text-green-600" />,
            category: "Seguridad"
        },
        {
            id: "ubicacion",
            question: "¿Puedo adoptar si no vivo en Cartagena?",
            answer: "Sí. Aunque la mayoría de publicaciones están en Cartagena, hay familias y mascotas registradas en diferentes ciudades de Colombia. Puedes filtrar por ubicación en el catálogo.",
            icon: <MapPin className="w-5 h-5 text-indigo-500" />,
            category: "Ubicación"
        },
        {
            id: "adopcion-no-funciona",
            question: "¿Qué pasa si la adopción no funciona?",
            answer: "Si después de intentarlo la convivencia no es positiva, te recomendamos contactar al dueño original o escribirnos a contacto@petscartagena.com para recibir orientación y garantizar el bienestar de la mascota.",
            icon: <RefreshCw className="w-5 h-5 text-yellow-500" />,
            category: "Soporte"
        }
    ];

    const categories = Array.from(new Set(faqs.map(faq => faq.category)));

    const quickActions = [
        {
            title: "Adoptar una Mascota",
            description: "Encuentra tu compañero perfecto",
            href: "/adopt",
            icon: <Heart className="w-6 h-6" />,
            color: "bg-red-50 hover:bg-red-100 border-red-200"
        },
        {
            title: "Dar en Adopción",
            description: "Encuentra un hogar para tu mascota",
            href: "/give-adoption",
            icon: <Users className="w-6 h-6" />,
            color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
        },
        {
            title: "Cómo Funciona",
            description: "Conoce nuestro proceso paso a paso",
            href: "/how-it-works",
            icon: <HelpCircle className="w-6 h-6" />,
            color: "bg-green-50 hover:bg-green-100 border-green-200"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
                <div className="container-responsive">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al inicio
                        </Link>

                        <div className="flex items-center justify-center mb-4">
                            <HelpCircle className="w-12 h-12 text-orange-500 mr-4" />
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                                Preguntas Frecuentes
                            </h1>
                        </div>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Resolvemos las dudas más comunes sobre adopción responsable y el uso de nuestra plataforma.
                        </p>

                        <Badge variant="secondary" className="mt-4 text-sm font-medium">
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Todo lo que necesitas saber
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-12 bg-white">
                <div className="container-responsive">
                    <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                        Acciones Rápidas
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href}>
                                <Card className={`h-full transition-all duration-300 cursor-pointer ${action.color}`}>
                                    <CardHeader className="text-center">
                                        <div className="mx-auto mb-4 p-3 rounded-full bg-white shadow-sm">
                                            {action.icon}
                                        </div>
                                        <CardTitle className="text-lg">{action.title}</CardTitle>
                                        <CardDescription>{action.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gray-50">
                <div className="container-responsive">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Todas tus Dudas Resueltas
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Encuentra respuestas a las preguntas más frecuentes sobre adopción de mascotas
                            </p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={faq.id}
                                    value={faq.id}
                                    className="bg-white rounded-lg border shadow-sm"
                                >
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                        <div className="flex items-center text-left">
                                            <div className="mr-4 p-2 rounded-full bg-gray-50">
                                                {faq.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {faq.question}
                                                </h3>
                                                <Badge variant="outline" className="mt-1 text-xs">
                                                    {faq.category}
                                                </Badge>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-6">
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                {faq.answer}
                                            </p>

                                            {faq.steps && (
                                                <ol className="space-y-2 mb-4">
                                                    {faq.steps.map((step, stepIndex) => (
                                                        <li key={stepIndex} className="flex items-start">
                                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-700">{step}</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            )}

                                            {faq.note && (
                                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                                                    <p className="text-orange-800 font-medium text-sm">
                                                        💡 {faq.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container-responsive">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
                            <Mail className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-4">
                                ¿No encontraste tu respuesta?
                            </h3>
                            <p className="text-orange-100 mb-6 leading-relaxed">
                                Nuestro equipo está aquí para ayudarte. Escríbenos y resolveremos cualquier duda adicional que tengas.
                            </p>
                            <Button
                                asChild
                                variant="secondary"
                                size="lg"
                                className="bg-white text-orange-600 hover:bg-orange-50"
                            >
                                <a href="mailto:contacto@petscartagena.com">
                                    <Mail className="w-5 h-5 mr-2" />
                                    Contáctanos
                                </a>
                            </Button>
                            <p className="text-orange-200 text-sm mt-4">
                                contacto@petscartagena.com
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}