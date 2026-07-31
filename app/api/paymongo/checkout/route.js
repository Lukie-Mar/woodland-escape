import { NextResponse } from "next/server";
import api from "@/lib/paymongo";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      amount,
      description,
      customerName,
      customerEmail,
    } = body;

    const response = await api.post("/checkout_sessions", {
      data: {
        attributes: {
          billing: {
            name: customerName,
            email: customerEmail,
          },

          send_email_receipt: true,

          show_description: true,

          show_line_items: true,

          line_items: [
            {
              currency: "PHP",

              amount: amount * 100,

              description,

              name: "Woodland Escape Reservation",

              quantity: 1,
            },
          ],

          payment_method_types: [
            "gcash",
            "card",
          ],

          success_url:
            `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success`,

          cancel_url:
            `${process.env.NEXT_PUBLIC_SITE_URL}/booking`,
        },
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error);

    return NextResponse.json(
      {
        error: "Unable to create checkout session.",
      },
      {
        status: 500,
      }
    );
  }
}