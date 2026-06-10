import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { ServicesBento } from "../components/ServicesBento";
import { TechProof } from "../components/TechProof";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen relative selection:bg-pink-100 selection:text-pink-900">
      <Navbar />
      <main className="pt-24 space-y-24 md:space-y-32">
        <Hero />
        <ServicesBento />
        <TechProof />
      </main>
      <Footer />
    </div>
  );
}
