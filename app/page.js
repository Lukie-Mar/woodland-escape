import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Rooms from "@/components/Rooms";
import Amenities from "@/components/Amenities";
import Contact from "@/components/Contact";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Rooms />
      <Amenities />
      <Contact />
    </main>
  );
}