import { supabaseAdmin } from "@/lib/supabaseAdmin";

import styles from "./Payments.module.css";

function formatCurrency(amount) {
  return `₱${Number(amount || 0).toLocaleString()}`;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPaymentType(type) {
  switch (type) {
    case "DOWN_PAYMENT":
      return "Down Payment";

    case "BALANCE":
      return "Balance Payment";

    case "FULL_PAYMENT":
      return "Full Payment";

    default:
      return type || "—";
  }
}

function formatPaymentMethod(method) {
  switch (method?.toUpperCase()) {
    case "PAYMONGO":
      return "PayMongo";

    case "CASH":
      return "Cash";

    case "GCASH":
      return "GCash";

    case "CARD":
      return "Card";

    default:
      return method || "—";
  }
}

function formatStatus(status) {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "Paid";

    case "PENDING":
      return "Pending";

    case "FAILED":
      return "Failed";

    case "REFUNDED":
      return "Refunded";

    default:
      return status || "Unknown";
  }
}

function getStatusClass(status) {
  switch (status?.toUpperCase()) {
    case "PAID":
      return styles.paid;

    case "PENDING":
      return styles.pending;

    case "FAILED":
      return styles.failed;

    case "REFUNDED":
      return styles.refunded;

    default:
      return styles.defaultStatus;
  }
}

export default async function PaymentsPage() {
  const { data: payments = [], error } =
    await supabaseAdmin
      .from("payments")
      .select(`
        *,
        reservations (
          reservation_code,
          full_name,
          email
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Unable to load payments</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  const paidPayments = payments.filter(
    (payment) =>
      payment.payment_status?.toUpperCase() === "PAID"
  );

  const pendingPayments = payments.filter(
    (payment) =>
      payment.payment_status?.toUpperCase() === "PENDING"
  );

  const totalCollected = paidPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const pendingAmount = pendingPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  return (
    <div className={styles.container}>

      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Payments</h1>

          <p>
            Monitor and manage Woodland Escape
            payment transactions
          </p>
        </div>
      </div>

      {/* Summary */}

      <div className={styles.summaryGrid}>

        <div className={styles.summaryCard}>
          <span className={styles.summaryTitle}>
            Total Payments
          </span>

          <strong>
            {payments.length}
          </strong>

          <span className={styles.summaryDescription}>
            All payment records
          </span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryTitle}>
            Collected
          </span>

          <strong>
            {formatCurrency(totalCollected)}
          </strong>

          <span className={styles.summaryDescription}>
            Successfully paid
          </span>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryTitle}>
            Pending
          </span>

          <strong>
            {formatCurrency(pendingAmount)}
          </strong>

          <span className={styles.summaryDescription}>
            Awaiting payment
          </span>
        </div>

      </div>

      {/* Payment Table */}

      <div className={styles.tableCard}>

        <div className={styles.tableHeader}>
          <div>
            <h2>Payment Records</h2>

            <p>
              View all recorded transactions
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className={styles.empty}>
            <h3>No payments yet</h3>

            <p>
              Payment transactions will appear
              here when a payment is recorded.
            </p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>

            <table className={styles.table}>

              <thead>
                <tr>
                  <th>Reservation</th>
                  <th>Guest</th>
                  <th>Payment Type</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>PayMongo ID</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => {
                  const reservation =
                    payment.reservations;

                  return (
                    <tr key={payment.id}>

                      {/* Reservation */}

                      <td>
                        <strong
                          className={
                            styles.reservationCode
                          }
                        >
                          {reservation
                            ?.reservation_code ||
                            `Reservation #${payment.reservation_id}`}
                        </strong>
                      </td>

                      {/* Guest */}

                      <td>
                        <div
                          className={
                            styles.guest
                          }
                        >
                          <strong>
                            {reservation
                              ?.full_name ||
                              "—"}
                          </strong>

                          {reservation?.email && (
                            <span>
                              {reservation.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment Type */}

                      <td>
                        <span
                          className={
                            payment.payment_type ===
                            "DOWN_PAYMENT"
                              ? styles.downPayment
                              : styles.balancePayment
                          }
                        >
                          {formatPaymentType(
                            payment.payment_type
                          )}
                        </span>
                      </td>

                      {/* Amount */}

                      <td>
                        <strong>
                          {formatCurrency(
                            payment.amount
                          )}
                        </strong>
                      </td>

                      {/* Method */}

                      <td>
                        {formatPaymentMethod(
                          payment.payment_method
                        )}
                      </td>

                      {/* Status */}

                      <td>
                        <span
                          className={`${styles.status} ${getStatusClass(
                            payment.payment_status
                          )}`}
                        >
                          {formatStatus(
                            payment.payment_status
                          )}
                        </span>
                      </td>

                      {/* PayMongo */}

                      <td>
                        {payment.paymongo_payment_id ? (
                          <span
                            className={
                              styles.paymongoId
                            }
                          >
                            {payment.paymongo_payment_id}
                          </span>
                        ) : (
                          <span
                            className={
                              styles.notAvailable
                            }
                          >
                            —
                          </span>
                        )}
                      </td>

                      {/* Date */}

                      <td>
                        {formatDate(
                          payment.created_at
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}