import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Rooms from "@/components/Rooms";
import Amenities from "@/components/Amenities";
import Contact from "@/components/Contact";
import Booking from "@/components/Booking/Booking";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Rooms />
      <Amenities />
      <Booking/>
      <Contact />
    </main>
  );
}