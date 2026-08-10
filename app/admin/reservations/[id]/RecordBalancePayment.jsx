"use client";

import { useState } from "react";

import styles from "./RecordBalancePayment.module.css";

export default function RecordBalancePayment({
  reservationId,
  remainingBalance,
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(
    String(remainingBalance || "")
  );
  const [paymentMethod, setPaymentMethod] =
    useState("CASH");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      setError(
        "Please enter a valid payment amount."
      );
      return;
    }

    if (paymentAmount > Number(remainingBalance)) {
      setError(
        `Payment cannot exceed the remaining balance of ₱${Number(
          remainingBalance
        ).toLocaleString("en-PH")}.`
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/payments/balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId,
            amount: paymentAmount,
            paymentMethod,
            notes,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to record payment."
        );
      }

      // Refresh the server-rendered reservation details.
      window.location.reload();
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong."
      );

      setLoading(false);
    }
  }

  if (Number(remainingBalance) <= 0) {
    return (
      <button
        className={styles.disabledButton}
        disabled
      >
        Balance Fully Paid
      </button>
    );
  }

  return (
    <>
      <button
        className={styles.button}
        onClick={() => {
          setError("");
          setAmount(
            String(remainingBalance)
          );
          setOpen(true);
        }}
      >
        Record Balance Payment
      </button>

      {open && (
        <div
          className={styles.overlay}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !loading
            ) {
              setOpen(false);
            }
          }}
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.label}>
                  Payment
                </p>

                <h2>
                  Record Balance Payment
                </h2>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={() =>
                  !loading && setOpen(false)
                }
                disabled={loading}
              >
                ×
              </button>
            </div>

            <div className={styles.balanceBox}>
              <span>
                Remaining Balance
              </span>

              <strong>
                ₱
                {Number(
                  remainingBalance
                ).toLocaleString("en-PH")}
              </strong>
            </div>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div className={styles.field}>
                <label htmlFor="paymentAmount">
                  Payment Amount
                </label>

                <input
                  id="paymentAmount"
                  type="number"
                  min="1"
                  max={remainingBalance}
                  step="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="paymentMethod">
                  Payment Method
                </label>

                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                  disabled={loading}
                >
                  <option value="CASH">
                    Cash
                  </option>

                  <option value="GCASH">
                    GCash
                  </option>

                  <option value="BANK_TRANSFER">
                    Bank Transfer
                  </option>

                  <option value="CARD">
                    Card
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="paymentNotes">
                  Notes
                </label>

                <textarea
                  id="paymentNotes"
                  value={notes}
                  onChange={(event) =>
                    setNotes(
                      event.target.value
                    )
                  }
                  placeholder="Optional payment notes..."
                  rows={3}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancel}
                  onClick={() =>
                    setOpen(false)
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading
                    ? "Recording..."
                    : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}