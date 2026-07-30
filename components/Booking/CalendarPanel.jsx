"use client";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import styles from "./Booking.module.css";

export default function CalendarPanel({
  date,
  setDate,
  isBooked,
}) {
  // Today's date (time set to midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={styles.calendarCard}>
      <h3>Check-in Date</h3>

      <Calendar
        value={date}
        onChange={setDate}
        minDate={today}

        // Disable past dates and booked dates
        tileDisabled={({ date }) =>
          date < today || isBooked(date)
        }

        // Add styles
        tileClassName={({ date, view }) => {
          if (view !== "month") return null;

          if (isBooked(date)) {
            return styles.booked;
          }

          return styles.available;
        }}

        // Show "Booked" label
        tileContent={({ date, view }) => {
          if (view === "month" && isBooked(date)) {
            return (
              <span className={styles.bookedLabel}>
                Booked
              </span>
            );
          }

          return null;
        }}
      />

      <div className={styles.legend}>
        <div>
          <span className={styles.availableDot}></span>
          Available
        </div>

        <div>
          <span className={styles.bookedDot}></span>
          Booked
        </div>
      </div>
    </div>
  );
}