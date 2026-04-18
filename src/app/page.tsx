import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Products from "@/components/sections/Products";
import Team from "@/components/sections/Team";
import Clients from "@/components/sections/Clients";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Products />
        <Team />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
