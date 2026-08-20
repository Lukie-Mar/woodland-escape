import {
  CalendarDays,
  CheckCircle,
  LogIn,
  LogOut,
  Wallet,
  CreditCard,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

import styles from "./DashboardCards.module.css";

export default function DashboardCards({
  reservations = [],
  payments = [],
}) {
  // -----------------------------
  // Reservation Statistics
  // -----------------------------

  const totalReservations =
    reservations.length;

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

  // -----------------------------
  // Payment Statistics
  // -----------------------------

  const totalRevenue =
    payments.reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
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
              reservation.remaining_balance || 0
            )
          );
        }

        return sum;
      },
      0
    );

  // -----------------------------
  // Dashboard Cards
  // -----------------------------

  const cards = [
    {
      title: "Reservations",
      value: totalReservations,
      icon: CalendarDays,
      color: "#2f855a",
    },

    {
      title: "Confirmed",
      value: confirmedReservations,
      icon: CheckCircle,
      color: "#3182ce",
    },

    {
      title: "Checked In",
      value: checkedInReservations,
      icon: LogIn,
      color: "#805ad5",
    },

    {
      title: "Checked Out",
      value: checkedOutReservations,
      icon: LogOut,
      color: "#718096",
    },

    {
      title: "Revenue",
      value: `₱${totalRevenue.toLocaleString(
        "en-PH"
      )}`,
      icon: Wallet,
      color: "#d69e2e",
    },

    {
      title: "Balance Due",
      value: `₱${remainingBalance.toLocaleString(
        "en-PH"
      )}`,
      icon: CreditCard,
      color: "#dd6b20",
    },
  ];

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </div>
  );
}