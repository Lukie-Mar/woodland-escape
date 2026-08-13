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

    // Guest must be checked in first
    if (
      reservation.reservation_status !==
      "CHECKED_IN"
    ) {
      return NextResponse.json(
        {
          error:
            "Only checked-in guests can be checked out.",
        },
        {
          status: 400,
        }
      );
    }

    // Update reservation
    const { error: updateError } =
      await supabaseAdmin
        .from("reservations")
        .update({
          reservation_status: "CHECKED_OUT",
          updated_at: new Date().toISOString(),
        })
        .eq("id", reservation.id);

    if (updateError) {
      console.error(
        "Check-out update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to check out guest.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Guest checked out successfully.",
    });
  } catch (error) {
    console.error(
      "Check-out API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process check-out.",
      },
      {
        status: 500,
      }
    );
  }
}