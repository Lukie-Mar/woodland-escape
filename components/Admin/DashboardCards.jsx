import {
  CalendarDays,
  CheckCircle,
  LogIn,
  LogOut,
  Wallet,
  CreditCard,
} from "lucide-react";

import styles from "./DashboardCards.module.css";

export default function DashboardCards({
  reservations,
  payments,
}) {
  const totalReservations =
    reservations.length;

  const confirmedReservations =
    reservations.filter(
      (r) =>
        r.reservation_status ===
        "CONFIRMED"
    ).length;

  const pendingReservations =
    reservations.filter(
      (r) =>
        r.reservation_status ===
        "PENDING_PAYMENT"
    ).length;

  const checkedInReservations =
    reservations.filter(
      (r) =>
        r.reservation_status ===
        "CHECKED_IN"
    ).length;

  const checkedOutReservations =
    reservations.filter(
      (r) =>
        r.reservation_status ===
        "CHECKED_OUT"
    ).length;

  const totalRevenue =
    payments.reduce(
      (sum, payment) =>
        sum +
        Number(payment.amount || 0),
      0
    );

  const remainingBalance =
    reservations.reduce(
      (sum, reservation) => {
        if (
          reservation.payment_option ===
          "DOWN_PAYMENT"
        ) {
          return (
            sum +
            Number(
              reservation.remaining_balance ||
                0
            )
          );
        }

        return sum;
      },
      0
    );

  const cards = [
    {
      title: "Reservations",
      value: totalReservations,
      icon: CalendarDays,
      description: `${pendingReservations} pending payment`,
    },

    {
      title: "Confirmed",
      value: confirmedReservations,
      icon: CheckCircle,
      description: "Confirmed bookings",
    },

    {
      title: "Checked In",
      value: checkedInReservations,
      icon: LogIn,
      description: "Guests currently staying",
    },

    {
      title: "Checked Out",
      value: checkedOutReservations,
      icon: LogOut,
      description: "Completed stays",
    },

    {
      title: "Revenue",
      value: `₱${totalRevenue.toLocaleString(
        "en-PH"
      )}`,
      icon: Wallet,
      description: "Total payments received",
    },

    {
      title: "Balance Due",
      value: `₱${remainingBalance.toLocaleString(
        "en-PH"
      )}`,
      icon: CreditCard,
      description: "Outstanding balance",
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={styles.card}
          >
            <div className={styles.icon}>
              <Icon size={28} />
            </div>

            <div>
              <h3>{card.title}</h3>

              <h2>{card.value}</h2>

              <p>
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}