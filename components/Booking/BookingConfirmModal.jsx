"use client";

import styles from "./Booking.module.css";

export default function BookingConfirmModal({
  open,
  onClose,
  onConfirm,
  bookingData,
}) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>

        <h2>Confirm Reservation</h2>

        <p className={styles.modalSubtitle}>
          Please review your reservation before submitting.
        </p>

        <div className={styles.modalContent}>

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

          <hr className={styles.divider} />

          <div className={styles.summaryTotal}>
            <span>Total Amount</span>

            <h2>
              ₱{bookingData.total.toLocaleString()}
            </h2>
          </div>

        </div>

        <div className={styles.modalButtons}>

          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            Confirm Reservation
          </button>

        </div>

      </div>
    </div>
  );
}