"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import Link from "next/link";

import {
  blockAvailabilityDate,
  makeAvailabilityDateAvailable,
} from "./availabilityActions";

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
      reservation.check_in ===
        dateString &&
      reservation.reservation_status !==
        "CANCELLED"
  );
}

function getOverrideForDate(
  date,
  overrides
) {
  const dateString = formatDate(date);

  return overrides.find(
    (override) =>
      override.date === dateString &&
      override.status === "UNAVAILABLE"
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

function getOverrideLabel(reason) {
  switch (reason) {
    case "EXISTING_BOOKING":
      return "EXISTING";

    case "PRIVATE_EVENT":
      return "EVENT";

    case "MAINTENANCE":
      return "MAINT.";

    default:
      return "BLOCKED";
  }
}

function getOverrideReasonLabel(reason) {
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

export default function AvailabilityCalendar({
  reservations,
  overrides,
}) {
  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [selectedReason, setSelectedReason] =
    useState("EXISTING_BOOKING");

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const selectedReservation = useMemo(
    () =>
      getReservationForDate(
        selectedDate,
        reservations
      ),
    [selectedDate, reservations]
  );

  const selectedOverride = useMemo(
    () =>
      getOverrideForDate(
        selectedDate,
        overrides
      ),
    [selectedDate, overrides]
  );

  const selectedDateString =
    formatDate(selectedDate);

  async function handleBlockDate() {
    try {
      setIsSaving(true);
      setMessage("");

      await blockAvailabilityDate(
        selectedDateString,
        selectedReason
      );

      setMessage(
        `${getOverrideReasonLabel(
          selectedReason
        )} saved for this date.`
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      setMessage(
        error?.message ||
          "Unable to update availability."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMakeAvailable() {
    try {
      setIsSaving(true);
      setMessage("");

      await makeAvailabilityDateAvailable(
        selectedDateString
      );

      setMessage(
        "Date is now available."
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      setMessage(
        error?.message ||
          "Unable to update availability."
      );
    } finally {
      setIsSaving(false);
    }
  }

  const tileClassName = ({
    date,
    view,
  }) => {
    if (view !== "month") {
      return null;
    }

    const override =
      getOverrideForDate(
        date,
        overrides
      );

    if (override) {
      return styles.unavailableTile;
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

    const override =
      getOverrideForDate(
        date,
        overrides
      );

    if (override) {
      return (
        <span
          className={
            styles.unavailableLabel
          }
        >
          {getOverrideLabel(
            override.reason
          )}
        </span>
      );
    }

    const reservation =
      getReservationForDate(
        date,
        reservations
      );

    if (!reservation) {
      return (
        <span
          className={
            styles.availableLabel
          }
        >
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
        <div
          className={
            styles.calendarHeader
          }
        >
          <div>
            <span
              className={styles.eyebrow}
            >
              RESORT CALENDAR
            </span>

            <h2>
              Booking Availability
            </h2>

            <p>
              Check and manage which dates
              are available for reservations.
            </p>
          </div>
        </div>

        <div
          className={
            styles.calendarContainer
          }
        >
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
          <div
            className={
              styles.legendTitle
            }
          >
            Date Status
          </div>

          <div
            className={
              styles.legendItems
            }
          >
            <div
              className={
                styles.legendItem
              }
            >
              <span
                className={`${styles.legendDot} ${styles.green}`}
              />

              <span>Available</span>
            </div>

            <div
              className={
                styles.legendItem
              }
            >
              <span
                className={`${styles.legendDot} ${styles.yellow}`}
              />

              <span>
                Pending Payment
              </span>
            </div>

            <div
              className={
                styles.legendItem
              }
            >
              <span
                className={`${styles.legendDot} ${styles.confirmedDot}`}
              />

              <span>Booked</span>
            </div>

            <div
              className={
                styles.legendItem
              }
            >
              <span
                className={`${styles.legendDot} ${styles.blue}`}
              />

              <span>Checked In</span>
            </div>

            <div
              className={
                styles.legendItem
              }
            >
              <span
                className={`${styles.legendDot} ${styles.gray}`}
              />

              <span>Checked Out</span>
            </div>

            <div
              className={
                styles.legendItem
              }
            >
              <span
                className={`${styles.legendDot} ${styles.red}`}
              />

              <span>Unavailable</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          SELECTED DATE
      ========================= */}

      <div className={styles.detailsCard}>
        <div className={styles.detailsTop}>
          <span
            className={styles.eyebrow}
          >
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

        {/* =========================
            WEBSITE RESERVATION
        ========================= */}

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
                  className={
                    styles.statusLabel
                  }
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
              className={
                styles.detailsGrid
              }
            >
              <div
                className={
                  styles.detailItem
                }
              >
                <span>Guest</span>

                <strong>
                  {
                    selectedReservation.full_name
                  }
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
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
                className={
                  styles.detailItem
                }
              >
                <span>Check-in</span>

                <strong>
                  {
                    selectedReservation.check_in
                  }
                </strong>
              </div>

              <div
                className={
                  styles.detailItem
                }
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
        ) : selectedOverride ? (
          /* =========================
             MANUAL BLOCK
          ========================= */

          <div
            className={
              styles.unavailableState
            }
          >
            <div
              className={
                styles.unavailableIcon
              }
            >
              !
            </div>

            <span
              className={
                styles.unavailableBadge
              }
            >
              UNAVAILABLE
            </span>

            <h3>
              {
                getOverrideReasonLabel(
                  selectedOverride.reason
                )
              }
            </h3>

            <p>
              This date has been manually
              blocked by the administrator.
            </p>

            <button
              type="button"
              className={
                styles.availableButton
              }
              onClick={
                handleMakeAvailable
              }
              disabled={isSaving}
            >
              {isSaving
                ? "Updating..."
                : "Make Available"}
            </button>
          </div>
        ) : (
          /* =========================
             AVAILABLE
          ========================= */

          <div
            className={
              styles.availableState
            }
          >
            <div
              className={
                styles.availableIcon
              }
            >
              ✓
            </div>

            <span
              className={
                styles.availableBadge
              }
            >
              AVAILABLE
            </span>

            <h3>
              This date is available
            </h3>

            <p>
              No active reservation or
              manual block is scheduled for
              this date.
            </p>
          </div>
        )}

        {/* =========================
            AVAILABILITY CONTROL
        ========================= */}

        {!selectedReservation &&
          !selectedOverride && (
            <div
              className={
                styles.availabilityControl
              }
            >
              <div
                className={
                  styles.controlHeader
                }
              >
                <span
                  className={
                    styles.statusLabel
                  }
                >
                  MANAGE AVAILABILITY
                </span>

                <strong>
                  Block this date
                </strong>
              </div>

              <p>
                Use this when the resort is
                unavailable for a booking made
                outside the website.
              </p>

              <label
                htmlFor="availabilityReason"
              >
                Reason
              </label>

              <select
                id="availabilityReason"
                value={selectedReason}
                onChange={(event) =>
                  setSelectedReason(
                    event.target.value
                  )
                }
                disabled={isSaving}
              >
                <option value="EXISTING_BOOKING">
                  Existing Booking
                </option>

                <option value="PRIVATE_EVENT">
                  Private Event
                </option>

                <option value="MAINTENANCE">
                  Maintenance
                </option>
              </select>

              <button
                type="button"
                className={
                  styles.blockButton
                }
                onClick={
                  handleBlockDate
                }
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : "Mark as Unavailable"}
              </button>
            </div>
          )}

        {message && (
          <div
            className={
              styles.actionMessage
            }
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}