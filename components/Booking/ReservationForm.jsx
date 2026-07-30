"use client";

import styles from "./Booking.module.css";

export default function ReservationForm({
  guests,
  setGuests,
  maxGuests = 50,
  includedGuests = 18,
  extraPersonRate = 150,
}) {
  return (
    <div className={styles.formCard}>
      <h3>Guest Information</h3>

      <div className={styles.formGroup}>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Contact Number</label>
        <input
          type="tel"
          placeholder="09XXXXXXXXX"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Optional"
        />
      </div>

      {/* Number of Guests */}

      <div className={styles.formGroup}>
        <label>Number of Guests</label>

        <input
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(e) => {
            let value = Number(e.target.value);

            if (isNaN(value)) value = 1;
            if (value < 1) value = 1;
            if (value > maxGuests) value = maxGuests;

            setGuests(value);
          }}
          placeholder="Enter number of guests"
        />

        <small>
          Package includes <strong>{includedGuests}</strong> guests.
          <br />
          Extra guests are charged <strong>₱{extraPersonRate}</strong> each.
        </small>
      </div>

      <div className={styles.formGroup}>
        <label>Special Requests</label>

        <textarea
          rows={5}
          placeholder="Optional"
        />
      </div>
    </div>
  );
}