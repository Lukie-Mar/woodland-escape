import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      amount,
      reservationCode,
      customerName,
      customerEmail,
    } = body;

    const response = await fetch(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        method: "POST",

        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.PAYMONGO_SECRET_KEY + ":"
            ).toString("base64"),

          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          data: {
            attributes: {
              billing: {
                name: customerName,
                email: customerEmail || "",
              },

              line_items: [
                {
                  currency: "PHP",

                  amount: amount * 100,

                  name:
                    "Woodland Escape Down Payment",

                  quantity: 1,
                },
              ],

              payment_method_types: [
                "gcash",
              ],

              success_url:
                "http://localhost:3000/payment/success",

              cancel_url:
                "http://localhost:3000/payment/cancelled",

              metadata: {
                reservationCode,
              },
            },
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        result,
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}