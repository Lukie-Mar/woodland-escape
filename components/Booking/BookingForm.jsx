"use client";

import styles from "./Booking.module.css";

export default function BookingForm({
  date,
  guests,
  onClose,
  onSubmit,
}) {
  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    onSubmit({
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      notes: formData.get("notes"),
      date,
      guests,
    });
  }

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        <h2>Reservation Information</h2>

        <p>
          Complete the form below to request your reservation.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Contact Number"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email (Optional)"
          />

          <textarea
            name="notes"
            placeholder="Special Requests (Optional)"
            rows={4}
          />

          <div className={styles.summary}>

            <p>
              <strong>Check-in:</strong> {date}
            </p>

            <p>
              <strong>Guests:</strong> {guests}
            </p>

            <p>
              <strong>Package:</strong> ₱15,000
            </p>

          </div>

          <div className={styles.actions}>

            <button
              type="button"
              onClick={onClose}
              className={styles.cancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.button}
            >
              Submit Reservation
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}