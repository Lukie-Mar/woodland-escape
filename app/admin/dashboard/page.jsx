import DashboardCard from "@/components/Admin/DashboardCard";
import RecentReservations from "@/components/Admin/RecentReservations";
import ReservationCalendar from "@/components/Admin/ReservationCalendar";
import UpcomingReservation from "@/components/Admin/UpcomingReservation";

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

      {/* Calendar & Next Reservation */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "30px",
          alignItems: "start",
        }}
      >
        <ReservationCalendar />

        <UpcomingReservation />
      </div>
    </>
  );
}