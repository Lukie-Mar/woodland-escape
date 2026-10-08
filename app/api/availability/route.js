import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const [
      reservationsResult,
      overridesResult,
    ] = await Promise.all([
      supabaseAdmin
        .from("reservations")
        .select(
          "check_in, reservation_status"
        )
        .neq(
          "reservation_status",
          "CANCELLED"
        ),

      supabaseAdmin
        .from("availability_overrides")
        .select(
          "date, status, reason"
        )
        .eq("status", "UNAVAILABLE"),
    ]);

    if (reservationsResult.error) {
      throw reservationsResult.error;
    }

    if (overridesResult.error) {
      throw overridesResult.error;
    }

    const bookedDates =
      (reservationsResult.data || [])
        .map(
          (reservation) =>
            reservation.check_in
        )
        .filter(Boolean);

    const blockedDates =
      (overridesResult.data || []).map(
        (override) => ({
          date: override.date,
          reason: override.reason,
        })
      );

    return NextResponse.json({
      bookedDates,
      blockedDates,
    });
  } catch (error) {
    console.error(
      "Availability API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load availability.",
      },
      {
        status: 500,
      }
    );
  }
}