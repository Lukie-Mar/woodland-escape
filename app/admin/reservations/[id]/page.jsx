import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

import styles from "./ReservationDetails.module.css";

export default async function ReservationDetails({ params }) {
  const { id } = await params;

  const { data: reservation } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .eq("id", id)
    .single();

  if (!reservation) {
    notFound();
  }

  const remaining =
    (reservation.total_amount || 0) -
    (reservation.amount_paid || 0);

  return (
    <div className={styles.container}>
      <h1>{reservation.reservation_code}</h1>

      <div className={styles.grid}>

        <div className={styles.card}>
          <h2>Guest Information</h2>

          <p><strong>Name:</strong> {reservation.full_name}</p>
          <p><strong>Email:</strong> {reservation.email}</p>
          <p><strong>Phone:</strong> {reservation.phone}</p>
        </div>

        <div className={styles.card}>
          <h2>Reservation</h2>

          <p><strong>Check-in:</strong> {reservation.check_in}</p>
          <p><strong>Check-out:</strong> {reservation.check_out}</p>
          <p><strong>Guests:</strong> {reservation.number_of_guests}</p>
        </div>

        <div className={styles.card}>
          <h2>Payment</h2>

          <p>
            <strong>Total:</strong>
            {" "}
            ₱{reservation.total_amount?.toLocaleString("en-PH")}
          </p>

          <p>
            <strong>Paid:</strong>
            {" "}
            ₱{reservation.amount_paid?.toLocaleString("en-PH")}
          </p>

          <p>
            <strong>Remaining:</strong>
            {" "}
            ₱{remaining.toLocaleString("en-PH")}
          </p>

          <p>
            <strong>Method:</strong>
            {" "}
            {reservation.payment_option}
          </p>
        </div>

      </div>

      <div className={styles.actions}>

        <button className={styles.green}>
          Confirm Check-in
        </button>

        <button className={styles.blue}>
          Record Balance Payment
        </button>

        <button className={styles.orange}>
          Check-out Guest
        </button>

        <button className={styles.red}>
          Cancel Reservation
        </button>

      </div>
    </div>
  );
}