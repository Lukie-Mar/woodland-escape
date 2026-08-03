export default function DashboardPage() {
  return (
    <>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "8px",
        }}
      >
        Dashboard
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "32px",
        }}
      >
        Welcome back to Woodland Escape Admin
      </p>

      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <h2>Dashboard is working 🎉</h2>

        <p>
          In the next step we will replace this with live reservation
          statistics from Supabase.
        </p>
      </div>
    </>
  );
}