import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import Rooms from "@/components/Rooms";
import Amenities from "@/components/Amenities";
import Contact from "@/components/Contact";
import Booking from "@/components/Booking/Booking";

import { getPaymentSettings } from "@/lib/settings";

export default async function Home() {
  const settings = await getPaymentSettings();

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Rooms />
      <Amenities />

      <Booking settings={settings} />

      <Contact />
    </main>
  );
}