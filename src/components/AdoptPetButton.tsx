"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AdoptPetButtonProps {
    petId: string;
    petName: string;
    petType: string;
    isAvailable: boolean;
    ownerName?: string;
    variant?: "default" | "outline" | "secondary";
    size?: "default" | "sm" | "lg";
    className?: string;
}

export default function AdoptPetButton({
    petId,
    petName,
    petType,
    isAvailable,
    ownerName,
    variant = "default",
    size = "default",
    className = ""
}: AdoptPetButtonProps) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);

    // Verificar estado inicial al cargar el componente
    useEffect(() => {
        if (user && petId) {
            checkAdoptionStatus();
        }
    }, [user, petId]);

    const checkAdoptionStatus = async () => {
        if (!user) return;

        try {
            setCheckingStatus(true);
            const response = await fetch(`/api/pets/${petId}/adopt`);

            if (response.ok) {
                const data = await response.json();
                if (data.hasActiveRequest) {
                    setHasRequested(true);
                }
            }
        } catch (error) {
            console.error('Error checking adoption status:', error);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleAdoptRequest = async () => {
        if (!message.trim()) {
            toast.error("Por favor, escribe un mensaje para el dueño");
            return;
        }

        try {
            setIsLoading(true);

            const response = await fetch(`/api/pets/${petId}/adopt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Manejar diferentes tipos de errores con mensajes específicos
                if (response.status === 400) {
                    if (data.error.includes("solicitud pendiente")) {
                        toast.warning("Ya tienes una solicitud pendiente para esta mascota. Por favor espera la respuesta del dueño.");
                        setHasRequested(true); // Marcar como ya solicitado
                        setIsOpen(false);
                        return;
                    } else if (data.error.includes("ya has adoptado")) {
                        toast.info("Ya has adoptado esta mascota anteriormente.");
                        setHasRequested(true);
                        setIsOpen(false);
                        return;
                    } else if (data.error.includes("no está disponible")) {
                        toast.error("Esta mascota ya no está disponible para adopción.");
                        setIsOpen(false);
                        return;
                    } else if (data.error.includes("tu propia mascota")) {
                        toast.error("No puedes adoptar tu propia mascota.");
                        setIsOpen(false);
                        return;
                    }
                } else if (response.status === 401) {
                    toast.error("Debes iniciar sesión para adoptar una mascota.");
                    setIsOpen(false);
                    return;
                } else if (response.status === 403) {
                    toast.error("No tienes permisos para realizar esta acción.");
                    setIsOpen(false);
                    return;
                } else if (response.status === 404) {
                    toast.error("La mascota no fue encontrada.");
                    setIsOpen(false);
                    return;
                }

                // Error genérico para otros casos
                toast.error(data.error || 'Error al enviar la solicitud');
                return;
            }

            // Éxito
            toast.success(data.message || "🎉 ¡Solicitud de adopción enviada exitosamente!");
            setHasRequested(true);
            setIsOpen(false);
            setMessage("");

        } catch (error: any) {
            console.error('Error:', error);
            toast.error("Error de conexión. Por favor intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignInRequired = () => {
        toast.error("Debes iniciar sesión para adoptar una mascota");
        // Aquí podrías redirigir al login si quieres
    };

    // Si no está disponible, no mostrar el botón
    if (!isAvailable) {
        return null;
    }

    // Si ya se envió la solicitud, mostrar estado
    if (hasRequested) {
        return (
            <Button
                variant="secondary"
                size={size}
                className={`${className} cursor-default`}
                disabled
            >
                <CheckCircle className="w-4 h-4 mr-2" />
                Solicitud Enviada
            </Button>
        );
    }

    // Si está verificando el estado inicial
    if (checkingStatus) {
        return (
            <Button
                variant={variant}
                size={size}
                className={className}
                disabled
            >
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
            </Button>
        );
    }

    // Si no está autenticado
    if (!user) {
        return (
            <Button
                variant={variant}
                size={size}
                className={className}
                onClick={handleSignInRequired}
            >
                <Heart className="w-4 h-4 mr-2" />
                Adoptar
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={variant} size={size} className={className}>
                    <Heart className="w-4 h-4 mr-2" />
                    Adoptar
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Adoptar a {petName}
                    </DialogTitle>
                    <DialogDescription>
                        Estás a punto de enviar una solicitud de adopción para{" "}
                        <span className="font-semibold">{petName}</span>
                        {ownerName && (
                            <span> a {ownerName}</span>
                        )}. Escribe un mensaje personalizado explicando por qué quieres adoptar a{" "}
                        {petType === "dog" ? "este perrito" : petType === "cat" ? "este gatito" : "esta mascota"}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="adoption-message">
                            Mensaje para el dueño <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="adoption-message"
                            placeholder={`Hola ${ownerName || ''}! Me encantaría adoptar a ${petName}. Tengo experiencia con ${petType === "dog" ? "perros" : petType === "cat" ? "gatos" : "mascotas"} y...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="resize-none"
                            maxLength={500}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {message.length}/500 caracteres
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleAdoptRequest}
                        disabled={isLoading || !message.trim()}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isLoading ? "Enviando..." : "Enviar Solicitud"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}