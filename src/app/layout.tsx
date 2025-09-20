import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "PetsCartagena - Adopción Responsable de Mascotas",
  description: "Encuentra una familia ideal para tu mejor amigo. Plataforma de adopción responsable de mascotas en Cartagena.",
  keywords: ["adopción", "mascotas", "Cartagena", "perros", "gatos", "adopción responsable"],
  authors: [{ name: "PetsCartagena Team" }],
  openGraph: {
    title: "PetsCartagena - Adopción Responsable de Mascotas",
    description: "Encuentra una familia ideal para tu mejor amigo. Plataforma de adopción responsable de mascotas en Cartagena.",
    url: "https://petscartagena.com",
    siteName: "PetsCartagena",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetsCartagena - Adopción Responsable de Mascotas",
    description: "Encuentra una familia ideal para tu mejor amigo. Plataforma de adopción responsable de mascotas en Cartagena.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground"
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
