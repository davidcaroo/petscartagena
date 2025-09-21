import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
    ArrowLeft,
    Heart,
    Home,
    Search,
    MessageCircle,
    Users,
    CheckCircle,
    Clock,
    Stethoscope,
    Shield,
    Star,
    PawPrint
} from "lucide-react";

export default function GuiaDeAdopcionPage() {
    const steps = [
        {
            id: "preparate",
            number: "1",
            title: "Prepárate para la adopción",
            icon: <Home className="w-6 h-6" />,
            description: "Antes de adoptar, reflexiona sobre tu estilo de vida y asegúrate de que podrás brindarle a tu mascota:",
            items: [
                "Un hogar estable y seguro 🏠",
                "Tiempo y compromiso a largo plazo ⏳",
                "Cuidados veterinarios regulares 🩺",
                "Paciencia y amor incondicional ❤️"
            ],
            highlight: "Adoptar es una decisión que impactará tu vida y la de la mascota para siempre."
        },
        {
            id: "explora",
            number: "2",
            title: "Explora nuestro catálogo de mascotas",
            icon: <Search className="w-6 h-6" />,
            description: "Encuentra a tu compañero ideal:",
            items: [
                "Visita la sección Adoptar y conoce a las mascotas que buscan un hogar",
                "Usa los filtros de búsqueda (tipo, tamaño, edad, ubicación) para encontrar a tu compañero ideal",
                "Lee las descripciones y mira las fotos para conocer su personalidad e historia"
            ]
        },
        {
            id: "contacta",
            number: "3",
            title: "Contacta al dueño actual",
            icon: <MessageCircle className="w-6 h-6" />,
            description: "Cuando encuentres una mascota que te robe el corazón:",
            items: [
                "Envía una solicitud de adopción desde la plataforma",
                "Habla directamente con el dueño a través de nuestro chat seguro",
                "Resuelve todas tus dudas sobre cuidados, historial médico y comportamiento"
            ]
        },
        {
            id: "conocelo",
            number: "4",
            title: "Conócelo en persona",
            icon: <Users className="w-6 h-6" />,
            description: "El encuentro personal es fundamental:",
            items: [
                "Agenda una visita para conocer a la mascota",
                "Observa su comportamiento y evalúa si encaja con tu estilo de vida",
                "Recuerda: cada encuentro es una oportunidad para crear un vínculo"
            ]
        },
        {
            id: "formaliza",
            number: "5",
            title: "Formaliza la adopción",
            icon: <CheckCircle className="w-6 h-6" />,
            description: "Si todo va bien, completa el proceso:",
            items: [
                "Completa el proceso de adopción en la plataforma",
                "El dueño confirmará tu solicitud y la mascota será oficialmente parte de tu familia",
                "Recibirás una notificación de adopción aceptada"
            ]
        },
        {
            id: "bienvenida",
            number: "6",
            title: "Da la bienvenida a tu nuevo compañero",
            icon: <Heart className="w-6 h-6" />,
            description: "Prepara todo para su llegada:",
            items: [
                "Prepara tu hogar antes de su llegada: cama, comida, juguetes y un espacio seguro",
                "Ofrécele paciencia y cariño mientras se adapta a su nuevo entorno",
                "Agenda una visita veterinaria para garantizar que todo esté en orden"
            ]
        },
        {
            id: "compromiso",
            number: "7",
            title: "Mantén el compromiso",
            icon: <Shield className="w-6 h-6" />,
            description: "Adoptar es un compromiso para toda la vida. Tu mascota dependerá de ti para:",
            items: [
                "Recibir cuidados, alimentación y amor diario",
                "Atenciones médicas y vacunas al día",
                "Un ambiente seguro, lleno de respeto y compañía"
            ]
        }
    ];

    const tips = [
        "Sé honesto contigo mismo sobre el tiempo y recursos que tienes",
        "Considera adoptar mascotas adultas, también necesitan amor y compañía",
        "Recuerda que cada mascota tiene su propio ritmo de adaptación"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al inicio
                        </Link>

                        <div className="text-center mb-8">
                            <Badge className="mb-4 text-sm px-3 py-1 bg-orange-100 text-orange-800 border-orange-200">
                                <PawPrint className="w-4 h-4 mr-1" />
                                Guía de Adopción
                            </Badge>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                🐾 Guía de Adopción – PetsCartagena
                            </h1>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                En PetsCartagena creemos que cada adopción es un acto de amor y responsabilidad. Por eso hemos diseñado esta guía, para acompañarte en todo el proceso y asegurarnos de que tu nuevo compañero llegue a un hogar lleno de cuidados y cariño.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <Card key={step.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                                {step.number}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center text-xl text-gray-900 mb-2">
                                                <span className="mr-3 text-blue-600">{step.icon}</span>
                                                {step.title}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 text-base">
                                                {step.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <ul className="space-y-3">
                                        {step.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-start">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {step.highlight && (
                                        <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                                            <p className="text-orange-800 font-medium">{step.highlight}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Consejos adicionales */}
                    <Card className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl text-gray-900">
                                <Star className="w-6 h-6 mr-3 text-yellow-500" />
                                Consejos adicionales para una adopción exitosa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {tips.map((tip, index) => (
                                    <li key={index} className="flex items-start">
                                        <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Mensaje final */}
                    <Card className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        <CardContent className="p-8 text-center">
                            <Heart className="w-12 h-12 mx-auto mb-4 text-pink-200" />
                            <p className="text-lg font-medium">
                                ✨ En PetsCartagena, cada adopción salva dos vidas: la de la mascota que encuentra un hogar y la de la que puede ser rescatada en su lugar.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Call to action */}
                    <div className="mt-12 text-center">
                        <Link href="/adopt">
                            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
                                <Heart className="w-5 h-5 mr-2" />
                                Comenzar adopción
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}