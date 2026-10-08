"use client";

import { useEffect, useState } from "react";

import styles from "./Booking.module.css";

import CalendarPanel from "./CalendarPanel";
import ReservationForm from "./ReservationForm";
import BookingSummary from "./BookingSummary";
import BookingConfirmModal from "./BookingConfirmModal";

import { calculateReservation } from "@/lib/calculator";

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

  const [availabilityLoading, setAvailabilityLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [bookedDates, setBookedDates] =
    useState([]);

  const [blockedDates, setBlockedDates] =
    useState([]);

  const [availabilityError, setAvailabilityError] =
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
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    async function loadAvailability() {
      try {
        setAvailabilityLoading(true);
        setAvailabilityError(false);

        const response = await fetch(
          "/api/availability",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load availability."
          );
        }

        const data =
          await response.json();

        setBookedDates(
          data.bookedDates || []
        );

        setBlockedDates(
          data.blockedDates || []
        );
      } catch (error) {
        console.error(
          "Availability loading error:",
          error
        );

        setAvailabilityError(true);
      } finally {
        setAvailabilityLoading(false);
      }
    }

    loadAvailability();
  }, []);

  function isBooked(date) {
    return bookedDates.includes(
      formatDate(date)
    );
  }

  function getBlockedDate(date) {
    const dateString =
      formatDate(date);

    return blockedDates.find(
      (blocked) =>
        blocked.date === dateString
    );
  }

  function isUnavailable(date) {
    return (
      isBooked(date) ||
      Boolean(getBlockedDate(date))
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
  } = pricing;

  // ------------------------
  // Check-out
  // ------------------------

  const checkOutDate =
    new Date(date);

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

    extraGuests:
      pricing.extraGuests,

    extraFee:
      pricing.extraFee,
  };

  // ------------------------
  // Reserve Button
  // ------------------------

  function handleReserve() {
    if (availabilityLoading) {
      alert(
        "Please wait while availability is loaded."
      );

      return;
    }

    if (availabilityError) {
      alert(
        "Unable to verify availability. Please refresh the page and try again."
      );

      return;
    }

    if (isUnavailable(date)) {
      alert(
        "This date is no longer available. Please select another date."
      );

      return;
    }

    if (!bookingData.fullName.trim()) {
      alert(
        "Please enter your full name."
      );

      return;
    }

    if (!bookingData.contact.trim()) {
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

      const response =
        await fetch(
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
              isUnavailable={
                isUnavailable
              }
              getBlockedDate={
                getBlockedDate
              }
              availabilityLoading={
                availabilityLoading
              }
            />

            <ReservationForm
              bookingData={bookingData}
              setBookingData={
                setBookingData
              }
              guests={guests}
              setGuests={setGuests}
              includedGuests={
                pricing.includedGuests
              }
              extraPersonRate={
                pricing.extraGuestFee
              }
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
              packagePrice={
                pricing.packagePrice
              }
              includedGuests={
                pricing.includedGuests
              }
              extraPersonRate={
                pricing.extraGuestFee
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
        bookingData={reservation}
        loading={loading}
      />
    </>
  );
}