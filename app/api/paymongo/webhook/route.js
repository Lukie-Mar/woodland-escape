import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { verifyWebhook } from "@/lib/paymongo/verifyWebhook";

export async function POST(req) {
  try {
    // Read raw body (required for PayMongo signature verification)
    const rawBody = await req.text();

    const signature = req.headers.get(
      "paymongo-signature"
    );

    // Verify signature
    const isValid = verifyWebhook(
      rawBody,
      signature
    );

    if (!isValid) {
      console.error(
        "❌ Invalid webhook signature."
      );

      return NextResponse.json(
        {
          error: "Invalid signature.",
        },
        {
          status: 401,
        }
      );
    }

    // Parse JSON after verification
    const body = JSON.parse(rawBody);

    console.log(
      "========== PAYMONGO WEBHOOK =========="
    );
    console.dir(body, { depth: null });

    const eventId = body.data?.id;
    const eventType =
      body.data?.attributes?.type;

    // Ignore other webhook events
    if (
      eventType !==
      "checkout_session.payment.paid"
    ) {
      console.log(
        "Ignoring webhook:",
        eventType
      );

      return NextResponse.json({
        received: true,
      });
    }

   const checkoutData = body.data.attributes.data;

    const checkoutId = checkoutData.id;

const paymentId =
  checkoutData.attributes.payments?.[0]?.id;

if (!checkoutId || !paymentId) {
  console.error("Missing checkout/payment IDs", {
    checkoutId,
    paymentId,
  });

  return NextResponse.json(
    {
      error: "Invalid PayMongo webhook payload.",
    },
    {
      status: 400,
    }
  );
}

    console.log("===== WEBHOOK VALUES =====");
   console.log({
  eventId,
  eventType,
  checkoutId,
  paymentId,
});

    console.log(
      "Calling confirm_reservation_payment..."
    );

    const rpcResult =
      await supabaseAdmin.rpc(
        "confirm_reservation_payment",
        {
          p_checkout_id: checkoutId,
          p_payment_id: paymentId,
          p_event_id: eventId,
        }
      );

    console.log("===== RPC RESULT =====");
    console.dir(rpcResult, {
      depth: null,
    });

    if (rpcResult.error) {
      console.error("RPC ERROR:");
      console.dir(rpcResult.error, {
        depth: null,
      });

      return NextResponse.json(
        {
          error:
            "Database transaction failed.",
        },
        {
          status: 500,
        }
      );
    }

    console.log(
      "✅ Reservation confirmed successfully."
    );

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(
      "========== WEBHOOK ERROR =========="
    );
    console.error(err);

    return NextResponse.json(
      {
        error: "Webhook failed.",
      },
      {
        status: 500,
      }
    );
  }
}