"use client";

import styles from "./Booking.module.css";

const DOWN_PAYMENT = 5000;

export default function ReservationForm({
  bookingData,
  setBookingData,
  guests,
  setGuests,
  maxGuests = 50,
  includedGuests = 18,
  extraPersonRate = 150,
}) {
  function handleChange(e) {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleGuestChange(e) {
    let value = Number(e.target.value);

    if (isNaN(value)) value = includedGuests;
    if (value < includedGuests) value = includedGuests;
    if (value > maxGuests) value = maxGuests;

    setGuests(value);
  }

  return (
    <div className={styles.formCard}>
      <h3>Guest Information</h3>

      {/* Full Name */}

      <div className={styles.formGroup}>
        <label>Full Name</label>

        <input
          type="text"
          name="fullName"
          value={bookingData.fullName}
          onChange={handleChange}
          placeholder="Juan Dela Cruz"
        />
      </div>

      {/* Contact */}

      <div className={styles.formGroup}>
        <label>Contact Number</label>

        <input
          type="tel"
          name="contact"
          value={bookingData.contact}
          onChange={handleChange}
          placeholder="09XXXXXXXXX"
        />
      </div>

      {/* Email */}

      <div className={styles.formGroup}>
        <label>Email Address (Optional)</label>

        <input
          type="email"
          name="email"
          value={bookingData.email}
          onChange={handleChange}
          placeholder="example@email.com"
        />
      </div>

      {/* Guests */}

      <div className={styles.formGroup}>
        <label>Number of Guests</label>

        <input
          type="number"
          value={guests}
          min={includedGuests}
          max={maxGuests}
          onChange={handleGuestChange}
        />

        <small>
          Package includes up to{" "}
          <strong>{includedGuests}</strong> guests.
          <br />
          Additional guests are charged{" "}
          <strong>₱{extraPersonRate}</strong> each.
        </small>
      </div>

      {/* Payment Option */}

      <div className={styles.formGroup}>
        <label>Payment Option</label>

        <label className={styles.radioOption}>
          <input
            type="radio"
            name="paymentOption"
            value="DOWN_PAYMENT"
            checked={
              bookingData.paymentOption ===
              "DOWN_PAYMENT"
            }
            onChange={handleChange}
          />

          <span>
            <strong>Down Payment</strong>
            <br />
            Pay only <strong>₱{DOWN_PAYMENT.toLocaleString()}</strong> today
            and settle the remaining balance upon check-in.
          </span>
        </label>

        <label className={styles.radioOption}>
          <input
            type="radio"
            name="paymentOption"
            value="FULL_PAYMENT"
            checked={
              bookingData.paymentOption ===
              "FULL_PAYMENT"
            }
            onChange={handleChange}
          />

          <span>
            <strong>Full Payment</strong>
            <br />
            Pay the full reservation amount online.
          </span>
        </label>
      </div>

      {/* Special Request */}

      <div className={styles.formGroup}>
        <label>Special Requests (Optional)</label>

        <textarea
          rows={5}
          name="specialRequest"
          value={bookingData.specialRequest}
          onChange={handleChange}
          placeholder="Tell us anything you'd like us to prepare..."
        />
      </div>
    </div>
  );
}