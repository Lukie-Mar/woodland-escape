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

    // Basic validation
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

    // Check if the selected date is already reserved
    const { data: existingReservation } =
      await supabaseAdmin
        .from("reservations")
        .select("id")
        .eq("check_in", checkIn)
        .in("reservation_status", [
          "PENDING_PAYMENT",
          "CONFIRMED",
          "CHECKED_IN",
        ]);

    if (existingReservation.length > 0) {
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

    // Load resort settings
    const settings = await getPaymentSettings();

    // Calculate pricing
    const pricing = calculateReservation(
      settings,
      Number(guests),
      paymentOption
    );

    // Check-out is always next day
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 1);

    const reservationCode =
      generateReservationCode();

    // Create reservation with pending payment
    const { data: reservation, error } =
      await supabaseAdmin
        .from("reservations")
        .insert([
          {
            reservation_code:
              reservationCode,

            full_name: fullName,

            contact_number: contact,

            email,

            special_requests:
              specialRequest,

            check_in: checkIn,

            check_out:
              checkOut
                .toISOString()
                .split("T")[0],

            guests,

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

    if (error) throw error;

    // Create PayMongo Checkout Session
    const response = await api.post(
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

    // Save Checkout ID
    await supabaseAdmin
      .from("reservations")
      .update({
        paymongo_checkout_id:
          response.data.data.id,
      })
      .eq("id", reservation.id);

    return NextResponse.json({
      checkoutUrl:
        response.data.data.attributes
          .checkout_url,

      reservationCode,
    });
  } catch (err) {
    console.error(err);

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