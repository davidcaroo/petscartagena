
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "PetsCartagena - Adopción Responsable de Mascotas",
  description: "Encuentra una familia ideal para tu mejor amigo. Plataforma de adopción responsable de mascotas en Cartagena.",
  keywords: ["adopción", "mascotas", "Cartagena", "perros", "gatos", "adopción responsable"],
  authors: [{ name: "PetsCartagena Team" }],
  icons: {
    icon: [
      { url: "/petscartagena-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/petscartagena-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/petscartagena-logo.png",
  },
  openGraph: {
    title: "PetsCartagena - Adopción Responsable de Mascotas",
    description: "Encuentra una familia ideal para tu mejor amigo. Plataforma de adopción responsable de mascotas en Cartagena.",
    url: "https://petscartagena.com",
    siteName: "PetsCartagena",
    type: "website",
    images: ["/petscartagena-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PetsCartagena - Adopción Responsable de Mascotas",
    description: "Encuentra una familia ideal para tu mejor amigo. Plataforma de adopción responsable de mascotas en Cartagena.",
    images: ["/petscartagena-logo.png"],
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
