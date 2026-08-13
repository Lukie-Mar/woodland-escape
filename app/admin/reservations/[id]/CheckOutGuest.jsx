"use client";

import { useState } from "react";

import styles from "./CheckOutGuest.module.css";

export default function CheckOutGuest({
  reservationId,
  reservationStatus,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCheckedOut =
    reservationStatus === "CHECKED_OUT";

  const isNotCheckedIn =
    reservationStatus !== "CHECKED_IN";

  async function handleCheckOut() {
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to check out this guest?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/reservations/check-out",
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
            "Unable to check out guest."
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

  if (isCheckedOut) {
    return (
      <button
        className={styles.checkedOut}
        disabled
      >
        Guest Checked Out
      </button>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={handleCheckOut}
        disabled={
          loading || isNotCheckedIn
        }
      >
        {loading
          ? "Checking Out..."
          : "Check-out Guest"}
      </button>

      {error && (
        <p className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}