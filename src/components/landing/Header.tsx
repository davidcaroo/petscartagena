"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, User, LogIn, Heart, Home, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleAuthAction = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="/petscartagena-logo.png"
              alt="PetsCartagena"
              className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
            />
            <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">PetsCartagena</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Inicio</Link>
            <Link href="/adopt" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Adoptar</Link>
            {user?.role === "OWNER" && (
              <Link href="/give-adoption" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Dar en Adopción</Link>
            )}
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">Cómo Funciona</Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-600 text-sm px-3 py-2 h-auto"
                  onClick={() => router.push("/dashboard")}
                >
                  <Home className="w-4 h-4 mr-1.5" />
                  Mi Panel
                </Button>
                {user.role === "ADMIN" && (
                  <Button
                    variant="outline"
                    className="text-sm px-3 py-2 h-auto"
                    onClick={() => router.push("/admin")}
                  >
                    <Settings className="w-4 h-4 mr-1.5" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-sm px-3 py-2 h-auto"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-600 text-sm px-3 py-2 h-auto">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-sm px-4 py-2 h-auto">
                    <User className="w-4 h-4 mr-1.5" />
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de navegación"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <nav className="py-4 px-2">
              <div className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/adopt"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Adoptar
                </Link>
                {user?.role === "OWNER" && (
                  <Link
                    href="/give-adoption"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dar en Adopción
                  </Link>
                )}
                <Link
                  href="/how-it-works"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors py-3 px-3 rounded-lg text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cómo Funciona
                </Link>
              </div>

              <div className="flex flex-col space-y-2 pt-4 mt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start py-3 px-3 h-auto text-base font-medium"
                      onClick={() => {
                        router.push("/dashboard");
                        setIsMenuOpen(false);
                      }}
                    >
                      <Home className="w-5 h-5 mr-3" />
                      Mi Panel
                    </Button>
                    {user.role === "ADMIN" && (
                      <Button
                        variant="ghost"
                        className="justify-start py-3 px-3 h-auto text-base font-medium"
                        onClick={() => {
                          router.push("/admin");
                          setIsMenuOpen(false);
                        }}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        Panel Admin
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start py-3 px-3 h-auto text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="justify-start w-full py-3 px-3 h-auto text-base font-medium">
                        <LogIn className="w-5 h-5 mr-3" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="bg-orange-500 hover:bg-orange-600 justify-start w-full py-3 px-3 h-auto text-base font-medium">
                        <User className="w-5 h-5 mr-3" />
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}