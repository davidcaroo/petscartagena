"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";

interface ContactSettings {
    company_email?: { value: string; label: string };
    company_phone?: { value: string; label: string };
    company_address?: { value: string; label: string };
    platform_name?: { value: string; label: string };
    company_description?: { value: string; label: string };
}

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const [settings, setSettings] = useState<ContactSettings>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<ContactForm>({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch("/api/settings/public");
            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
            } else {
                throw new Error("Error al cargar configuraciones");
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar las configuraciones de contacto",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof ContactForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Aquí se podría implementar el envío del formulario a una API
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulamos envío

            toast({
                title: "Mensaje enviado",
                description: "Hemos recibido tu mensaje. Te responderemos pronto.",
            });

            // Limpiar formulario
            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
                variant: "destructive"
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="h-96 bg-gray-200 rounded"></div>
                                    <div className="h-96 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Botón de regreso */}
                        <div className="mb-6">
                            <Link href="/">
                                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver al inicio
                                </Button>
                            </Link>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contacto</h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                ¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para apoyarte en tu proceso de adopción responsable.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Información de Contacto */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageCircle className="w-5 h-5 text-blue-600" />
                                            Información de Contacto
                                        </CardTitle>
                                        <CardDescription>
                                            Puedes contactarnos a través de cualquiera de estos medios
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {settings.company_email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium">Email</p>
                                                    <a
                                                        href={`mailto:${settings.company_email.value}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {settings.company_email.value}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {settings.company_phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium">Teléfono</p>
                                                    <a
                                                        href={`tel:${settings.company_phone.value}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {settings.company_phone.value}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {settings.company_address && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium">Ubicación</p>
                                                    <p className="text-gray-600">{settings.company_address.value}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Horario de Atención</p>
                                                <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                                                <p className="text-gray-600">Sábados: 9:00 AM - 4:00 PM</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Información Adicional */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Acerca de {settings.platform_name?.value || "PetsCartagena"}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 leading-relaxed">
                                            {settings.company_description?.value ||
                                                "Somos una plataforma dedicada a conectar familias amorosas con mascotas que buscan un hogar. Nuestro compromiso es promover la adopción responsable y el bienestar animal en toda la región."}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Formulario de Contacto */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Envíanos un Mensaje</CardTitle>
                                    <CardDescription>
                                        Completa el formulario y te responderemos lo antes posible
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre completo
                                                </label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    placeholder="Tu nombre"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                                    placeholder="tu@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                                Asunto
                                            </label>
                                            <Input
                                                id="subject"
                                                type="text"
                                                value={form.subject}
                                                onChange={(e) => handleInputChange("subject", e.target.value)}
                                                placeholder="¿En qué podemos ayudarte?"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                Mensaje
                                            </label>
                                            <Textarea
                                                id="message"
                                                value={form.message}
                                                onChange={(e) => handleInputChange("message", e.target.value)}
                                                placeholder="Describe tu consulta o mensaje..."
                                                rows={5}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                "Enviando..."
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Enviar Mensaje
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* FAQ Section */}
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Preguntas Frecuentes sobre Contacto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">¿Cuánto tiempo tardan en responder?</h4>
                                        <p className="text-gray-600 text-sm">
                                            Normalmente respondemos dentro de las primeras 24 horas durante días laborales.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">¿Puedo visitar sus instalaciones?</h4>
                                        <p className="text-gray-600 text-sm">
                                            Somos una plataforma digital, pero puedes contactarnos para coordinar encuentros con los dueños de mascotas.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">¿Ofrecen soporte urgente?</h4>
                                        <p className="text-gray-600 text-sm">
                                            Para emergencias relacionadas con mascotas adoptadas, contáctanos por teléfono durante horario de oficina.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">¿Necesito cita previa?</h4>
                                        <p className="text-gray-600 text-sm">
                                            Para consultas generales no es necesario, pero recomendamos agendar citas para temas específicos.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}