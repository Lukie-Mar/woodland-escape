import { NextResponse } from "next/server";

import api from "@/lib/paymongo";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getPaymentSettings } from "@/lib/settings";
import { calculateReservation } from "@/lib/calculator";
import { generateReservationCode } from "@/lib/reservationCode";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      fullName,
      contact,
      email,
      specialRequest,
      checkIn,
      guests,
      paymentOption,
    } = body;

    // --------------------------------
    // Basic validation
    // --------------------------------

    if (
      !fullName ||
      !contact ||
      !checkIn ||
      !guests ||
      !paymentOption
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid number of guests.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !["FULL_PAYMENT", "DOWN_PAYMENT"].includes(
        paymentOption
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid payment option.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------
    // Check website reservations
    // --------------------------------

    const {
      data: existingReservation,
      error: reservationCheckError,
    } = await supabaseAdmin
      .from("reservations")
      .select("id")
      .eq("check_in", checkIn)
      .in("reservation_status", [
        "PENDING_PAYMENT",
        "CONFIRMED",
        "CHECKED_IN",
      ]);

    if (reservationCheckError) {
      throw reservationCheckError;
    }

    if (
      existingReservation &&
      existingReservation.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "This date is no longer available.",
        },
        {
          status: 409,
        }
      );
    }

    // --------------------------------
    // Check admin availability overrides
    // --------------------------------

    const {
      data: availabilityOverride,
      error: overrideCheckError,
    } = await supabaseAdmin
      .from("availability_overrides")
      .select("date, status, reason")
      .eq("date", checkIn)
      .eq("status", "UNAVAILABLE")
      .maybeSingle();

    if (overrideCheckError) {
      throw overrideCheckError;
    }

    if (availabilityOverride) {
      let reasonMessage =
        "This date is no longer available.";

      switch (availabilityOverride.reason) {
        case "EXISTING_BOOKING":
          reasonMessage =
            "This date already has an existing booking.";
          break;

        case "PRIVATE_EVENT":
          reasonMessage =
            "This date is unavailable because of a private event.";
          break;

        case "MAINTENANCE":
          reasonMessage =
            "This date is unavailable because the resort is under maintenance.";
          break;
      }

      return NextResponse.json(
        {
          error: reasonMessage,
        },
        {
          status: 409,
        }
      );
    }

    // --------------------------------
    // Load resort settings
    // --------------------------------

    const settings =
      await getPaymentSettings();

    // --------------------------------
    // Calculate pricing
    // --------------------------------

    const pricing =
      calculateReservation(
        settings,
        guestCount,
        paymentOption
      );

    // --------------------------------
    // Check-out is next day
    // --------------------------------

    const checkOut =
      new Date(`${checkIn}T00:00:00`);

    checkOut.setDate(
      checkOut.getDate() + 1
    );

    const checkOutString =
      checkOut
        .toISOString()
        .split("T")[0];

    // --------------------------------
    // Generate reservation code
    // --------------------------------

    const reservationCode =
      generateReservationCode();

    // --------------------------------
    // Create reservation
    // --------------------------------

    const {
      data: reservation,
      error: reservationError,
    } = await supabaseAdmin
      .from("reservations")
      .insert([
        {
          reservation_code:
            reservationCode,

          full_name:
            fullName.trim(),

          contact_number:
            contact.trim(),

          email:
            email?.trim() || null,

          special_requests:
            specialRequest?.trim() || null,

          check_in:
            checkIn,

          check_out:
            checkOutString,

          guests:
            guestCount,

          payment_option:
            paymentOption,

          total_amount:
            pricing.totalAmount,

          amount_to_pay:
            pricing.amountToPay,

          remaining_balance:
            pricing.remainingBalance,

          reservation_status:
            "PENDING_PAYMENT",
        },
      ])
      .select()
      .single();

    // --------------------------------
    // Database-level duplicate protection
    // --------------------------------

    if (reservationError) {
      // PostgreSQL unique violation
      if (reservationError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "This date is no longer available. Another reservation was just made for this date.",
          },
          {
            status: 409,
          }
        );
      }

      throw reservationError;
    }

    // --------------------------------
    // Create PayMongo Checkout Session
    // --------------------------------

    const response =
      await api.post(
        "/checkout_sessions",
        {
          data: {
            attributes: {
              billing: {
                name: fullName,
                email,
              },

              send_email_receipt: true,

              show_description: true,

              show_line_items: true,

              payment_method_types: [
                "gcash",
                "card",
              ],

              line_items: [
                {
                  currency: "PHP",

                  amount:
                    pricing.amountToPay *
                    100,

                  description:
                    reservationCode,

                  name:
                    "Woodland Escape Reservation",

                  quantity: 1,
                },
              ],

              success_url:
                `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success`,

              cancel_url:
                `${process.env.NEXT_PUBLIC_SITE_URL}/booking`,
            },
          },
        }
      );

    // --------------------------------
    // Save PayMongo Checkout ID
    // --------------------------------

    const {
      error: checkoutUpdateError,
    } = await supabaseAdmin
      .from("reservations")
      .update({
        paymongo_checkout_id:
          response.data.data.id,
      })
      .eq(
        "id",
        reservation.id
      );

    if (checkoutUpdateError) {
      throw checkoutUpdateError;
    }

    // --------------------------------
    // Return checkout URL
    // --------------------------------

    return NextResponse.json({
      checkoutUrl:
        response.data.data.attributes
          .checkout_url,

      reservationCode,
    });
  } catch (err) {
    console.error(
      "Checkout error:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Unable to create checkout session.",
      },
      {
        status: 500,
      }
    );
  }
}