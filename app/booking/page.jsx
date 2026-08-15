import Booking from "@/components/Booking/Booking";
import { getPaymentSettings } from "@/lib/settings";

export default async function BookingPage() {
  const settings = await getPaymentSettings();

  return (
    <main>
      <Booking settings={settings} />
    </main>
  );
}