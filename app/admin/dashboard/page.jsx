import { supabaseAdmin } from "@/lib/supabaseAdmin";

import styles from "./Dashboard.module.css";

export default async function DashboardPage() {
  const [
    reservationsResult,
    confirmedResult,
    pendingResult,
    revenueResult,
    recentReservations,
  ] = await Promise.all([
    supabaseAdmin.from("reservations").select("*", { count: "exact", head: true }),

    supabaseAdmin
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("reservation_status", "CONFIRMED"),

    supabaseAdmin
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("reservation_status", "PENDING_PAYMENT"),

    supabaseAdmin
      .from("reservations")
      .select("amount_paid")
      .eq("reservation_status", "CONFIRMED"),

    supabaseAdmin
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const totalReservations = reservationsResult.count ?? 0;
  const confirmedReservations = confirmedResult.count ?? 0;
  const pendingReservations = pendingResult.count ?? 0;

  const revenue =
    revenueResult.data?.reduce(
      (sum, reservation) => sum + (reservation.amount_paid || 0),
      0
    ) || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back to Woodland Escape Admin</p>
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Reservations</h3>
          <h2>{totalReservations}</h2>
        </div>

        <div className={styles.card}>
          <h3>Confirmed</h3>
          <h2>{confirmedReservations}</h2>
        </div>

        <div className={styles.card}>
          <h3>Pending</h3>
          <h2>{pendingReservations}</h2>
        </div>

        <div className={styles.card}>
          <h3>Revenue</h3>
          <h2>
            ₱{revenue.toLocaleString("en-PH")}
          </h2>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2>Recent Reservations</h2>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reservation</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentReservations.data?.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.reservation_code}</td>

                <td>{reservation.full_name}</td>

                <td>{reservation.check_in}</td>

                <td>{reservation.payment_option}</td>

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
              </tr>
            ))}

            {recentReservations.data?.length === 0 && (
              <tr>
                <td colSpan="5">No reservations yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}