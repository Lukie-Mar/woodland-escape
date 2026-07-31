import styles from "./RecentReservations.module.css";

const reservations = [
  {
    code: "WE-202608-001",
    guest: "Juan Dela Cruz",
    checkIn: "Aug 5, 2026",
    guests: 20,
    status: "Confirmed",
  },
  {
    code: "WE-202608-002",
    guest: "Maria Santos",
    checkIn: "Aug 9, 2026",
    guests: 18,
    status: "Awaiting Payment",
  },
  {
    code: "WE-202608-003",
    guest: "Pedro Reyes",
    checkIn: "Aug 15, 2026",
    guests: 24,
    status: "Confirmed",
  },
];

export default function RecentReservations() {
  function statusClass(status) {
    switch (status) {
      case "Confirmed":
        return styles.confirmed;

      case "Awaiting Payment":
        return styles.pending;

      case "Cancelled":
        return styles.cancelled;

      default:
        return "";
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>Recent Reservations</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Reservation Code</th>
            <th>Guest</th>
            <th>Check-in</th>
            <th>Guests</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.code}>
              <td>{reservation.code}</td>
              <td>{reservation.guest}</td>
              <td>{reservation.checkIn}</td>
              <td>{reservation.guests}</td>
              <td>
                <span
                  className={`${styles.badge} ${statusClass(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}