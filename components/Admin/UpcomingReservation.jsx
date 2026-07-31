import styles from "./UpcomingReservation.module.css";

const reservation = {
  code: "WE-202608-015",
  guest: "Juan Dela Cruz",
  date: "August 15, 2026",
  guests: 24,
  status: "Paid",
};

export default function UpcomingReservation() {
  return (
    <div className={styles.card}>
      <h2>Next Reservation</h2>

      <div className={styles.info}>
        <h3>{reservation.code}</h3>

        <p>
          <strong>Guest:</strong> {reservation.guest}
        </p>

        <p>
          <strong>Date:</strong> {reservation.date}
        </p>

        <p>
          <strong>Guests:</strong> {reservation.guests}
        </p>

        <p>
          <strong>Status:</strong>

          <span className={styles.paid}>
            {reservation.status}
          </span>
        </p>

        <hr />

        <p>
          <strong>Check-in:</strong> 2:00 PM
        </p>

        <p>
          <strong>Check-out:</strong> 12:00 PM
        </p>

        <button className={styles.button}>
          View Reservation
        </button>
      </div>
    </div>
  );
}