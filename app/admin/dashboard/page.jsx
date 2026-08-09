import { supabaseAdmin } from "@/lib/supabaseAdmin";
import DashboardCards from "@/components/Admin/DashboardCards";
import RecentReservations from "@/components/Admin/RecentReservations";

import styles from "./Dashboard.module.css";

export default async function DashboardPage() {
  // Fetch reservations
  const { data: reservations = [] } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch payments
  const { data: payments = [] } = await supabaseAdmin
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className={styles.container}>
      {/* Dashboard Header */}
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back to Woodland Escape Admin</p>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <DashboardCards
        reservations={reservations}
        payments={payments}
      />

      {/* Recent Reservations */}
      <RecentReservations
        reservations={reservations}
      />
    </div>
  );
}