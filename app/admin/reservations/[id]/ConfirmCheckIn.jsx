"use client";

import { useState } from "react";

import styles from "./ConfirmCheckIn.module.css";

export default function ConfirmCheckIn({
  reservationId,
  reservationStatus,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCheckedIn =
    reservationStatus === "CHECKED_IN";

  const isNotConfirmed =
    reservationStatus !== "CONFIRMED";

  async function handleCheckIn() {
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to check in this guest?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/reservations/check-in",
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
            "Unable to check in guest."
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

  if (isCheckedIn) {
    return (
      <button
        className={styles.checkedIn}
        disabled
      >
        Guest Checked In
      </button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={handleCheckIn}
        disabled={loading || isNotConfirmed}
      >
        {loading
          ? "Checking In..."
          : "Confirm Check-in"}
      </button>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}