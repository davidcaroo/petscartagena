"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Settings,
    Building2,
    Mail,
    Heart,
    Users,
    Shield,
    MessageCircle,
    BarChart3,
    Palette,
    Save,
    RotateCcw,
    Loader2,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

interface Setting {
    id: string;
    key: string;
    value: string;
    type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'EMAIL' | 'URL' | 'COLOR' | 'JSON' | 'FILE' | 'TEXTAREA' | 'SELECT';
    category: string;
    label: string;
    description?: string;
    isPublic: boolean;
    order: number;
}

interface GroupedSettings {
    [category: string]: Setting[];
}

const categoryIcons = {
    company: Building2,
    email: Mail,
    pets: Heart,
    users: Users,
    security: Shield,
    chat: MessageCircle,
    adoption: BarChart3,
    ui: Palette
};

const categoryLabels = {
    company: "🏢 Información de la Empresa",
    email: "📧 Configuración de Emails",
    pets: "🐕 Configuración de Mascotas",
    users: "👥 Configuración de Usuarios",
    security: "🔒 Configuración de Seguridad",
    chat: "💬 Configuración de Chat",
    adoption: "📊 Configuración de Adopciones",
    ui: "🎨 Configuración de UI/UX"
};

export default function AdminConfigPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<GroupedSettings>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("company");
    const [changes, setChanges] = useState<{ [key: string]: string }>({});
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (!isLoading && (!user || user.role !== "ADMIN")) {
            router.push("/dashboard");
            return;
        }

        if (user && token && user.role === "ADMIN") {
            loadSettings();
        }
    }, [user, token, isLoading, router]);

    const loadSettings = async () => {
        try {
            const response = await fetch("/api/admin/settings", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
                setCategories(data.categories);
                if (data.categories.length > 0) {
                    setActiveTab(data.categories[0]);
                }
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key: string, value: string) => {
        setChanges(prev => ({ ...prev, [key]: value }));
    };

    const saveSettings = async () => {
        if (Object.keys(changes).length === 0) return;

        setSaving(true);
        setSaveStatus('idle');

        try {
            const settingsToUpdate = Object.entries(changes).map(([key, value]) => ({
                key,
                value
            }));

            const response = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ settings: settingsToUpdate })
            });

            if (response.ok) {
                setSaveStatus('success');
                setChanges({});
                loadSettings(); // Recargar para mostrar valores actualizados
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const resetChanges = () => {
        setChanges({});
        setSaveStatus('idle');
    };

    const renderSettingField = (setting: Setting) => {
        const currentValue = changes[setting.key] ?? setting.value;

        switch (setting.type) {
            case 'BOOLEAN':
                return (
                    <div className="flex items-center space-x-2">
                        <Switch
                            id={setting.key}
                            checked={currentValue === 'true'}
                            onCheckedChange={(checked) =>
                                handleSettingChange(setting.key, checked.toString())
                            }
                        />
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                    </div>
                );

            case 'TEXTAREA':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        <Textarea
                            id={setting.key}
                            value={currentValue}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            placeholder={setting.description}
                            rows={3}
                        />
                    </div>
                );

            case 'NUMBER':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        <Input
                            id={setting.key}
                            type="number"
                            value={currentValue}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            placeholder={setting.description}
                        />
                    </div>
                );

            case 'EMAIL':
                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        <Input
                            id={setting.key}
                            type="email"
                            value={currentValue}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            placeholder={setting.description}
                        />
                    </div>
                );

            case 'SELECT':
                const options = setting.key === 'default_user_role'
                    ? [{ value: 'USER', label: 'Usuario' }, { value: 'OWNER', label: 'Propietario' }]
                    : [];

                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        <Select value={currentValue} onValueChange={(value) => handleSettingChange(setting.key, value)}>
                            <SelectTrigger>
                                <SelectValue placeholder={setting.description} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                );

            default: // TEXT, URL, COLOR, etc.
                return (
                    <div className="space-y-2">
                        <Label htmlFor={setting.key}>{setting.label}</Label>
                        <Input
                            id={setting.key}
                            type={setting.type === 'COLOR' ? 'color' : 'text'}
                            value={currentValue}
                            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                            placeholder={setting.description}
                        />
                    </div>
                );
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center py-12">
                        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Acceso Restringido
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Solo los administradores pueden acceder a esta sección
                        </p>
                        <Button onClick={() => router.push("/dashboard")}>
                            Volver al Dashboard
                        </Button>
                    </CardContent>
                </Card>
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
                            <Link href="/admin" className="text-orange-600 hover:text-orange-700">
                                ← Volver al Admin
                            </Link>
                            <div className="flex items-center space-x-2">
                                <Settings className="w-6 h-6 text-orange-600" />
                                <h1 className="text-xl font-semibold">Configuración de la Plataforma</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Status de guardado */}
                            {saveStatus === 'success' && (
                                <div className="flex items-center space-x-2 text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm">Guardado exitosamente</span>
                                </div>
                            )}
                            {saveStatus === 'error' && (
                                <div className="flex items-center space-x-2 text-red-600">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">Error al guardar</span>
                                </div>
                            )}

                            {/* Botones de acción */}
                            {Object.keys(changes).length > 0 && (
                                <>
                                    <Badge variant="secondary">
                                        {Object.keys(changes).length} cambios pendientes
                                    </Badge>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetChanges}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Descartar
                                    </Button>
                                </>
                            )}

                            <Button
                                onClick={saveSettings}
                                disabled={saving || Object.keys(changes).length === 0}
                                size="sm"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Gestión de Configuraciones
                    </h2>
                    <p className="text-gray-600">
                        Administra las configuraciones generales de PetsCartagena
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                        {categories.map((category) => {
                            const Icon = categoryIcons[category as keyof typeof categoryIcons] || Settings;
                            return (
                                <TabsTrigger key={category} value={category} className="flex items-center space-x-2">
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        {categoryLabels[category as keyof typeof categoryLabels]?.replace(/^.{2}\s/, '') || category}
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    {categories.map((category) => (
                        <TabsContent key={category} value={category}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        {React.createElement(categoryIcons[category as keyof typeof categoryIcons] || Settings, { className: "w-5 h-5" })}
                                        <span>{categoryLabels[category as keyof typeof categoryLabels] || category}</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Configura los ajustes relacionados con {categoryLabels[category as keyof typeof categoryLabels]?.toLowerCase() || category}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {settings[category]?.map((setting) => (
                                        <div key={setting.key} className="space-y-1">
                                            {renderSettingField(setting)}
                                            {setting.description && setting.type !== 'BOOLEAN' && (
                                                <p className="text-sm text-gray-500">{setting.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}