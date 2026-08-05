import { supabaseAdmin } from "@/lib/supabaseAdmin";
import styles from "./Reservations.module.css";

export default async function ReservationsPage() {
  const { data: reservations } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Reservations</h1>
          <p>Manage all Woodland Escape reservations</p>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Reservation</th>
              <th>Guest</th>
              <th>Check-in</th>
              <th>Guests</th>
              <th>Payment</th>
              <th>Amount Paid</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {reservations?.map((reservation) => {
              const remaining =
                (reservation.total_amount || 0) -
                (reservation.amount_paid || 0);

              return (
                <tr key={reservation.id}>
                  <td>
                    <a href={`/admin/reservations/${reservation.id}`}>
                        {reservation.reservation_code}
                    </a>
                </td>

                  <td>
                    <strong>{reservation.full_name}</strong>
                    <br />
                    <small>{reservation.email}</small>
                  </td>

                  <td>{reservation.check_in}</td>

                  <td>{reservation.number_of_guests}</td>

                  <td>{reservation.payment_option}</td>

                  <td>
                    ₱
                    {(reservation.amount_paid || 0).toLocaleString(
                      "en-PH"
                    )}
                  </td>

                  <td>
                    ₱
                    {remaining.toLocaleString("en-PH")}
                  </td>

                  <td>
                    <span
                      className={
                        reservation.reservation_status === "CONFIRMED"
                          ? styles.confirmed
                          : reservation.reservation_status ===
                            "PENDING_PAYMENT"
                          ? styles.pending
                          : styles.cancelled
                      }
                    >
                      {reservation.reservation_status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {reservations?.length === 0 && (
              <tr>
                <td colSpan="8">
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