import { supabaseAdmin } from "@/lib/supabaseAdmin";

import styles from "./Reports.module.css";

function formatCurrency(amount) {
  return `₱${Number(amount || 0).toLocaleString()}`;
}

function formatMonth(date) {
  return new Date(`${date}-01T00:00:00`).toLocaleDateString(
    "en-PH",
    {
      month: "long",
      year: "numeric",
    }
  );
}

export default async function ReportsPage() {
  const [
    { data: reservations = [], error: reservationError },
    { data: payments = [], error: paymentError },
  ] = await Promise.all([
    supabaseAdmin
      .from("reservations")
      .select("*")
      .order("created_at", {
        ascending: true,
      }),

    supabaseAdmin
      .from("payments")
      .select("*")
      .order("created_at", {
        ascending: true,
      }),
  ]);

  if (reservationError || paymentError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Unable to load reports</h2>

          <p>
            {reservationError?.message ||
              paymentError?.message}
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==========================
   * PAYMENT CALCULATIONS
   * ==========================
   */

  const paidPayments = payments.filter(
    (payment) =>
      payment.payment_status?.toUpperCase() === "PAID"
  );

  const downPayments = paidPayments.filter(
    (payment) =>
      payment.payment_type === "DOWN_PAYMENT"
  );

  const balancePayments = paidPayments.filter(
    (payment) =>
      payment.payment_type === "BALANCE"
  );

  const totalRevenue = paidPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const totalDownPayments = downPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const totalBalancePayments =
    balancePayments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

  /*
   * ==========================
   * OUTSTANDING BALANCE
   * ==========================
   */

  const outstandingBalance =
    reservations.reduce(
      (sum, reservation) =>
        sum +
        Number(
          reservation.remaining_balance || 0
        ),
      0
    );

  /*
   * ==========================
   * RESERVATION STATUS
   * ==========================
   */

  const confirmedReservations =
    reservations.filter(
      (reservation) =>
        reservation.reservation_status ===
        "CONFIRMED"
    ).length;

  const pendingReservations =
    reservations.filter(
      (reservation) =>
        reservation.reservation_status ===
        "PENDING_PAYMENT"
    ).length;

  const checkedInReservations =
    reservations.filter(
      (reservation) =>
        reservation.reservation_status ===
        "CHECKED_IN"
    ).length;

  const checkedOutReservations =
    reservations.filter(
      (reservation) =>
        reservation.reservation_status ===
        "CHECKED_OUT"
    ).length;

  const cancelledReservations =
    reservations.filter(
      (reservation) =>
        reservation.reservation_status ===
        "CANCELLED"
    ).length;

  /*
   * ==========================
   * PAYMENT METHODS
   * ==========================
   */

  const cashPayments = paidPayments.filter(
    (payment) =>
      payment.payment_method?.toUpperCase() ===
      "CASH"
  );

  const paymongoPayments = paidPayments.filter(
    (payment) =>
      payment.payment_method?.toUpperCase() ===
      "PAYMONGO"
  );

  const totalCash = cashPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  const totalPayMongo = paymongoPayments.reduce(
    (sum, payment) =>
      sum + Number(payment.amount || 0),
    0
  );

  /*
   * ==========================
   * MONTHLY REPORT
   * ==========================
   */

  const monthlyData = {};

  reservations.forEach((reservation) => {
    if (!reservation.created_at) return;

    const date = new Date(
      reservation.created_at
    );

    const month = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData[month]) {
      monthlyData[month] = {
        reservations: 0,
        revenue: 0,
      };
    }

    monthlyData[month].reservations += 1;
  });

  paidPayments.forEach((payment) => {
    if (!payment.created_at) return;

    const date = new Date(payment.created_at);

    const month = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData[month]) {
      monthlyData[month] = {
        reservations: 0,
        revenue: 0,
      };
    }

    monthlyData[month].revenue += Number(
      payment.amount || 0
    );
  });

  const monthlyReports = Object.entries(
    monthlyData
  )
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .reverse();

  return (
    <div className={styles.container}>

      {/* Header */}

      <div className={styles.header}>
        <div>
          <h1>Reports</h1>

          <p>
            View Woodland Escape business
            performance and payment reports
          </p>
        </div>
      </div>

      {/* Main Statistics */}

      <div className={styles.statsGrid}>

        <div className={styles.statCard}>
          <span>Total Revenue</span>

          <strong>
            {formatCurrency(totalRevenue)}
          </strong>

          <small>
            All successfully paid transactions
          </small>
        </div>

        <div className={styles.statCard}>
          <span>Total Reservations</span>

          <strong>
            {reservations.length}
          </strong>

          <small>
            All reservation records
          </small>
        </div>

        <div className={styles.statCard}>
          <span>Outstanding Balance</span>

          <strong>
            {formatCurrency(
              outstandingBalance
            )}
          </strong>

          <small>
            Remaining customer balances
          </small>
        </div>

        <div className={styles.statCard}>
          <span>Down Payments</span>

          <strong>
            {formatCurrency(
              totalDownPayments
            )}
          </strong>

          <small>
            Successfully collected
          </small>
        </div>

      </div>

      {/* Payment Breakdown */}

      <div className={styles.gridTwo}>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Payment Breakdown</h2>

            <p>
              Revenue by payment type
            </p>
          </div>

          <div className={styles.breakdown}>

            <div className={styles.row}>
              <span>Down Payments</span>

              <strong>
                {formatCurrency(
                  totalDownPayments
                )}
              </strong>
            </div>

            <div className={styles.row}>
              <span>Balance Payments</span>

              <strong>
                {formatCurrency(
                  totalBalancePayments
                )}
              </strong>
            </div>

            <div
              className={`${styles.row} ${styles.totalRow}`}
            >
              <span>Total Collected</span>

              <strong>
                {formatCurrency(totalRevenue)}
              </strong>
            </div>

          </div>
        </div>

        {/* Payment Methods */}

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Payment Methods</h2>

            <p>
              Revenue by payment method
            </p>
          </div>

          <div className={styles.breakdown}>

            <div className={styles.row}>
              <span>Cash</span>

              <strong>
                {formatCurrency(totalCash)}
              </strong>
            </div>

            <div className={styles.row}>
              <span>PayMongo</span>

              <strong>
                {formatCurrency(
                  totalPayMongo
                )}
              </strong>
            </div>

            <div
              className={`${styles.row} ${styles.totalRow}`}
            >
              <span>Total</span>

              <strong>
                {formatCurrency(totalRevenue)}
              </strong>
            </div>

          </div>
        </div>

      </div>

      {/* Reservation Status */}

      <div className={styles.card}>

        <div className={styles.cardHeader}>
          <h2>Reservation Status</h2>

          <p>
            Current reservation distribution
          </p>
        </div>

        <div className={styles.statusGrid}>

          <div>
            <strong>
              {confirmedReservations}
            </strong>

            <span>Confirmed</span>
          </div>

          <div>
            <strong>
              {pendingReservations}
            </strong>

            <span>Pending Payment</span>
          </div>

          <div>
            <strong>
              {checkedInReservations}
            </strong>

            <span>Checked In</span>
          </div>

          <div>
            <strong>
              {checkedOutReservations}
            </strong>

            <span>Checked Out</span>
          </div>

          <div>
            <strong>
              {cancelledReservations}
            </strong>

            <span>Cancelled</span>
          </div>

        </div>

      </div>

      {/* Monthly Report */}

      <div className={styles.card}>

        <div className={styles.cardHeader}>
          <h2>Monthly Report</h2>

          <p>
            Reservations and collected revenue
          </p>
        </div>

        {monthlyReports.length === 0 ? (
          <div className={styles.empty}>
            No report data available yet.
          </div>
        ) : (
          <div className={styles.monthTableWrapper}>

            <table className={styles.monthTable}>

              <thead>
                <tr>
                  <th>Month</th>
                  <th>Reservations</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>
                {monthlyReports.map(
                  ([month, data]) => (
                    <tr key={month}>

                      <td>
                        <strong>
                          {formatMonth(month)}
                        </strong>
                      </td>

                      <td>
                        {data.reservations}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            data.revenue
                          )}
                        </strong>
                      </td>

                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}