"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import styles from "./ReservationFilters.module.css";

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
  if (status === "PENDING_PAYMENT") return "Pending Payment";
  if (status === "CONFIRMED") return "Confirmed";
  if (status === "CANCELLED") return "Cancelled";

  return status || "Unknown";
}

export default function ReservationFilters({ reservations }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [paymentStatus, setPaymentStatus] = useState("ALL");

  const filteredReservations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const matchesSearch =
        !searchValue ||
        reservation.reservation_code
          ?.toLowerCase()
          .includes(searchValue) ||
        reservation.full_name
          ?.toLowerCase()
          .includes(searchValue) ||
        reservation.email
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "ALL" ||
        reservation.reservation_status === status;

      const matchesPayment =
        paymentStatus === "ALL" ||
        reservation.payment_status === paymentStatus;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [reservations, search, status, paymentStatus]);

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPaymentStatus("ALL");
  };

  const hasFilters =
    search !== "" ||
    status !== "ALL" ||
    paymentStatus !== "ALL";

  return (
    <div className={styles.wrapper}>
      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="text"
            placeholder="Search reservation or guest..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={styles.select}
        >
          <option value="ALL">All Reservation Status</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
          className={styles.select}
        >
          <option value="ALL">All Payment Status</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className={styles.clearButton}
          >
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      <div className={styles.resultsHeader}>
        <span>
          Showing <strong>{filteredReservations.length}</strong>{" "}
          of <strong>{reservations.length}</strong> reservations
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {filteredReservations.length === 0 ? (
          <div className={styles.empty}>
            <h3>No reservations found</h3>
            <p>
              Try changing your search or filter settings.
            </p>
          </div>
        ) : (
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
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <strong className={styles.reservationCode}>
                      {reservation.reservation_code}
                    </strong>
                  </td>

                  <td>
                    <div className={styles.guest}>
                      <strong>{reservation.full_name}</strong>

                      {reservation.email && (
                        <span>{reservation.email}</span>
                      )}
                    </div>
                  </td>

                  <td>{formatDate(reservation.check_in)}</td>

                  <td>{formatDate(reservation.check_out)}</td>

                  <td>{reservation.guests}</td>

                  <td>
                    {formatCurrency(reservation.total_amount)}
                  </td>

                  <td>
                    {formatCurrency(reservation.amount_paid)}
                  </td>

                  <td>
                    <span className={styles.balance}>
                      {formatCurrency(
                        reservation.remaining_balance
                      )}
                    </span>
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
                      className={styles.viewButton}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}