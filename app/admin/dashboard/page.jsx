export default function DashboardPage() {
  return (
    <>
      <h1
        style={{
          fontSize: "34px",
          marginBottom: "10px",
        }}
      >
        Dashboard
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "40px",
        }}
      >
        Welcome to Woodland Escape Admin.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(230px,1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 6px 20px rgba(0,0,0,.05)",
          }}
        >
          <h3>This Month Reservations</h3>
          <h1>15</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 6px 20px rgba(0,0,0,.05)",
          }}
        >
          <h3>Revenue This Month</h3>
          <h1>₱225,000</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 6px 20px rgba(0,0,0,.05)",
          }}
        >
          <h3>Available Dates</h3>
          <h1>18</h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow:
              "0 6px 20px rgba(0,0,0,.05)",
          }}
        >
          <h3>Booked Dates</h3>
          <h1>13</h1>
        </div>
      </div>
    </>
  );
}