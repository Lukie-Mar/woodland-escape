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
          "id, reservation_status"
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

    // Only pending or confirmed reservations
    // can be cancelled.
    if (
      reservation.reservation_status !==
        "PENDING_PAYMENT" &&
      reservation.reservation_status !==
        "CONFIRMED"
    ) {
      return NextResponse.json(
        {
          error:
            "This reservation can no longer be cancelled.",
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
          reservation_status: "CANCELLED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", reservation.id);

    if (updateError) {
      console.error(
        "Cancel reservation update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to cancel reservation.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Reservation cancelled successfully.",
    });
  } catch (error) {
    console.error(
      "Cancel reservation API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process cancellation.",
      },
      {
        status: 500,
      }
    );
  }
}