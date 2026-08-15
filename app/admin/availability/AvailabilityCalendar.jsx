"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import Link from "next/link";

import "react-calendar/dist/Calendar.css";
import styles from "./AvailabilityCalendar.module.css";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getReservationForDate(
  date,
  reservations
) {
  const dateString = formatDate(date);

  return reservations.find(
    (reservation) =>
      reservation.check_in === dateString &&
      reservation.reservation_status !==
        "CANCELLED"
  );
}

function getStatusClass(status) {
  switch (status) {
    case "PENDING_PAYMENT":
      return styles.pending;

    case "CONFIRMED":
      return styles.confirmed;

    case "CHECKED_IN":
      return styles.checkedIn;

    case "CHECKED_OUT":
      return styles.checkedOut;

    default:
      return styles.available;
  }
}

function formatStatus(status) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "Pending Payment";

    case "CONFIRMED":
      return "Booked";

    case "CHECKED_IN":
      return "Checked In";

    case "CHECKED_OUT":
      return "Checked Out";

    default:
      return "Available";
  }
}

function getShortStatus(status) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "PENDING";

    case "CONFIRMED":
      return "BOOKED";

    case "CHECKED_IN":
      return "IN";

    case "CHECKED_OUT":
      return "OUT";

    default:
      return "AVAILABLE";
  }
}

export default function AvailabilityCalendar({
  reservations,
}) {
  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const selectedReservation = useMemo(
    () =>
      getReservationForDate(
        selectedDate,
        reservations
      ),
    [selectedDate, reservations]
  );

  const tileClassName = ({
    date,
    view,
  }) => {
    if (view !== "month") {
      return null;
    }

    const reservation =
      getReservationForDate(
        date,
        reservations
      );

    if (!reservation) {
      return styles.availableTile;
    }

    switch (
      reservation.reservation_status
    ) {
      case "PENDING_PAYMENT":
        return styles.pendingTile;

      case "CONFIRMED":
        return styles.confirmedTile;

      case "CHECKED_IN":
        return styles.checkedInTile;

      case "CHECKED_OUT":
        return styles.checkedOutTile;

      default:
        return styles.availableTile;
    }
  };

  const tileContent = ({
    date,
    view,
  }) => {
    if (view !== "month") {
      return null;
    }

    const reservation =
      getReservationForDate(
        date,
        reservations
      );

    if (!reservation) {
      return (
        <span className={styles.availableLabel}>
          AVAILABLE
        </span>
      );
    }

    return (
      <span
        className={`${styles.dateLabel} ${
          getStatusClass(
            reservation.reservation_status
          )
        }`}
      >
        {getShortStatus(
          reservation.reservation_status
        )}
      </span>
    );
  };

  return (
    <div className={styles.wrapper}>

      {/* =========================
          CALENDAR
      ========================= */}

      <div className={styles.calendarCard}>

        <div className={styles.calendarHeader}>

          <div>
            <span className={styles.eyebrow}>
              RESORT CALENDAR
            </span>

            <h2>
              Booking Availability
            </h2>

            <p>
              Check which dates are available
              before accepting a reservation.
            </p>
          </div>

        </div>

        <div className={styles.calendarContainer}>

          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            minDetail="month"
            prev2Label={null}
            next2Label={null}
            showNeighboringMonth={true}
          />

        </div>

        {/* =========================
            LEGEND
        ========================= */}

        <div className={styles.legend}>

          <div className={styles.legendTitle}>
            Date Status
          </div>

          <div className={styles.legendItems}>

            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.green}`}
              />

              <span>Available</span>
            </div>

            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.yellow}`}
              />

              <span>
                Pending Payment
              </span>
            </div>

            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.confirmedDot}`}
              />

              <span>Booked</span>
            </div>

            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.blue}`}
              />

              <span>Checked In</span>
            </div>

            <div className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.gray}`}
              />

              <span>Checked Out</span>
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          SELECTED DATE
      ========================= */}

      <div className={styles.detailsCard}>

        <div className={styles.detailsTop}>

          <span className={styles.eyebrow}>
            SELECTED DATE
          </span>

          <h2>
            {selectedDate.toLocaleDateString(
              "en-PH",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </h2>

        </div>

        {selectedReservation ? (
          <>

            <div
              className={
                styles.reservationStatus
              }
            >

              <span
                className={`${styles.statusDot} ${
                  getStatusClass(
                    selectedReservation.reservation_status
                  )
                }`}
              />

              <div>

                <span
                  className={styles.statusLabel}
                >
                  Reservation Status
                </span>

                <strong>
                  {formatStatus(
                    selectedReservation.reservation_status
                  )}
                </strong>

              </div>

            </div>

            <div
              className={
                styles.reservationCodeBox
              }
            >

              <span>
                RESERVATION
              </span>

              <strong>
                {
                  selectedReservation.reservation_code
                }
              </strong>

            </div>

            <div
              className={styles.detailsGrid}
            >

              <div
                className={styles.detailItem}
              >
                <span>Guest</span>

                <strong>
                  {
                    selectedReservation.full_name
                  }
                </strong>
              </div>

              <div
                className={styles.detailItem}
              >
                <span>Guests</span>

                <strong>
                  {
                    selectedReservation.guests
                  }{" "}
                  people
                </strong>
              </div>

              <div
                className={styles.detailItem}
              >
                <span>Check-in</span>

                <strong>
                  {
                    selectedReservation.check_in
                  }
                </strong>
              </div>

              <div
                className={styles.detailItem}
              >
                <span>Check-out</span>

                <strong>
                  {
                    selectedReservation.check_out
                  }
                </strong>
              </div>

            </div>

            <Link
              href={`/admin/reservations/${selectedReservation.id}`}
              className={styles.viewButton}
            >
              View Reservation
            </Link>

          </>
        ) : (

          <div
            className={styles.availableState}
          >

            <div
              className={styles.availableIcon}
            >
              ✓
            </div>

            <span
              className={styles.availableBadge}
            >
              AVAILABLE
            </span>

            <h3>
              This date is available
            </h3>

            <p>
              No active reservation is
              scheduled for this date.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}