"use client";

import { useState } from "react";

import styles from "./Booking.module.css";

import CalendarPanel from "./CalendarPanel";
import ReservationForm from "./ReservationForm";
import BookingSummary from "./BookingSummary";
import BookingConfirmModal from "./BookingConfirmModal";

const PACKAGE_PRICE = 15000;
const INCLUDED_GUESTS = 18;
const EXTRA_PERSON_RATE = 150;

const bookedDates = [
  "2026-08-15",
  "2026-08-22",
  "2026-09-05",
];

export default function Booking() {
  const [date, setDate] = useState(new Date());
  const [guests, setGuests] = useState(INCLUDED_GUESTS);

  const [bookingData, setBookingData] = useState({
    fullName: "",
    contact: "",
    email: "",
    specialRequest: "",
  });

  const [showModal, setShowModal] = useState(false);

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  function isBooked(date) {
    return bookedDates.includes(formatDate(date));
  }

  // Pricing
  const extraGuests = Math.max(
    0,
    guests - INCLUDED_GUESTS
  );

  const total =
    PACKAGE_PRICE +
    extraGuests * EXTRA_PERSON_RATE;

  // Check-out Date
  const checkOutDate = new Date(date);
  checkOutDate.setDate(checkOutDate.getDate() + 1);

  // Data passed to confirmation modal
  const reservation = {
    ...bookingData,

    checkInDate: date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),

    checkOutDate: checkOutDate.toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ),

    guests,
    total,
  };

  function handleReserve() {
    if (!bookingData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!bookingData.contact.trim()) {
      alert("Please enter your contact number.");
      return;
    }

    setShowModal(true);
  }

  function confirmReservation() {
    console.log("Reservation:", reservation);

    alert(
      "Reservation submitted successfully!\n\nWe will contact you shortly to confirm your booking."
    );

    setShowModal(false);

    // TODO:
    // Save reservation to Supabase
  }

  return (
    <>
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
            Select your preferred check-in date and
            complete your reservation request.
          </p>

          <div className={styles.card}>

            <CalendarPanel
              date={date}
              setDate={setDate}
              isBooked={isBooked}
            />

            <ReservationForm
              bookingData={bookingData}
              setBookingData={setBookingData}
              guests={guests}
              setGuests={setGuests}
              includedGuests={INCLUDED_GUESTS}
              extraPersonRate={EXTRA_PERSON_RATE}
            />

            <BookingSummary
              date={date}
              guests={guests}
              total={total}
              onReserve={handleReserve}
            />

          </div>

        </div>
      </section>

      <BookingConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmReservation}
        bookingData={reservation}
      />
    </>
  );
}