import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
    ArrowLeft,
    Shield,
    Users,
    Heart,
    MessageCircle,
    Lock,
    AlertTriangle,
    FileText,
    Mail,
    Globe
} from "lucide-react";

export default function TerminosYCondicionesPage() {
    const sections = [
        {
            id: "aceptacion",
            title: "1. Aceptación de los términos",
            icon: <Shield className="w-5 h-5" />,
            content: "Al acceder y utilizar PetsCartagena, el usuario reconoce haber leído, comprendido y aceptado los presentes Términos y Condiciones. En caso de no estar de acuerdo, deberá abstenerse de usar la plataforma."
        },
        {
            id: "objeto",
            title: "2. Objeto de la plataforma",
            icon: <Heart className="w-5 h-5" />,
            content: [
                "PetsCartagena es una plataforma digital que conecta a personas interesadas en adoptar mascotas con dueños responsables que desean dar en adopción a sus animales.",
                "No somos una fundación ni albergue físico.",
                "Actuamos únicamente como intermediarios tecnológicos para facilitar el contacto y gestión del proceso de adopción."
            ]
        },
        {
            id: "registro",
            title: "3. Registro de usuarios",
            icon: <Users className="w-5 h-5" />,
            content: [
                "Para acceder a ciertas funcionalidades, es necesario registrarse con información veraz y actualizada.",
                "Cada usuario es responsable de mantener la confidencialidad de sus credenciales.",
                "Los roles disponibles en la plataforma son: Adoptante (USER), Dueño (OWNER) y Administrador (ADMIN)."
            ]
        },
        {
            id: "publicacion",
            title: "4. Publicación y adopción de mascotas",
            icon: <FileText className="w-5 h-5" />,
            content: [
                "Los dueños que publiquen mascotas deberán proporcionar información completa y veraz sobre ellas (edad, tamaño, estado de salud, etc.).",
                "No se permite publicar mascotas con fines comerciales, de venta o explotación.",
                "El adoptante es responsable de verificar que cumple con las condiciones necesarias para cuidar de la mascota adoptada.",
                "PetsCartagena no garantiza la veracidad absoluta de la información suministrada por terceros."
            ]
        },
        {
            id: "responsabilidades",
            title: "5. Responsabilidades del usuario",
            icon: <AlertTriangle className="w-5 h-5" />,
            content: [
                "Hacer un uso adecuado y respetuoso de la plataforma.",
                "Abstenerse de difundir contenido falso, ofensivo o ilegal.",
                "No utilizar la plataforma con fines lucrativos distintos a la adopción responsable."
            ]
        },
        {
            id: "limitacion",
            title: "6. Limitación de responsabilidad",
            icon: <Shield className="w-5 h-5" />,
            content: [
                "PetsCartagena no se hace responsable por acuerdos, incumplimientos, daños o perjuicios derivados de la relación entre adoptantes y dueños.",
                "Tampoco se hace responsable de la salud de las mascotas entregadas en adopción, siendo deber del dueño proporcionar información veraz y del adoptante verificarla.",
                "La plataforma no sustituye la asesoría médica veterinaria."
            ]
        },
        {
            id: "chat",
            title: "7. Uso del sistema de chat",
            icon: <MessageCircle className="w-5 h-5" />,
            content: [
                "El chat debe usarse exclusivamente para coordinar adopciones y resolver dudas relacionadas.",
                "Está prohibido usarlo para spam, acoso o cualquier fin contrario a la ley.",
                "PetsCartagena podrá monitorear y moderar conversaciones para garantizar un uso seguro."
            ]
        },
        {
            id: "datos",
            title: "8. Protección de datos",
            icon: <Lock className="w-5 h-5" />,
            content: [
                "La información personal proporcionada será tratada conforme a la Política de Privacidad de la plataforma.",
                "Los datos se utilizan únicamente para el funcionamiento del sistema y no se comparten con terceros sin autorización."
            ]
        },
        {
            id: "moderacion",
            title: "9. Moderación y suspensión de cuentas",
            icon: <AlertTriangle className="w-5 h-5" />,
            content: [
                "Suspender o eliminar cuentas que incumplan estos términos.",
                "Retirar publicaciones de mascotas que contengan información falsa, fraudulenta o inadecuada.",
                "Bloquear el acceso de usuarios que hagan mal uso del sistema."
            ],
            prefix: "PetsCartagena se reserva el derecho de:"
        },
        {
            id: "propiedad",
            title: "10. Propiedad intelectual",
            icon: <Shield className="w-5 h-5" />,
            content: [
                "El contenido de la plataforma (marca, logo, diseño y software) es propiedad de PetsCartagena.",
                "Los usuarios conservan los derechos sobre las imágenes y descripciones que publiquen, autorizando su uso dentro de la plataforma."
            ]
        },
        {
            id: "modificaciones",
            title: "11. Modificaciones",
            icon: <FileText className="w-5 h-5" />,
            content: "PetsCartagena podrá modificar en cualquier momento estos Términos y Condiciones. Las actualizaciones estarán disponibles en la web y se considerarán aceptadas con el uso continuo de la plataforma."
        },
        {
            id: "contacto",
            title: "12. Contacto",
            icon: <Mail className="w-5 h-5" />,
            content: "Para dudas o reclamos, puede comunicarse a:",
            contact: true
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-red-500 py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container-responsive">
                    <div className="text-center text-white">
                        <Badge className="mb-4 bg-white/20 text-white border-white/30">
                            <FileText className="w-4 h-4 mr-2" />
                            Términos Legales
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Términos y Condiciones
                        </h1>
                        <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
                            Conoce las reglas y condiciones que rigen el uso de PetsCartagena
                        </p>
                        <div className="mt-8">
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver al Inicio
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container-responsive">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction */}
                        <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Bienvenido a PetsCartagena
                                        </h3>
                                        <p className="text-gray-700">
                                            Estos términos y condiciones establecen las reglas y regulaciones para el uso de nuestro sitio web y plataforma de adopción de mascotas.
                                            Al utilizar este sitio web, aceptas estos términos en su totalidad.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Terms Sections */}
                        <div className="space-y-6">
                            {sections.map((section, index) => (
                                <Card key={section.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center space-x-3 text-gray-900">
                                            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                                {section.icon}
                                            </div>
                                            <span>{section.title}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {section.contact ? (
                                            <div className="space-y-4">
                                                <p className="text-gray-700 mb-4">{section.content}</p>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                                        <Mail className="w-5 h-5 text-orange-500" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">Email</p>
                                                            <p className="text-gray-600">contacto@petscartagena.com</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                                        <Globe className="w-5 h-5 text-orange-500" />
                                                        <div>
                                                            <p className="font-medium text-gray-900">Sitio Web</p>
                                                            <p className="text-gray-600">https://petscartagena.com</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {section.prefix && (
                                                    <p className="text-gray-700 font-medium">{section.prefix}</p>
                                                )}
                                                {Array.isArray(section.content) ? (
                                                    <ul className="space-y-2">
                                                        {section.content.map((item, itemIndex) => (
                                                            <li key={itemIndex} className="flex items-start space-x-3">
                                                                <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                                                <p className="text-gray-700">{item}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-700">{section.content}</p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}