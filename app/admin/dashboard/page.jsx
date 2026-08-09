import { supabaseAdmin } from "@/lib/supabaseAdmin";
import DashboardCards from "@/components/Admin/DashboardCards";

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

      {/* Statistics Cards */}
      <DashboardCards
        reservations={reservations}
        payments={payments}
      />

      {/* Recent Reservations */}
      <div className={styles.tableCard}>
        <h2>Recent Reservations</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reservation Code</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>

          <tbody>
            {reservations.slice(0, 10).map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.reservation_code}</td>

                <td>{reservation.full_name}</td>

                <td>{reservation.check_in}</td>

                <td>
                  <span
                    className={
                      reservation.reservation_status === "CONFIRMED"
                        ? styles.confirmed
                        : styles.pending
                    }
                  >
                    {reservation.reservation_status}
                  </span>
                </td>

                <td>{reservation.payment_option}</td>
              </tr>
            ))}

            {reservations.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{ textAlign: "center" }}
                >
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}