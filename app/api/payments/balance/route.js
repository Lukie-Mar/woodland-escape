import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      reservationId,
      amount,
      paymentMethod,
      notes,
    } = body;

    // Validate reservation ID
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

    // Validate amount
    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return NextResponse.json(
        {
          error: "Payment amount must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate payment method
    if (!paymentMethod) {
      return NextResponse.json(
        {
          error: "Payment method is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Call the Supabase database function.
    const { data, error } = await supabaseAdmin.rpc(
      "record_balance_payment",
      {
        p_reservation_id: Number(reservationId),
        p_amount: Math.round(paymentAmount),
        p_payment_method: paymentMethod,
        p_notes: notes || null,
      }
    );

    if (error) {
      console.error(
        "Record balance payment error:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message ||
            "Unable to record balance payment.",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      result: data,
    });
  } catch (error) {
    console.error(
      "Balance payment API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}