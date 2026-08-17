import Link from "next/link";
import styles from "./RecentReservations.module.css";

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount) {
  return `₱${Number(amount || 0).toLocaleString()}`;
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
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";

    case "PENDING_PAYMENT":
      return "Pending Payment";

    case "CANCELLED":
      return "Cancelled";

    case "CHECKED_IN":
      return "Checked In";

    case "CHECKED_OUT":
      return "Checked Out";

    default:
      return status || "Unknown";
  }
}

export default function RecentReservations({
  reservations = [],
}) {
  const recentReservations =
    reservations.slice(0, 10);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Recent Reservations</h2>

          <p>
            Latest bookings made at Woodland Escape
          </p>
        </div>

        <Link
          href="/admin/reservations"
          className={styles.viewAll}
        >
          View All
        </Link>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reservation</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Guests</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {recentReservations.map(
              (reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <strong>
                      {reservation.reservation_code}
                    </strong>
                  </td>

                  <td>
                    {reservation.full_name}
                  </td>

                  <td>
                    {formatDate(
                      reservation.check_in
                    )}
                  </td>

                  <td>
                    {reservation.guests}
                  </td>

                  <td>
                    <div
                      className={styles.payment}
                    >
                      <strong>
                        {formatCurrency(
                          reservation.amount_paid
                        )}
                      </strong>

                      {reservation.payment_option ===
                        "DOWN_PAYMENT" &&
                        Number(
                          reservation.remaining_balance ||
                            0
                        ) > 0 && (
                          <span>
                            {formatCurrency(
                              reservation.remaining_balance
                            )}{" "}
                            remaining
                          </span>
                        )}
                    </div>
                  </td>

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

                  <td>
                    <Link
                      href={`/admin/reservations/${reservation.id}`}
                      className={
                        styles.viewButton
                      }
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            )}

            {recentReservations.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
                  className={styles.empty}
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