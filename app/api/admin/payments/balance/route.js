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

    // -----------------------------
    // Validate request
    // -----------------------------

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

    const paymentAmount = Number(amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid payment amount.",
        },
        {
          status: 400,
        }
      );
    }

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

    // -----------------------------
    // Get reservation
    // -----------------------------

    const { data: reservation, error: reservationError } =
      await supabaseAdmin
        .from("reservations")
        .select("*")
        .eq("id", reservationId)
        .single();

    if (reservationError || !reservation) {
      return NextResponse.json(
        {
          error: "Reservation not found.",
        },
        {
          status: 404,
        }
      );
    }

    // -----------------------------
    // Calculate current balance
    // -----------------------------

    const totalAmount = Number(
      reservation.total_amount || 0
    );

    const currentAmountPaid = Number(
      reservation.amount_paid || 0
    );

    const currentRemainingBalance =
      reservation.remaining_balance !== null &&
      reservation.remaining_balance !== undefined
        ? Number(reservation.remaining_balance)
        : Math.max(
            totalAmount - currentAmountPaid,
            0
          );

    // -----------------------------
    // Prevent overpayment
    // -----------------------------

    if (paymentAmount > currentRemainingBalance) {
      return NextResponse.json(
        {
          error: `Payment cannot exceed the remaining balance of ₱${currentRemainingBalance.toLocaleString(
            "en-PH"
          )}.`,
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // Calculate new payment values
    // -----------------------------

    const newAmountPaid =
      currentAmountPaid + paymentAmount;

    const newRemainingBalance =
      Math.max(
        totalAmount - newAmountPaid,
        0
      );

    const newPaymentStatus =
      newRemainingBalance === 0
        ? "PAID"
        : "PARTIAL";

    // -----------------------------
    // Record payment
    // -----------------------------

    const { error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .insert([
          {
            reservation_id: reservation.id,

            payment_type: "BALANCE",

            amount: paymentAmount,

            payment_method: paymentMethod,

            payment_status: "PAID",

            notes:
              notes?.trim() || null,
          },
        ]);

    if (paymentError) {
      console.error(
        "Payment insert error:",
        paymentError
      );

      return NextResponse.json(
        {
          error:
            "Unable to record the payment.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------
    // Update reservation
    // -----------------------------

    const updateData = {
  amount_paid: newAmountPaid,

  remaining_balance:
    newRemainingBalance,

  payment_status:
    newPaymentStatus,

  payment_method:
    paymentMethod,

  reservation_status:
    newRemainingBalance === 0
      ? "CONFIRMED"
      : reservation.reservation_status,

  updated_at:
    new Date().toISOString(),
};

    const { error: updateError } =
      await supabaseAdmin
        .from("reservations")
        .update(updateData)
        .eq("id", reservation.id);

    if (updateError) {
      console.error(
        "Reservation update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Payment was recorded, but the reservation could not be updated. Please check the payment record.",
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------
    // Success
    // -----------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Balance payment recorded successfully.",

        paymentAmount,

        amountPaid:
          newAmountPaid,

        remainingBalance:
          newRemainingBalance,

        paymentStatus:
          newPaymentStatus,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Balance payment error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to record balance payment.",
      },
      {
        status: 500,
      }
    );
  }
}