"use client";

import { useState } from "react";

import styles from "./CancelReservation.module.css";

export default function CancelReservation({
  reservationId,
  reservationStatus,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCancelled =
    reservationStatus === "CANCELLED";

  const cannotCancel =
    reservationStatus === "CHECKED_IN" ||
    reservationStatus === "CHECKED_OUT";

  async function handleCancel() {
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/reservations/cancel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to cancel reservation."
        );
      }

      window.location.reload();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );

      setLoading(false);
    }
  }

  if (isCancelled) {
    return (
      <button
        className={styles.cancelled}
        disabled
      >
        Reservation Cancelled
      </button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={handleCancel}
        disabled={
          loading || cannotCancel
        }
      >
        {loading
          ? "Cancelling..."
          : "Cancel Reservation"}
      </button>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}