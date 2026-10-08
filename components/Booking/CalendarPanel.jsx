"use client";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import styles from "./Booking.module.css";

function getBlockedReasonLabel(
  reason
) {
  switch (reason) {
    case "EXISTING_BOOKING":
      return "Existing Booking";

    case "PRIVATE_EVENT":
      return "Private Event";

    case "MAINTENANCE":
      return "Maintenance";

    default:
      return "Unavailable";
  }
}

export default function CalendarPanel({
  date,
  setDate,
  isBooked,
  isUnavailable,
  getBlockedDate,
  availabilityLoading,
}) {
  // Today's date
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  return (
    <div
      className={
        styles.calendarCard
      }
    >
      <h3>
        Check-in Date
      </h3>

      {availabilityLoading && (
        <p
          style={{
            fontSize: "0.85rem",
            marginBottom: "10px",
          }}
        >
          Checking availability...
        </p>
      )}

      <Calendar
        value={date}
        onChange={setDate}
        minDate={today}

        tileDisabled={({
          date,
        }) =>
          date < today ||
          isUnavailable(date)
        }

        tileClassName={({
          date,
          view,
        }) => {
          if (
            view !== "month"
          ) {
            return null;
          }

          if (isBooked(date)) {
            return styles.booked;
          }

          const blocked =
            getBlockedDate(
              date
            );

          if (blocked) {
            return styles.unavailable;
          }

          return styles.available;
        }}

        tileContent={({
          date,
          view,
        }) => {
          if (
            view !== "month"
          ) {
            return null;
          }

          if (isBooked(date)) {
            return (
              <span
                className={
                  styles.bookedLabel
                }
              >
                Booked
              </span>
            );
          }

          const blocked =
            getBlockedDate(
              date
            );

          if (blocked) {
            return (
              <span
                className={
                  styles.unavailableLabel
                }
              >
                {getBlockedReasonLabel(
                  blocked.reason
                )}
              </span>
            );
          }

          return null;
        }}
      />

      <div
        className={
          styles.legend
        }
      >
        <div>
          <span
            className={
              styles.availableDot
            }
          ></span>

          Available
        </div>

        <div>
          <span
            className={
              styles.bookedDot
            }
          ></span>

          Booked
        </div>

        <div>
          <span
            className={
              styles.unavailableDot
            }
          ></span>

          Unavailable
        </div>
      </div>
    </div>
  );
}