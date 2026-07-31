import DashboardCard from "@/components/Admin/DashboardCard";
import RecentReservations from "@/components/Admin/RecentReservations";
import ReservationCalendar from "@/components/Admin/ReservationCalendar";

import {
  CalendarDays,
  PhilippinePeso,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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
          marginBottom: "35px",
        }}
      >
        Welcome back to Woodland Escape.
      </p>

      {/* Dashboard Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "35px",
        }}
      >
        <DashboardCard
          title="This Month's Reservations"
          value="15"
          icon={CalendarDays}
          color="#2F855A"
        />

        <DashboardCard
          title="Revenue This Month"
          value="₱225,000"
          icon={PhilippinePeso}
          color="#D69E2E"
        />

        <DashboardCard
          title="Available Dates"
          value="18"
          icon={CheckCircle2}
          color="#3182CE"
        />

        <DashboardCard
          title="Booked Dates"
          value="13"
          icon={XCircle}
          color="#E53E3E"
        />
      </div>

      {/* Recent Reservations */}

      <RecentReservations />

      {/* Calendar & Today's Status */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <ReservationCalendar />

        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 8px 25px rgba(0,0,0,.06)",
          }}
        >
          <h2
            style={{
              color: "#163020",
              marginBottom: "20px",
            }}
          >
            Today Status
          </h2>

          <div
            style={{
              background: "#DCFCE7",
              color: "#166534",
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "999px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            🟢 AVAILABLE
          </div>

          <p
            style={{
              color: "#555",
              marginBottom: "25px",
            }}
          >
            No reservation has been made for today.
          </p>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #eee",
              margin: "20px 0",
            }}
          />

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                marginBottom: "8px",
                color: "#163020",
              }}
            >
              Check-in Time
            </h3>

            <p>🕑 2:00 PM</p>
          </div>

          <div>
            <h3
              style={{
                marginBottom: "8px",
                color: "#163020",
              }}
            >
              Check-out Time
            </h3>

            <p>🕛 12:00 PM (Next Day)</p>
          </div>
        </div>
      </div>
    </>
  );
}