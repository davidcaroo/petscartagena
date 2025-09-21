"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Heart,
    Clock,
    CheckCircle,
    XCircle,
    Ban,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Search,
    Filter,
    Eye,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface AdoptionUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    city?: string;
}

interface AdoptionPet {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: number;
    isAvailable: boolean;
    images: { url: string }[];
    owner: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
}

interface AdoptionRequest {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
    message?: string;
    createdAt: string;
    user: AdoptionUser;
    pet: AdoptionPet;
}

interface AdoptionStats {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    cancelled: number;
}

interface AdoptionsResponse {
    adoptions: AdoptionRequest[];
    stats: AdoptionStats;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function AdoptionsPage() {
    const router = useRouter();
    const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
    const [stats, setStats] = useState<AdoptionStats>({
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        cancelled: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("resumen");
    const [selectedAdoption, setSelectedAdoption] = useState<AdoptionRequest | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null);
    const [adminComment, setAdminComment] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

    useEffect(() => {
        loadAdoptions();
    }, [selectedTab, statusFilter, currentPage]);

    const loadAdoptions = async () => {
        try {
            setLoading(true);

            const status = selectedTab === "resumen" ? statusFilter :
                selectedTab === "pendientes" ? "PENDING" :
                    selectedTab === "aprobadas" ? "ACCEPTED" :
                        selectedTab === "rechazadas" ? "REJECTED" :
                            selectedTab === "canceladas" ? "CANCELLED" : "all";

            const params = new URLSearchParams({
                status,
                page: currentPage.toString(),
                limit: "10"
            });

            const response = await fetch(`/api/admin/adoptions?${params}`);

            if (!response.ok) {
                throw new Error('Error al cargar adopciones');
            }

            const data: AdoptionsResponse = await response.json();
            setAdoptions(data.adoptions);
            setStats(data.stats);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error loading adoptions:', error);
            toast.error('Error al cargar las adopciones');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async () => {
        if (!selectedAdoption || !actionType) return;

        try {
            const newStatus = actionType === 'accept' ? 'ACCEPTED' : 'REJECTED';

            const response = await fetch('/api/admin/adoptions', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adoptionId: selectedAdoption.id,
                    status: newStatus,
                    adminComment
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar adopción');
            }

            toast.success(
                actionType === 'accept'
                    ? '✅ Adopción aprobada exitosamente'
                    : '❌ Adopción rechazada'
            );

            setActionDialogOpen(false);
            setSelectedAdoption(null);
            setActionType(null);
            setAdminComment("");
            loadAdoptions();
        } catch (error) {
            console.error('Error updating adoption:', error);
            toast.error('Error al actualizar la adopción');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { label: "Pendiente", variant: "default" as const, icon: Clock },
            ACCEPTED: { label: "Aprobada", variant: "default" as const, icon: CheckCircle, className: "bg-green-100 text-green-800" },
            REJECTED: { label: "Rechazada", variant: "destructive" as const, icon: XCircle },
            CANCELLED: { label: "Cancelada", variant: "secondary" as const, icon: Ban }
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        if (!config) return null;

        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className={config.className}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredAdoptions = adoptions.filter(adoption => {
        const searchLower = searchTerm.toLowerCase();
        return (
            adoption.pet.name.toLowerCase().includes(searchLower) ||
            adoption.user.name?.toLowerCase().includes(searchLower) ||
            adoption.user.email.toLowerCase().includes(searchLower) ||
            adoption.pet.breed.toLowerCase().includes(searchLower)
        );
    });

    const StatsCard = ({ title, value, icon: Icon, className = "" }: {
        title: string;
        value: number;
        icon: any;
        className?: string;
    }) => (
        <Card className={className}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
            </CardContent>
        </Card>
    );

    const AdoptionCard = ({ adoption }: { adoption: AdoptionRequest }) => (
        <Card className="mb-4">
            <CardContent className="p-6">
                <div className="flex gap-4">
                    {/* Imagen de la mascota */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={adoption.pet.images[0]?.url || '/placeholder-pet.jpg'}
                            alt={adoption.pet.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Información principal */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-semibold text-lg">{adoption.pet.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {adoption.pet.breed} • {adoption.pet.age} años
                                </p>
                            </div>
                            {getStatusBadge(adoption.status)}
                        </div>

                        {/* Información del adoptante */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Adoptante:</h4>
                                <div className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={adoption.user.avatar} />
                                        <AvatarFallback>
                                            {adoption.user.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{adoption.user.name}</p>
                                        <p className="text-sm text-muted-foreground">{adoption.user.email}</p>
                                    </div>
                                </div>
                                {adoption.user.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4" />
                                        {adoption.user.phone}
                                    </div>
                                )}
                                {adoption.user.city && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        {adoption.user.city}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-sm">Propietario:</h4>
                                <div>
                                    <p className="font-medium">{adoption.pet.owner.name}</p>
                                    <p className="text-sm text-muted-foreground">{adoption.pet.owner.email}</p>
                                    {adoption.pet.owner.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4" />
                                            {adoption.pet.owner.phone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mensaje del adoptante */}
                        {adoption.message && (
                            <div className="mb-4">
                                <h4 className="font-medium text-sm mb-1">Mensaje del adoptante:</h4>
                                <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                                    {adoption.message}
                                </p>
                            </div>
                        )}

                        {/* Fecha y acciones */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {formatDate(adoption.createdAt)}
                            </div>

                            {adoption.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedAdoption(adoption);
                                            setActionType('reject');
                                            setActionDialogOpen(true);
                                        }}
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Rechazar
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedAdoption(adoption);
                                            setActionType('accept');
                                            setActionDialogOpen(true);
                                        }}
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Aprobar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const Pagination = () => (
        <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} resultados
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={pagination.page <= 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                </Button>

                <span className="text-sm">
                    Página {pagination.page} de {pagination.pages}
                </span>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                    disabled={pagination.page >= pagination.pages}
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestión de Adopciones</h1>
                                <p className="text-sm text-gray-600">Administra las solicitudes de adopción de mascotas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-7xl px-4 py-8">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <StatsCard
                        title="Total"
                        value={stats.total}
                        icon={Heart}
                    />
                    <StatsCard
                        title="Pendientes"
                        value={stats.pending}
                        icon={Clock}
                        className="border-orange-200"
                    />
                    <StatsCard
                        title="Aprobadas"
                        value={stats.accepted}
                        icon={CheckCircle}
                        className="border-green-200"
                    />
                    <StatsCard
                        title="Rechazadas"
                        value={stats.rejected}
                        icon={XCircle}
                        className="border-red-200"
                    />
                    <StatsCard
                        title="Canceladas"
                        value={stats.cancelled}
                        icon={Ban}
                        className="border-gray-200"
                    />
                </div>            {/* Filtros y búsqueda */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Label htmlFor="search">Buscar</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        id="search"
                                        placeholder="Buscar por mascota, adoptante, email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {selectedTab === "resumen" && (
                                <div className="w-full md:w-48">
                                    <Label htmlFor="status-filter">Estado</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filtrar por estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="PENDING">Pendientes</SelectItem>
                                            <SelectItem value="ACCEPTED">Aprobadas</SelectItem>
                                            <SelectItem value="REJECTED">Rechazadas</SelectItem>
                                            <SelectItem value="CANCELLED">Canceladas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs de navegación */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="resumen">Resumen</TabsTrigger>
                        <TabsTrigger value="pendientes">
                            Pendientes {stats.pending > 0 && `(${stats.pending})`}
                        </TabsTrigger>
                        <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
                        <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
                        <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="resumen" className="mt-6">
                        <div className="space-y-4">
                            {filteredAdoptions.map((adoption) => (
                                <AdoptionCard key={adoption.id} adoption={adoption} />
                            ))}
                            {filteredAdoptions.length === 0 && (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No hay adopciones</h3>
                                        <p className="text-muted-foreground">
                                            {searchTerm
                                                ? "No se encontraron adopciones que coincidan con tu búsqueda"
                                                : "No hay solicitudes de adopción registradas"}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            <Pagination />
                        </div>
                    </TabsContent>

                    <TabsContent value="pendientes" className="mt-6">
                        <div className="space-y-4">
                            {filteredAdoptions.map((adoption) => (
                                <AdoptionCard key={adoption.id} adoption={adoption} />
                            ))}
                            {filteredAdoptions.length === 0 && (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No hay adopciones pendientes</h3>
                                        <p className="text-muted-foreground">
                                            Todas las solicitudes han sido procesadas
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            <Pagination />
                        </div>
                    </TabsContent>

                    <TabsContent value="aprobadas" className="mt-6">
                        <div className="space-y-4">
                            {filteredAdoptions.map((adoption) => (
                                <AdoptionCard key={adoption.id} adoption={adoption} />
                            ))}
                            {filteredAdoptions.length === 0 && (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No hay adopciones aprobadas</h3>
                                        <p className="text-muted-foreground">
                                            Las adopciones aprobadas aparecerán aquí
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            <Pagination />
                        </div>
                    </TabsContent>

                    <TabsContent value="rechazadas" className="mt-6">
                        <div className="space-y-4">
                            {filteredAdoptions.map((adoption) => (
                                <AdoptionCard key={adoption.id} adoption={adoption} />
                            ))}
                            {filteredAdoptions.length === 0 && (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <XCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No hay adopciones rechazadas</h3>
                                        <p className="text-muted-foreground">
                                            Las adopciones rechazadas aparecerán aquí
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            <Pagination />
                        </div>
                    </TabsContent>

                    <TabsContent value="canceladas" className="mt-6">
                        <div className="space-y-4">
                            {filteredAdoptions.map((adoption) => (
                                <AdoptionCard key={adoption.id} adoption={adoption} />
                            ))}
                            {filteredAdoptions.length === 0 && (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <Ban className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No hay adopciones canceladas</h3>
                                        <p className="text-muted-foreground">
                                            Las adopciones canceladas aparecerán aquí
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            <Pagination />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Dialog de confirmación de acción */}
                <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {actionType === 'accept' ? '✅ Aprobar Adopción' : '❌ Rechazar Adopción'}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {actionType === 'accept'
                                    ? `¿Estás seguro de que deseas aprobar la adopción de ${selectedAdoption?.pet.name} para ${selectedAdoption?.user.name}? Esta acción marcará la mascota como no disponible.`
                                    : `¿Estás seguro de que deseas rechazar la adopción de ${selectedAdoption?.pet.name} para ${selectedAdoption?.user.name}?`
                                }
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="my-4">
                            <Label htmlFor="admin-comment">
                                Comentario adicional {actionType === 'reject' ? '(requerido)' : '(opcional)'}
                            </Label>
                            <Textarea
                                id="admin-comment"
                                placeholder={`${actionType === 'accept' ? 'Felicitaciones por la adopción...' : 'Razón del rechazo...'}`}
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleStatusChange}
                                disabled={actionType === 'reject' && !adminComment.trim()}
                                className={actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                            >
                                {actionType === 'accept' ? 'Aprobar' : 'Rechazar'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}