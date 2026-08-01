"use client";

import styles from "./Booking.module.css";

export default function BookingConfirmModal({
  open,
  onClose,
  onConfirm,
  bookingData,
  loading,
}) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>

        <h2>Confirm Reservation</h2>

        <p className={styles.modalSubtitle}>
          Please review your reservation before proceeding to secure payment.
        </p>

        <div className={styles.modalContent}>

          {/* Guest Information */}

          <div className={styles.summarySection}>
            <h4>👤 Guest Information</h4>

            <div className={styles.summaryItem}>
              <span>Guest</span>
              <strong>{bookingData.fullName}</strong>
            </div>

            <div className={styles.summaryItem}>
              <span>Contact</span>
              <strong>{bookingData.contact}</strong>
            </div>

            {bookingData.email && (
              <div className={styles.summaryItem}>
                <span>Email</span>
                <strong>{bookingData.email}</strong>
              </div>
            )}
          </div>

          <hr className={styles.divider} />

          {/* Stay Information */}

          <div className={styles.summarySection}>
            <h4>🏨 Stay Details</h4>

            <div className={styles.summaryItem}>
              <span>Package</span>
              <strong>Overnight Package</strong>
            </div>

            <div className={styles.summaryItem}>
              <span>Check-in</span>

              <strong>
                {bookingData.checkInDate}
                <br />
                <small>2:00 PM</small>
              </strong>
            </div>

            <div className={styles.summaryItem}>
              <span>Check-out</span>

              <strong>
                {bookingData.checkOutDate}
                <br />
                <small>12:00 PM</small>
              </strong>
            </div>

            <div className={styles.summaryItem}>
              <span>Guests</span>
              <strong>{bookingData.guests}</strong>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* Payment */}

          <div className={styles.summarySection}>
            <h4>💳 Payment Details</h4>

            <div className={styles.summaryItem}>
              <span>Payment Option</span>

              <strong>
                {bookingData.paymentOption ===
                "FULL_PAYMENT"
                  ? "Full Payment"
                  : "Down Payment"}
              </strong>
            </div>

            <div className={styles.summaryItem}>
              <span>Total Reservation</span>

              <strong>
                ₱{bookingData.total.toLocaleString()}
              </strong>
            </div>

            <div className={styles.summaryItem}>
              <span>Pay Today</span>

              <strong>
                ₱{bookingData.amountToPay.toLocaleString()}
              </strong>
            </div>

            <div className={styles.summaryItem}>
              <span>Remaining Balance</span>

              <strong>
                ₱{bookingData.remainingBalance.toLocaleString()}
              </strong>
            </div>
          </div>

          {bookingData.specialRequest && (
            <>
              <hr className={styles.divider} />

              <div className={styles.summarySection}>
                <h4>📝 Special Request</h4>

                <p>{bookingData.specialRequest}</p>
              </div>
            </>
          )}

        </div>

        <div className={styles.modalButtons}>

          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Redirecting..."
              : `Proceed to Pay ₱${bookingData.amountToPay.toLocaleString()}`}
          </button>

        </div>

      </div>
    </div>
  );
}