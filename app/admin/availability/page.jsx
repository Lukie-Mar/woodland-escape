import { supabaseAdmin } from "@/lib/supabaseAdmin";
import AvailabilityCalendar from "./AvailabilityCalendar";
import styles from "./Availability.module.css";

export default async function AvailabilityPage() {
  const [
    reservationsResult,
    overridesResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("reservations")
      .select("*")
      .order("check_in", {
        ascending: true,
      }),

    supabaseAdmin
      .from("availability_overrides")
      .select("*")
      .order("date", {
        ascending: true,
      }),
  ]);

  const {
    data: reservations = [],
    error: reservationsError,
  } = reservationsResult;

  const {
    data: overrides = [],
    error: overridesError,
  } = overridesResult;

  if (reservationsError || overridesError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>
            Unable to load availability
          </h2>

          <p>
            {reservationsError?.message ||
              overridesError?.message ||
              "Unable to load availability data."}
          </p>
        </div>
      </div>
    );
  }

  const activeReservations =
    reservations.filter(
      (reservation) =>
        [
          "PENDING_PAYMENT",
          "CONFIRMED",
          "CHECKED_IN",
        ].includes(
          reservation.reservation_status
        )
    );

  const unavailableOverrides =
    overrides.filter(
      (override) =>
        override.status === "UNAVAILABLE"
    );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Availability</h1>

          <p>
            View and manage resort availability.
          </p>

          <div className={styles.summaryCard}>
            <div
              className={styles.summaryNumber}
            >
              {activeReservations.length}
            </div>

            <div
              className={styles.summaryLabel}
            >
              Active Reservations
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div
              className={styles.summaryNumber}
            >
              {unavailableOverrides.length}
            </div>

            <div
              className={styles.summaryLabel}
            >
              Manual Blocks
            </div>
          </div>
        </div>
      </div>

      <AvailabilityCalendar
        reservations={reservations}
        overrides={overrides}
      />
    </div>
  );
}