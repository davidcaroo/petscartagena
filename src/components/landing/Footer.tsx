"use client";

import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface ContactSettings {
  company_email?: { value: string };
  company_phone?: { value: string };
  company_address?: { value: string };
  platform_name?: { value: string };
}

export function Footer() {
  const [settings, setSettings] = useState<ContactSettings>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings/public");
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white padding-section">
      <div className="container-responsive">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <img
                src="/petscartagena-logo.png"
                alt="PetsCartagena"
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <span className="text-lg sm:text-xl font-bold">
                {settings.platform_name?.value || "PetsCartagena"}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-300">
              Conectando corazones, creando familias.
              Tu plataforma de adopción responsable en Cartagena.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer touch-target" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer touch-target" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer touch-target" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors touch-target block py-1">Adoptar</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-target block py-1">Dar en Adopción</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-target block py-1">Cómo Funciona</a></li>
              <li><a href="#" className="hover:text-white transition-colors touch-target block py-1">Testimonios</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Soporte</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-300">
              <li>
                <Link href="/preguntas-frecuentes" className="hover:text-white transition-colors touch-target block py-1">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/guia-de-adopcion" className="hover:text-white transition-colors touch-target block py-1">
                  Guía de Adopción
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors touch-target block py-1">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terminos-y-condiciones" className="hover:text-white transition-colors touch-target block py-1">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Contacto</h3>
            <div className="space-y-3 text-sm sm:text-base text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">
                  {settings.company_email?.value || "info@petscartagena.com"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{settings.company_phone?.value || "+57 300 123 4567"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{settings.company_address?.value || "Cartagena, Colombia"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 lg:mt-12 pt-6 lg:pt-8 text-center text-gray-400">
          <p className="text-xs sm:text-sm">&copy; 2024 PetsCartagena. Todos los derechos reservados. Hecho con ❤️ para las mascotas.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;