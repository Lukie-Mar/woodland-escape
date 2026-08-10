import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import styles from "./Reservations.module.css";

function formatCurrency(amount) {
  return `₱${Number(amount || 0).toLocaleString()}`;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusClass(status) {
  switch (status) {
    case "CONFIRMED":
      return styles.confirmed;

    case "PENDING_PAYMENT":
      return styles.pending;

    case "CANCELLED":
      return styles.cancelled;

    default:
      return styles.defaultStatus;
  }
}

function formatStatus(status) {
  if (status === "PENDING_PAYMENT") {
    return "Pending Payment";
  }

  if (status === "CONFIRMED") {
    return "CONFIRMED";
  }

  if (status === "CANCELLED") {
    return "CANCELLED";
  }

  return status || "UNKNOWN";
}

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
      {/* =========================
          PAGE HEADER
      ========================= */}

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

      {/* =========================
          RESERVATION TABLE
      ========================= */}

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>All Reservations</h2>
            <p>Latest bookings are shown first</p>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className={styles.empty}>
            <h3>No reservations yet</h3>
            <p>New bookings will appear here.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Reservation</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    {/* Reservation Code */}
                    <td>
                      <strong className={styles.reservationCode}>
                        {reservation.reservation_code}
                      </strong>
                    </td>

                    {/* Guest */}
                    <td>
                      <div className={styles.guest}>
                        <strong>{reservation.full_name}</strong>

                        {reservation.email && (
                          <span>{reservation.email}</span>
                        )}
                      </div>
                    </td>

                    {/* Check-in */}
                    <td>{formatDate(reservation.check_in)}</td>

                    {/* Check-out */}
                    <td>{formatDate(reservation.check_out)}</td>

                    {/* Guests */}
                    <td>{reservation.guests}</td>

                    {/* Total */}
                    <td>
                      {formatCurrency(reservation.total_amount)}
                    </td>

                    {/* Paid */}
                    <td>
                      {formatCurrency(reservation.amount_paid)}
                    </td>

                    {/* Remaining Balance */}
                    <td>
                      <span className={styles.balance}>
                        {formatCurrency(
                          reservation.remaining_balance
                        )}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`${styles.status} ${getStatusClass(
                          reservation.reservation_status
                        )}`}
                      >
                        {formatStatus(
                          reservation.reservation_status
                        )}
                      </span>
                    </td>

                    {/* View */}
                    <td>
                      <Link
                        href={`/admin/reservations/${reservation.id}`}
                        className={styles.viewButton}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}