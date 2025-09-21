"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Camera,
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Save,
    Trash2,
    Upload,
    Eye,
    EyeOff
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

interface UserProfile {
    id: string;
    email: string;
    name: string;
    phone?: string;
    address?: string;
    city?: string;
    role: string;
    avatar?: string;
    bio?: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ProfileSettingsPage() {
    const { user, token, isLoading, updateUser } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile data
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "",
        city: "",
        bio: ""
    });

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Messages
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (user && token) {
            loadProfile();
        }
    }, [user, token, isLoading, router]);

    const loadProfile = async () => {
        try {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const profileData = await response.json();
                setProfile(profileData);
                setFormData({
                    email: profileData.email || "",
                    phone: profileData.phone || "",
                    address: profileData.address || "",
                    city: profileData.city || "",
                    bio: profileData.bio || ""
                });
            }
        } catch (error) {
            console.error("Error loading profile:", error);
            setMessage({ type: 'error', text: 'Error al cargar el perfil' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear any existing messages when user starts typing
        if (message) setMessage(null);
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
        if (message) setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const updatePayload: any = { ...formData };

            // Add password change if provided
            if (passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    setMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
                    setSaving(false);
                    return;
                }
                updatePayload.currentPassword = passwordData.currentPassword;
                updatePayload.newPassword = passwordData.newPassword;
            }

            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatePayload)
            });

            const result = await response.json();

            if (response.ok) {
                setProfile(result);
                // Update auth context if email changed
                if (result.email !== user?.email) {
                    updateUser({ ...user, email: result.email });
                }
                setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });

                // Clear password fields
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al actualizar el perfil' });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        setUploadingAvatar(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch('/api/profile/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                setProfile(result.user);
                updateUser({ ...user, avatar: result.user.avatar });
                setMessage({ type: 'success', text: 'Foto de perfil actualizada' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al subir la imagen' });
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            setMessage({ type: 'error', text: 'Error al subir la imagen' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        setUploadingAvatar(true);

        try {
            const response = await fetch('/api/profile/avatar', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                setProfile(result.user);
                updateUser({ ...user, avatar: null });
                setMessage({ type: 'success', text: 'Foto de perfil eliminada' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Error al eliminar la imagen' });
            }
        } catch (error) {
            console.error("Error removing avatar:", error);
            setMessage({ type: 'error', text: 'Error al eliminar la imagen' });
        } finally {
            setUploadingAvatar(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleAvatarUpload(file);
        }
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case "USER": return "Adoptante";
            case "OWNER": return "Dueño de Mascota";
            case "ADMIN": return "Administrador";
            default: return role;
        }
    };

    if (isLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar perfil</h2>
                    <Button onClick={() => router.push("/dashboard")}>
                        Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 container-responsive padding-section">
            <div className="max-w-4xl mx-auto space-y-6">
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
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Configuración del Perfil</h1>
                            <p className="text-gray-600">Edita tu información personal y configuración de cuenta</p>
                        </div>
                    </div>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-4 rounded-lg ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Profile Photo Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Camera className="w-5 h-5" />
                            <span>Foto de Perfil</span>
                        </CardTitle>
                        <CardDescription>
                            Sube una foto de perfil para personalizar tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Avatar className="w-24 h-24 md:w-32 md:h-32">
                                <AvatarImage src={profile.avatar || undefined} />
                                <AvatarFallback className="text-2xl">
                                    {profile.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>

                            <div className="space-y-2 text-center sm:text-left">
                                <p className="text-sm text-gray-600">
                                    Formatos soportados: JPG, PNG, WebP (máximo 5MB)
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                        onClick={triggerFileInput}
                                        disabled={uploadingAvatar}
                                        className="touch-target"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {uploadingAvatar ? 'Subiendo...' : 'Subir Foto'}
                                    </Button>

                                    {profile.avatar && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    disabled={uploadingAvatar}
                                                    className="touch-target"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Eliminar
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="bg-white border-gray-200 shadow-lg">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar foto de perfil?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción eliminará tu foto de perfil actual. Podrás subir una nueva en cualquier momento.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleRemoveAvatar}>
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="w-5 h-5" />
                            <span>Información Personal</span>
                        </CardTitle>
                        <CardDescription>
                            Actualiza tu información de contacto y perfil
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Read-only fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nombre</Label>
                                    <Input
                                        value={profile.name || ''}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500">El nombre no se puede modificar</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipo de Usuario</Label>
                                    <Input
                                        value={getRoleDisplayName(profile.role)}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Editable fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center space-x-1">
                                        <Mail className="w-4 h-4" />
                                        <span>Email</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="tu@email.com"
                                        className="min-h-[44px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center space-x-1">
                                        <Phone className="w-4 h-4" />
                                        <span>Teléfono</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+57 300 123 4567"
                                        className="min-h-[44px]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Tu dirección"
                                        className="min-h-[44px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city" className="flex items-center space-x-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>Ciudad</span>
                                    </Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        placeholder="Tu ciudad"
                                        className="min-h-[44px]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografía</Label>
                                <Textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    placeholder="Cuéntanos un poco sobre ti..."
                                    rows={3}
                                    className="resize-none"
                                />
                                <p className="text-xs text-gray-500">
                                    Comparte información que puede ser útil para otros usuarios
                                </p>
                            </div>

                            <Separator />

                            {/* Password Change Section */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Lock className="w-5 h-5" />
                                    <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Deja estos campos vacíos si no deseas cambiar tu contraseña
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">Contraseña Actual</Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                type={showPasswords.current ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                placeholder="Contraseña actual"
                                                className="min-h-[44px] pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                            >
                                                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showPasswords.new ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                placeholder="Nueva contraseña"
                                                className="min-h-[44px] pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                            >
                                                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showPasswords.confirm ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                placeholder="Confirmar contraseña"
                                                className="min-h-[44px] pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            >
                                                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-orange-500 hover:bg-orange-600 touch-target px-8"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información de la Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Cuenta creada:</p>
                                <p className="font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Última actualización:</p>
                                <p className="font-medium">
                                    {new Date(profile.updatedAt).toLocaleDateString("es-CO", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}