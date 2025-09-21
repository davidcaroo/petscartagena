"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Shield } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative padding-section bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container-responsive">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Encuentra una Familia Ideal para tu
                <span className="text-orange-500"> Mejor Amigo</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                En PetsCartagena, creemos en la adopción responsable. Conectamos
                mascotas necesitadas con familias amorosas en Cartagena y toda Colombia.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 text-lg w-full touch-target">
                  Adoptar una Mascota
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="px-8 text-lg w-full touch-target">
                  Dar en Adopción
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="text-center p-4 md:p-6">
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-xl md:text-2xl font-bold">500+</CardTitle>
              <CardDescription className="text-sm md:text-base">Mascotas Adoptadas</CardDescription>
            </Card>

            <Card className="text-center p-4 md:p-6">
              <Users className="w-10 h-10 md:w-12 md:h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-xl md:text-2xl font-bold">300+</CardTitle>
              <CardDescription className="text-sm md:text-base">Familias Felices</CardDescription>
            </Card>

            <Card className="text-center p-4 md:p-6 sm:col-span-2 lg:col-span-1">
              <Shield className="w-10 h-10 md:w-12 md:h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-xl md:text-2xl font-bold">100%</CardTitle>
              <CardDescription className="text-sm md:text-base">Proceso Seguro</CardDescription>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}