"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Shield } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Encuentra una Familia Ideal para tu
                <span className="text-orange-500"> Mejor Amigo</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                En PetsCartagena, creemos en la adopción responsable. Conectamos 
                mascotas necesitadas con familias amorosas en Cartagena y toda Colombia.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg w-full sm:w-auto">
                  Adoptar una Mascota
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="px-8 py-3 text-lg w-full sm:w-auto">
                  Dar en Adopción
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center p-6">
              <Heart className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold">500+</CardTitle>
              <CardDescription>Mascotas Adoptadas</CardDescription>
            </Card>
            
            <Card className="text-center p-6">
              <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold">300+</CardTitle>
              <CardDescription>Familias Felices</CardDescription>
            </Card>
            
            <Card className="text-center p-6">
              <Shield className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold">100%</CardTitle>
              <CardDescription>Proceso Seguro</CardDescription>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}