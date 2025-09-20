import { HeroSection } from "@/components/landing/HeroSection";
import { ResponsibleAdoption } from "@/components/landing/ResponsibleAdoption";
import { AdoptionProcess } from "@/components/landing/AdoptionProcess";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ResponsibleAdoption />
        <AdoptionProcess />
      </main>
      <Footer />
    </div>
  );
}