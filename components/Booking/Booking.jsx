"use client";

import { useState } from "react";

import styles from "./Booking.module.css";

import CalendarPanel from "./CalendarPanel";
import ReservationForm from "./ReservationForm";
import BookingSummary from "./BookingSummary";
import BookingConfirmModal from "./BookingConfirmModal";

import { calculateReservation } from "@/lib/calculator";

// Temporary until we load real booked dates
const bookedDates = [
  "2026-08-15",
  "2026-08-22",
  "2026-09-05",
];

export default function Booking({ settings }) {
  const includedGuests = Number(
    settings?.included_guests ?? 18
  );

  const [date, setDate] = useState(
    new Date()
  );

  const [guests, setGuests] = useState(
    includedGuests
  );

  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [bookingData, setBookingData] =
    useState({
      fullName: "",
      contact: "",
      email: "",
      specialRequest: "",
      paymentOption:
        "DOWN_PAYMENT",
    });

  function formatDate(date) {
    return date
      .toISOString()
      .split("T")[0];
  }

  function isBooked(date) {
    return bookedDates.includes(
      formatDate(date)
    );
  }

  // ------------------------
  // Pricing
  // ------------------------

  const pricing =
    calculateReservation(
      settings,
      guests,
      bookingData.paymentOption
    );

  const {
    totalAmount,
    amountToPay,
    remainingBalance,
    extraGuests,
    extraFee,
  } = pricing;

  // ------------------------
  // Check-out
  // ------------------------

  const checkOutDate = new Date(date);

  checkOutDate.setDate(
    checkOutDate.getDate() + 1
  );

  // ------------------------
  // Reservation Object
  // ------------------------

  const reservation = {
    ...bookingData,

    checkInDate:
      date.toLocaleDateString(
        "en-PH",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),

    checkOutDate:
      checkOutDate.toLocaleDateString(
        "en-PH",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ),

    guests,

    total: totalAmount,

    amountToPay,

    remainingBalance,

    extraGuests,

    extraFee,
  };

  // ------------------------
  // Reserve Button
  // ------------------------

  function handleReserve() {
    if (
      !bookingData.fullName.trim()
    ) {
      alert(
        "Please enter your full name."
      );
      return;
    }

    if (
      !bookingData.contact.trim()
    ) {
      alert(
        "Please enter your contact number."
      );
      return;
    }

    setShowModal(true);
  }

  // ------------------------
  // Proceed to PayMongo
  // ------------------------

  async function confirmReservation() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/paymongo/checkout",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            fullName:
              bookingData.fullName,

            contact:
              bookingData.contact,

            email:
              bookingData.email,

            specialRequest:
              bookingData.specialRequest,

            checkIn:
              formatDate(date),

            guests,

            paymentOption:
              bookingData.paymentOption,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to proceed."
        );
      }

      window.location.href =
        result.checkoutUrl;
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);

      setShowModal(false);
    }
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
            Select your preferred
            check-in date and complete
            your reservation.
          </p>

          <div className={styles.card}>

            <CalendarPanel
              date={date}
              setDate={setDate}
              isBooked={isBooked}
            />

            <ReservationForm
              bookingData={
                bookingData
              }
              setBookingData={
                setBookingData
              }
              guests={guests}
              setGuests={setGuests}
              includedGuests={
                includedGuests
              }
              extraPersonRate={Number(
                settings?.extra_guest_fee ??
                  150
              )}
            />

            <BookingSummary
              date={date}
              guests={guests}
              total={totalAmount}
              amountToPay={
                amountToPay
              }
              remainingBalance={
                remainingBalance
              }
              paymentOption={
                bookingData.paymentOption
              }
              onReserve={
                handleReserve
              }
              loading={loading}
            />

          </div>

        </div>
      </section>

      <BookingConfirmModal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        onConfirm={
          confirmReservation
        }
        bookingData={
          reservation
        }
        loading={loading}
      />
    </>
  );
}