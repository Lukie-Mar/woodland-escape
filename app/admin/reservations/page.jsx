import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ReservationFilters from "@/components/Admin/ReservationFilters";

import styles from "./Reservations.module.css";

export default async function ReservationsPage() {
  const { data: reservations = [], error } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Unable to load reservations</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1>Reservations</h1>

          <p>Manage all Woodland Escape bookings</p>

          <div className={styles.total}>
            <strong>{reservations.length}</strong>
            <span>Total Reservations</span>
          </div>
        </div>
      </div>

      {/* Reservations */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>All Reservations</h2>
            <p>Search and manage your bookings</p>
          </div>
        </div>

        <ReservationFilters reservations={reservations} />
      </div>
    </div>
  );
}