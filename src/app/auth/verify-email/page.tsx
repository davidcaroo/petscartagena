'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
    const [message, setMessage] = useState('');
    const [resending, setResending] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token de verificación no encontrado');
            return;
        }

        verifyEmail(token);
    }, [token]);

    const verifyEmail = async (verificationToken: string) => {
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: verificationToken }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Email verificado exitosamente');
                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    router.push('/auth/signin?verified=true');
                }, 3000);
            } else {
                if (data.error === 'TOKEN_EXPIRED') {
                    setStatus('expired');
                } else {
                    setStatus('error');
                }
                setMessage(data.message || 'Error al verificar el email');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Error de conexión. Por favor intenta de nuevo.');
        }
    };

    const resendVerificationEmail = async () => {
        setResending(true);
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Nuevo email de verificación enviado. Revisa tu bandeja de entrada.');
            } else {
                setMessage(data.message || 'Error al reenviar el email');
            }
        } catch (error) {
            setMessage('Error al reenviar el email. Intenta de nuevo.');
        } finally {
            setResending(false);
        }
    };

    const getIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />;
            case 'success':
                return <CheckCircle className="h-12 w-12 text-green-500" />;
            case 'error':
            case 'expired':
                return <XCircle className="h-12 w-12 text-red-500" />;
            default:
                return <Mail className="h-12 w-12 text-gray-500" />;
        }
    };

    const getTitle = () => {
        switch (status) {
            case 'loading':
                return 'Verificando email...';
            case 'success':
                return '¡Email verificado!';
            case 'expired':
                return 'Token expirado';
            case 'error':
                return 'Error de verificación';
            default:
                return 'Verificación de email';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {getIcon()}
                    </div>
                    <CardTitle className="text-2xl">{getTitle()}</CardTitle>
                    <CardDescription>
                        {status === 'loading' && 'Estamos verificando tu dirección de email...'}
                        {status === 'success' && 'Tu cuenta ha sido verificada exitosamente. Serás redirigido al login.'}
                        {status === 'expired' && 'El enlace de verificación ha expirado. Puedes solicitar uno nuevo.'}
                        {status === 'error' && 'Hubo un problema al verificar tu email.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {message && (
                        <div className={`p-3 rounded-md text-sm ${status === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col space-y-2">
                        {status === 'success' && (
                            <Link href="/auth/signin?verified=true">
                                <Button className="w-full">
                                    Ir al Login
                                </Button>
                            </Link>
                        )}

                        {status === 'expired' && (
                            <Button
                                onClick={resendVerificationEmail}
                                disabled={resending}
                                className="w-full"
                            >
                                {resending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Reenviando...
                                    </>
                                ) : (
                                    'Reenviar verificación'
                                )}
                            </Button>
                        )}

                        {status === 'error' && (
                            <Button
                                onClick={() => router.push('/auth/signup')}
                                variant="outline"
                                className="w-full"
                            >
                                Volver al registro
                            </Button>
                        )}

                        <Link href="/">
                            <Button variant="ghost" className="w-full">
                                Volver al inicio
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}