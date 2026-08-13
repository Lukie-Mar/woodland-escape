import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();

    const { reservationId } = body;

    if (!reservationId) {
      return NextResponse.json(
        {
          error: "Reservation ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Find reservation
    const { data: reservation, error: fetchError } =
      await supabaseAdmin
        .from("reservations")
        .select(
          "id, reservation_status, payment_status"
        )
        .eq("id", reservationId)
        .single();

    if (fetchError || !reservation) {
      return NextResponse.json(
        {
          error: "Reservation not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Must be confirmed before check-in
    if (
      reservation.reservation_status !==
      "CONFIRMED"
    ) {
      return NextResponse.json(
        {
          error:
            "Only confirmed reservations can be checked in.",
        },
        {
          status: 400,
        }
      );
    }

    // Update reservation status
    const { error: updateError } =
      await supabaseAdmin
        .from("reservations")
        .update({
          reservation_status: "CHECKED_IN",
          updated_at: new Date().toISOString(),
        })
        .eq("id", reservation.id);

    if (updateError) {
      console.error(
        "Check-in update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to confirm check-in.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Guest checked in successfully.",
    });
  } catch (error) {
    console.error(
      "Check-in API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process check-in.",
      },
      {
        status: 500,
      }
    );
  }
}