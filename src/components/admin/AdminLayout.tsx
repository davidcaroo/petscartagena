"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ArrowLeft,
  Home,
  Users,
  Heart,
  Settings,
  CheckCircle,
  BarChart3
} from "lucide-react";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/admin", icon: Home }
    ];

    if (pathname === "/admin") {
      return breadcrumbs;
    }

    if (pathname.includes("/admin/users")) {
      breadcrumbs.push({ label: "Usuarios", href: "/admin/users", icon: Users });
    } else if (pathname.includes("/admin/pets")) {
      breadcrumbs.push({ label: "Mascotas", href: "/admin/pets", icon: Heart });
    } else if (pathname.includes("/admin/adopciones")) {
      breadcrumbs.push({ label: "Adopciones", href: "/admin/adopciones", icon: CheckCircle });
    } else if (pathname.includes("/admin/config")) {
      breadcrumbs.push({ label: "Configuración", href: "/admin/config", icon: Settings });
    } else if (pathname.includes("/admin/stats")) {
      breadcrumbs.push({ label: "Estadísticas", href: "/admin/stats", icon: BarChart3 });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Navegación izquierda */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver
              </Button>

              {/* Breadcrumbs */}
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item, index) => (
                    <div key={item.label} className="flex items-center">
                      <BreadcrumbItem>
                        {item.href ? (
                          <BreadcrumbLink asChild>
                            <Link href={item.href} className="flex items-center space-x-1">
                              {item.icon && <item.icon className="w-4 h-4" />}
                              <span>{item.label}</span>
                            </Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="flex items-center space-x-1">
                            {item.icon && <item.icon className="w-4 h-4" />}
                            <span>{item.label}</span>
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Navegación derecha */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <Link href="/admin">
                  <Home className="w-4 h-4 mr-1" />
                  Dashboard
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Salir Admin
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-6">
        {/* Header de la página */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
}