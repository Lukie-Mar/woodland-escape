"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./ReservationCalendar.module.css";

const bookedDates = [
  "2026-08-05",
  "2026-08-09",
  "2026-08-15",
  "2026-08-22",
];

export default function ReservationCalendar() {
  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function isBooked(date) {
    return bookedDates.includes(formatDate(date));
  }

  return (
    <div className={styles.card}>
      <h2>Reservation Calendar</h2>

      <Calendar
        tileClassName={({ date }) => {
          if (isBooked(date)) return styles.booked;

          if (date < new Date(new Date().setHours(0, 0, 0, 0)))
            return styles.past;

          return styles.available;
        }}
      />

      <div className={styles.legend}>
        <div>
          <span className={`${styles.dot} ${styles.green}`}></span>
          Available
        </div>

        <div>
          <span className={`${styles.dot} ${styles.red}`}></span>
          Booked
        </div>
      </div>
    </div>
  );
}