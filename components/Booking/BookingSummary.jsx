"use client";

import styles from "./Booking.module.css";

export default function BookingSummary({
  date,
  guests,
  total,
}) {
  const PACKAGE_PRICE = 15000;
  const INCLUDED_GUESTS = 18;
  const EXTRA_PERSON_RATE = 150;

  const extraGuests = Math.max(
    0,
    guests - INCLUDED_GUESTS
  );

  const extraCharge =
    extraGuests * EXTRA_PERSON_RATE;

  const checkOutDate = new Date(date);
  checkOutDate.setDate(checkOutDate.getDate() + 1);

  return (
    <div className={styles.summaryCard}>
      <h3>Booking Summary</h3>

      {/* Stay Details */}

      <div className={styles.summarySection}>
        <h4>🏨 Stay Details</h4>

        <div className={styles.summaryItem}>
          <span>Package</span>
          <strong>Overnight Package</strong>
        </div>

        <div className={styles.summaryItem}>
          <span>Check-in</span>

          <strong>
            {date.toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <br />
            <small>2:00 PM</small>
          </strong>
        </div>

        <div className={styles.summaryItem}>
          <span>Check-out</span>

          <strong>
            {checkOutDate.toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <br />
            <small>12:00 PM</small>
          </strong>
        </div>

        <div className={styles.summaryItem}>
          <span>Guests</span>

          <strong>{guests} Guests</strong>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Price Breakdown */}

      <div className={styles.summarySection}>
        <h4>💰 Price Breakdown</h4>

        <div className={styles.summaryItem}>
          <span>Base Package</span>

          <strong>
            ₱{PACKAGE_PRICE.toLocaleString()}
          </strong>
        </div>

        {extraGuests > 0 && (
          <div className={styles.summaryItem}>
            <span>
              Extra Guests ({extraGuests})
            </span>

            <strong>
              ₱{extraCharge.toLocaleString()}
            </strong>
          </div>
        )}
      </div>

      <hr className={styles.divider} />

      {/* Total */}

      <div className={styles.summaryTotal}>
        <span>Total Amount</span>

        <h2>
          ₱{(total ?? PACKAGE_PRICE).toLocaleString()}
        </h2>
      </div>

      <button className={styles.button}>
        Reserve Now
      </button>
    </div>
  );
}