import {
  CalendarDays,
  BadgeCheck,
  PhilippinePeso,
  Clock3,
} from "lucide-react";

import styles from "./DashboardStats.module.css";

const cards = [
  {
    title: "Total Reservations",
    value: 0,
    icon: CalendarDays,
    color: "#2563eb",
  },
  {
    title: "Confirmed",
    value: 0,
    icon: BadgeCheck,
    color: "#16a34a",
  },
  {
    title: "Revenue",
    value: "₱0",
    icon: PhilippinePeso,
    color: "#059669",
  },
  {
    title: "Pending",
    value: 0,
    icon: Clock3,
    color: "#ea580c",
  },
];

export default function DashboardStats() {
  return (
    <section className={styles.grid}>
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={styles.card}
          >
            <div
              className={styles.icon}
              style={{
                background: card.color,
              }}
            >
              <Icon size={24} />
            </div>

            <div>
              <p>{card.title}</p>

              <h2>{card.value}</h2>
            </div>
          </div>
        );
      })}
    </section>
  );
}