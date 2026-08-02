"use client";

import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        background: "#f7faf7",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "70px",
            marginBottom: "20px",
          }}
        >
          ✅
        </div>

        <h1
          style={{
            marginBottom: "15px",
          }}
        >
          Payment Received
        </h1>

        <p
          style={{
            color: "#666",
            lineHeight: 1.8,
            marginBottom: "35px",
          }}
        >
          Thank you for choosing Woodland Escape.
          <br />
          Your payment has been received successfully.
          <br />
          Your reservation is now being verified.
        </p>

        <div
          style={{
            background: "#F8F8F8",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "35px",
          }}
        >
          <h3>What happens next?</h3>

          <p>
            ✔ Payment verification
          </p>

          <p>
            ✔ Reservation confirmation
          </p>

          <p>
            ✔ Reservation code generation
          </p>

          <p>
            ✔ Email confirmation (Coming Soon)
          </p>
        </div>

        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "#2F855A",
            color: "#fff",
            textDecoration: "none",
            padding: "14px 30px",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}