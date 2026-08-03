import DashboardStats from "@/components/Admin/DashboardStats";

export default function DashboardPage() {
  return (
    <>
      <div
        style={{
          marginBottom: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            color: "#163020",
            marginBottom: "8px",
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Welcome back to Woodland Escape Admin
        </p>
      </div>

      <DashboardStats />
    </>
  );
}