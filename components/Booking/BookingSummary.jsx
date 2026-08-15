"use client";

import styles from "./Booking.module.css";

export default function BookingSummary({
  date,
  guests,
  total,
  amountToPay,
  remainingBalance,
  paymentOption,
  onReserve,
  loading,
  packagePrice,
  includedGuests,
  extraPersonRate,
}) {
  const extraGuests = Math.max(
    0,
    guests - includedGuests
  );

  const extraCharge =
    extraGuests * extraPersonRate;

  const checkOutDate = new Date(date);

  checkOutDate.setDate(
    checkOutDate.getDate() + 1
  );

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
            ₱{Number(packagePrice || 0).toLocaleString()}
          </strong>
        </div>

        {extraGuests > 0 && (
          <div className={styles.summaryItem}>
            <span>
              Extra Guests ({extraGuests})
            </span>

            <strong>
              ₱{Number(extraCharge || 0).toLocaleString()}
            </strong>
          </div>
        )}
      </div>

      <hr className={styles.divider} />

      {/* Payment */}

      <div className={styles.summarySection}>
        <h4>💳 Payment</h4>

        <div className={styles.summaryItem}>
          <span>Payment Option</span>

          <strong>
            {paymentOption === "FULL_PAYMENT"
              ? "Full Payment"
              : "Down Payment"}
          </strong>
        </div>

        <div className={styles.summaryItem}>
          <span>Pay Today</span>

          <strong>
            ₱{Number(amountToPay || 0).toLocaleString()}
          </strong>
        </div>

        <div className={styles.summaryItem}>
          <span>Remaining Balance</span>

          <strong>
            ₱{Number(remainingBalance || 0).toLocaleString()}
          </strong>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Total */}

      <div className={styles.summaryTotal}>
        <span>Total Reservation</span>

        <h2>
          ₱{Number(total || 0).toLocaleString()}
        </h2>
      </div>

      <button
        className={styles.button}
        onClick={onReserve}
        disabled={loading}
      >
        {loading
          ? "Redirecting..."
          : `Proceed to Pay ₱${Number(
              amountToPay || 0
            ).toLocaleString()}`}
      </button>
    </div>
  );
}