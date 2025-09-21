"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Heart,
    User,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Check,
    X,
    MessageCircle,
    PawPrint
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdoptionRequest {
    id: string;
    status: string;
    message?: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
        city?: string;
        bio?: string;
    };
    pet: {
        id: string;
        name: string;
        type: string;
        breed?: string;
        age: number;
        color?: string;
        gender?: string;
        size?: string;
        description?: string;
        isAvailable: boolean;
        images: { url: string }[];
    };
}

interface AdoptionStats {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    cancelled: number;
}

export default function AdoptionRequestsPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [stats, setStats] = useState<AdoptionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [ownerComment, setOwnerComment] = useState("");

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (!isLoading && user?.role !== "OWNER") {
            router.push("/dashboard");
            return;
        }

        if (user && token) {
            loadAdoptionRequests();
        }
    }, [user, token, isLoading, router, selectedStatus]);

    const loadAdoptionRequests = async () => {
        try {
            const response = await fetch(`/api/adoptions/owner-requests?status=${selectedStatus}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRequests(data.requests);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error loading adoption requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAction = async (requestId: string, action: 'ACCEPTED' | 'REJECTED') => {
        setActionLoading(requestId);
        try {
            const response = await fetch(`/api/adoptions/owner-requests`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    adoptionId: requestId,
                    status: action,
                    ownerComment: ownerComment.trim() || undefined
                })
            });

            if (response.ok) {
                await loadAdoptionRequests(); // Recargar la lista
                setOwnerComment(""); // Limpiar comentario
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Error al procesar la solicitud");
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
            case 'ACCEPTED':
                return <Badge variant="default" className="bg-green-100 text-green-800">Aceptada</Badge>;
            case 'REJECTED':
                return <Badge variant="destructive">Rechazada</Badge>;
            case 'CANCELLED':
                return <Badge variant="outline">Cancelada</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getPetTypeIcon = (type: string) => {
        return <PawPrint className="w-4 h-4" />;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getGenderText = (gender: string) => {
        return gender === 'MALE' ? 'Macho' : gender === 'FEMALE' ? 'Hembra' : gender;
    };

    const getSizeText = (size: string) => {
        switch (size) {
            case 'SMALL': return 'Pequeño';
            case 'MEDIUM': return 'Mediano';
            case 'LARGE': return 'Grande';
            case 'EXTRA_LARGE': return 'Extra Grande';
            default: return size;
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 container-responsive padding-section">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                            className="touch-target"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Dashboard
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Solicitudes de Adopción</h1>
                            <p className="text-gray-600">Gestiona las solicitudes para adoptar tus mascotas</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                                    <div className="text-sm text-blue-600">Total</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-yellow-50 border-yellow-200">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
                                    <div className="text-sm text-yellow-600">Pendientes</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-700">{stats.accepted}</div>
                                    <div className="text-sm text-green-600">Aceptadas</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
                                    <div className="text-sm text-red-600">Rechazadas</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-50 border-gray-200">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-700">{stats.cancelled}</div>
                                    <div className="text-sm text-gray-600">Canceladas</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { value: "all", label: "Todas" },
                        { value: "PENDING", label: "Pendientes" },
                        { value: "ACCEPTED", label: "Aceptadas" },
                        { value: "REJECTED", label: "Rechazadas" }
                    ].map((filter) => (
                        <Button
                            key={filter.value}
                            variant={selectedStatus === filter.value ? "default" : "outline"}
                            onClick={() => setSelectedStatus(filter.value)}
                            className="touch-target"
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>

                {/* Requests List */}
                {requests.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay solicitudes</h3>
                            <p className="text-gray-600">
                                {selectedStatus === "all"
                                    ? "Aún no has recibido solicitudes de adopción para tus mascotas."
                                    : `No hay solicitudes ${selectedStatus.toLowerCase()}.`
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <Card key={request.id} className="overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between space-x-4">
                                        <div className="flex items-start space-x-4 min-w-0 flex-1">
                                            {/* Pet Image */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                {request.pet.images[0] ? (
                                                    <img
                                                        src={request.pet.images[0].url}
                                                        alt={request.pet.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <PawPrint className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pet Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-semibold text-lg truncate">{request.pet.name}</h3>
                                                    {getPetTypeIcon(request.pet.type)}
                                                    {getStatusBadge(request.status)}
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {request.pet.breed} • {request.pet.age} meses
                                                    {request.pet.gender && ` • ${getGenderText(request.pet.gender)}`}
                                                    {request.pet.size && ` • ${getSizeText(request.pet.size)}`}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    Solicitud recibida: {formatDate(request.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Applicant Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Información del Solicitante
                                        </h4>

                                        <div className="flex items-start space-x-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={request.user.avatar} />
                                                <AvatarFallback>
                                                    {request.user.name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="space-y-2 flex-1">
                                                <div>
                                                    <p className="font-medium">{request.user.name}</p>
                                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                                        <Mail className="w-3 h-3 mr-1" />
                                                        {request.user.email}
                                                    </div>
                                                    {request.user.phone && (
                                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                                            <Phone className="w-3 h-3 mr-1" />
                                                            {request.user.phone}
                                                        </div>
                                                    )}
                                                    {request.user.city && (
                                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {request.user.city}
                                                        </div>
                                                    )}
                                                </div>

                                                {request.user.bio && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">Biografía:</p>
                                                        <p className="text-sm text-gray-600">{request.user.bio}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Request Message */}
                                    {request.message && (
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Mensaje del Solicitante
                                            </h4>
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                <p className="text-sm text-gray-700">{request.message}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons for Pending Requests */}
                                    {request.status === 'PENDING' && (
                                        <div className="border-t pt-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Comentario (opcional)
                                                    </label>
                                                    <Textarea
                                                        value={ownerComment}
                                                        onChange={(e) => setOwnerComment(e.target.value)}
                                                        placeholder="Añade un comentario para el solicitante..."
                                                        className="resize-none"
                                                        rows={2}
                                                    />
                                                </div>

                                                <div className="flex gap-3">
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                className="bg-green-600 hover:bg-green-700 flex-1 touch-target"
                                                                disabled={actionLoading === request.id}
                                                            >
                                                                <Check className="w-4 h-4 mr-2" />
                                                                Aceptar Solicitud
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Aceptar solicitud de adopción?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción aceptará la solicitud de adopción de <strong>{request.user.name}</strong> para <strong>{request.pet.name}</strong>.
                                                                    La mascota se marcará como adoptada y se rechazarán automáticamente todas las demás solicitudes pendientes para esta mascota.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleRequestAction(request.id, 'ACCEPTED')}
                                                                    className="bg-green-600 hover:bg-green-700"
                                                                >
                                                                    Sí, Aceptar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                className="flex-1 touch-target"
                                                                disabled={actionLoading === request.id}
                                                            >
                                                                <X className="w-4 h-4 mr-2" />
                                                                Rechazar
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Rechazar solicitud de adopción?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción rechazará la solicitud de adopción de <strong>{request.user.name}</strong> para <strong>{request.pet.name}</strong>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleRequestAction(request.id, 'REJECTED')}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Sí, Rechazar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}