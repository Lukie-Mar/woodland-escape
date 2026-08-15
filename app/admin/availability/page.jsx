import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AvailabilityCalendar from "./AvailabilityCalendar";

import styles from "./Availability.module.css";

export default async function AvailabilityPage() {
  const { data: reservations = [], error } =
    await supabaseAdmin
      .from("reservations")
      .select("*")
      .order("check_in", { ascending: true });

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Unable to load availability</h2>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  /*
   * Active reservations are reservations that
   * currently occupy or hold a resort date.
   *
   * Cancelled and checked-out reservations
   * are not counted as active.
   */
  const activeReservations = reservations.filter(
    (reservation) =>
      [
        "PENDING_PAYMENT",
        "CONFIRMED",
        "CHECKED_IN",
      ].includes(reservation.reservation_status)
  );

  return (
    <div className={styles.container}>

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className={styles.header}>

        <div className={styles.headerContent}>

          <h1>Availability</h1>

          <p>
            View booked dates and resort availability
          </p>

          {/* Active Reservations */}

          <div className={styles.summaryCard}>

            <div className={styles.summaryNumber}>
              {activeReservations.length}
            </div>

            <div className={styles.summaryLabel}>
              Active Reservations
            </div>

          </div>

        </div>

      </div>

      {/* =========================
          AVAILABILITY CALENDAR
      ========================= */}

      <AvailabilityCalendar
        reservations={reservations}
      />

    </div>
  );
}