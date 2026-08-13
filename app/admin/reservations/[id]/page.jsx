import Link from "next/link";
import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import ConfirmCheckIn from "./ConfirmCheckIn";
import CheckOutGuest from "./CheckOutGuest";
import RecordBalancePayment from "./RecordBalancePayment";
import CancelReservation from "./CancelReservation";

import styles from "./ReservationDetails.module.css";

function formatCurrency(amount) {
  return `₱${Number(amount || 0).toLocaleString("en-PH")}`;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-PH",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

function formatStatus(status) {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";

    case "PENDING_PAYMENT":
      return "Pending Payment";

    case "CHECKED_IN":
      return "Checked In";

    case "CHECKED_OUT":
      return "Checked Out";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status || "Unknown";
  }
}

export default async function ReservationDetails({
  params,
}) {
  const { id } = await params;

  const { data: reservation, error } =
    await supabaseAdmin
      .from("reservations")
      .select("*")
      .eq("id", id)
      .single();

  if (error || !reservation) {
    notFound();
  }

  const totalAmount = Number(
    reservation.total_amount || 0
  );

  const amountPaid = Number(
    reservation.amount_paid || 0
  );

  const remainingBalance =
    reservation.remaining_balance !== null &&
    reservation.remaining_balance !== undefined
      ? Number(reservation.remaining_balance)
      : Math.max(
          totalAmount - amountPaid,
          0
        );

  return (
    <div className={styles.container}>
      {/* =========================
          HEADER
      ========================= */}

      <div className={styles.header}>
        <Link
          href="/admin/reservations"
          className={styles.backButton}
        >
          ← Back to Reservations
        </Link>

        <div className={styles.titleRow}>
          <div>
            <p className={styles.label}>
              Reservation
            </p>

            <h1>
              {reservation.reservation_code}
            </h1>

            <p className={styles.created}>
              Created{" "}
              {reservation.created_at
                ? new Date(
                    reservation.created_at
                  ).toLocaleDateString(
                    "en-PH",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )
                : "—"}
            </p>
          </div>

          <span
            className={`${styles.status} ${
              reservation.reservation_status ===
              "CONFIRMED"
                ? styles.confirmed
                : reservation.reservation_status ===
                  "PENDING_PAYMENT"
                ? styles.pending
                : reservation.reservation_status ===
                  "CHECKED_IN"
                ? styles.confirmed
                : reservation.reservation_status ===
                  "CHECKED_OUT"
                ? styles.defaultStatus
                : reservation.reservation_status ===
                  "CANCELLED"
                ? styles.cancelled
                : styles.defaultStatus
            }`}
          >
            {formatStatus(
              reservation.reservation_status
            )}
          </span>
        </div>
      </div>

      {/* =========================
          INFORMATION
      ========================= */}

      <div className={styles.grid}>
        {/* Guest Information */}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Guest Information</h2>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span>Full Name</span>

              <strong>
                {reservation.full_name || "—"}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Contact Number</span>

              <strong>
                {reservation.contact_number ||
                  "—"}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Email</span>

              <strong>
                {reservation.email || "—"}
              </strong>
            </div>
          </div>
        </div>

        {/* Stay Information */}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Stay Information</h2>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span>Check-in</span>

              <strong>
                {formatDate(
                  reservation.check_in
                )}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Check-out</span>

              <strong>
                {formatDate(
                  reservation.check_out
                )}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Number of Guests</span>

              <strong>
                {reservation.guests ||
                  reservation.number_of_guests ||
                  0}
              </strong>
            </div>
          </div>
        </div>

        {/* Payment Information */}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Payment Information</h2>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span>Payment Option</span>

              <strong>
                {reservation.payment_option ||
                  "—"}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Total Amount</span>

              <strong>
                {formatCurrency(
                  totalAmount
                )}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Amount Paid</span>

              <strong className={styles.paid}>
                {formatCurrency(
                  amountPaid
                )}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Remaining Balance</span>

              <strong className={styles.balance}>
                {formatCurrency(
                  remainingBalance
                )}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Payment Status</span>

              <strong>
                {reservation.payment_status ||
                  "—"}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Payment Method</span>

              <strong>
                {reservation.payment_method ||
                  "—"}
              </strong>
            </div>
          </div>
        </div>

        {/* PayMongo Information */}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Payment Reference</h2>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span>PayMongo Payment ID</span>

              <strong className={styles.reference}>
                {reservation.paymongo_payment_id ||
                  "—"}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>PayMongo Reference</span>

              <strong className={styles.reference}>
                {reservation.paymongo_reference ||
                  "—"}
              </strong>
            </div>

            <div className={styles.detail}>
              <span>Checkout ID</span>

              <strong className={styles.reference}>
                {reservation.paymongo_checkout_id ||
                  "—"}
              </strong>
            </div>
          </div>
        </div>

        {/* Special Requests */}

        <div
          className={`${styles.card} ${styles.fullWidth}`}
        >
          <div className={styles.cardHeader}>
            <h2>Special Requests</h2>
          </div>

          <div className={styles.requests}>
            {reservation.special_requests ? (
              <p>
                {reservation.special_requests}
              </p>
            ) : (
              <p className={styles.noRequests}>
                No special requests provided.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <div className={styles.actions}>
        <ConfirmCheckIn
          reservationId={reservation.id}
          reservationStatus={
            reservation.reservation_status
          }
        />

        <RecordBalancePayment
          reservationId={reservation.id}
          remainingBalance={remainingBalance}
        />

        <CheckOutGuest
          reservationId={reservation.id}
          reservationStatus={
            reservation.reservation_status
          }
        />

        <CancelReservation
          reservationId={reservation.id}
          reservationStatus={
            reservation.reservation_status
          }
        />
      </div>
    </div>
  );
}