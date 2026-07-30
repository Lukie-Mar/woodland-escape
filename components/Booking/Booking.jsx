"use client";

import { useState } from "react";

import styles from "./Booking.module.css";

import CalendarPanel from "./CalendarPanel";
import ReservationForm from "./ReservationForm";
import BookingSummary from "./BookingSummary";

const PACKAGE_PRICE = 15000;
const INCLUDED_GUESTS = 18;
const EXTRA_PERSON_RATE = 150;
const MAX_GUESTS = 50;

const bookedDates = [
  "2026-08-15",
  "2026-08-22",
  "2026-09-05",
];

export default function Booking() {
  const [date, setDate] = useState(new Date());
  const [guests, setGuests] = useState(18);

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function isBooked(date) {
    return bookedDates.includes(formatDate(date));
  }

  // Calculate pricing
  const extraGuests = Math.max(0, guests - INCLUDED_GUESTS);

  const total =
    PACKAGE_PRICE + extraGuests * EXTRA_PERSON_RATE;

  return (
    <section
      className={styles.booking}
      id="booking"
    >
      <div className="container">

        <p className="section-subtitle">
          RESERVATION
        </p>

        <h2 className="section-title">
          Book Your Escape
        </h2>

        <p className="section-description">
          Select your preferred check-in date and complete your
          reservation request.
        </p>

        <div className={styles.card}>

          <CalendarPanel
            date={date}
            setDate={setDate}
            isBooked={isBooked}
          />

          <ReservationForm
            guests={guests}
            setGuests={setGuests}
            maxGuests={MAX_GUESTS}
            includedGuests={INCLUDED_GUESTS}
            extraPersonRate={EXTRA_PERSON_RATE}
          />

          <BookingSummary
            date={date}
            guests={guests}
            total={total}
          />

        </div>

      </div>
    </section>
  );
}