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
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/petscartagena-logo.png" 
              alt="PetsCartagena" 
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-gray-900">PetsCartagena</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">Inicio</Link>
            <Link href="/adopt" className="text-gray-600 hover:text-gray-900 transition-colors">Adoptar</Link>
            {user?.role === "OWNER" && (
              <Link href="/give-adoption" className="text-gray-600 hover:text-gray-900 transition-colors">Dar en Adopción</Link>
            )}
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">Cómo Funciona</Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-600"
                  onClick={() => router.push("/dashboard")}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Mi Panel
                </Button>
                {user.role === "ADMIN" && (
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/admin")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" className="text-gray-600">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <User className="w-4 h-4 mr-2" />
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors py-2">Inicio</Link>
              <Link href="/adopt" className="text-gray-600 hover:text-gray-900 transition-colors py-2">Adoptar</Link>
              {user?.role === "OWNER" && (
                <Link href="/give-adoption" className="text-gray-600 hover:text-gray-900 transition-colors py-2">Dar en Adopción</Link>
              )}
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors py-2">Cómo Funciona</Link>
              
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      className="justify-start"
                      onClick={() => router.push("/dashboard")}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Mi Panel
                    </Button>
                    {user.role === "ADMIN" && (
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => router.push("/admin")}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Panel Admin
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      className="justify-start"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="ghost" className="justify-start">
                        <LogIn className="w-4 h-4 mr-2" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="bg-orange-500 hover:bg-orange-600 justify-start">
                        <User className="w-4 h-4 mr-2" />
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