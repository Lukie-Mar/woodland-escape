import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("PayMongo Webhook:", body);

    const eventType = body.data?.attributes?.type;

    // We only care about successful checkout payments
    if (eventType !== "checkout_session.payment.paid") {
      return NextResponse.json({
        received: true,
      });
    }

    const checkout =
      body.data.attributes.data.attributes;

    const checkoutId =
      checkout.checkout_session_id;

    const paymentId =
      checkout.payment_id;

    // Find reservation using checkout ID
    const { data: reservation, error } =
      await supabaseAdmin
        .from("reservations")
        .select("*")
        .eq(
          "paymongo_checkout_id",
          checkoutId
        )
        .single();

    if (error || !reservation) {
      console.error(
        "Reservation not found."
      );

      return NextResponse.json(
        {
          error:
            "Reservation not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Update reservation
    await supabaseAdmin
      .from("reservations")
      .update({
        reservation_status:
          "CONFIRMED",

        paymongo_payment_id:
          paymentId,
      })
      .eq("id", reservation.id);

    // Save payment record
    await supabaseAdmin
      .from("payments")
      .insert([
        {
          reservation_id:
            reservation.id,

          amount:
            reservation.amount_to_pay,

          payment_status: "PAID",

          payment_method: "PAYMONGO",

          paymongo_payment_id:
            paymentId,
        },
      ]);

    // Mark date unavailable
    await supabaseAdmin
      .from("availability")
      .upsert({
        booking_date:
          reservation.check_in,

        is_available: false,
      });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Webhook failed.",
      },
      {
        status: 500,
      }
    );
  }
}