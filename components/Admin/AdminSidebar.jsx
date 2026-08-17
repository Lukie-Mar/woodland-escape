"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarX,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Trees,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import styles from "./AdminSidebar.module.css";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reservations",
    href: "/admin/reservations",
    icon: CalendarDays,
  },
  {
    title: "Availability",
    href: "/admin/availability",
    icon: CalendarX,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to log out. Please try again.");
    }
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Trees size={34} />

        <div>
          <h2>Woodland</h2>
          <span>Escape Admin</span>
        </div>
      </div>

      <nav className={styles.menu}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`${styles.link} ${
                pathname === item.href
                  ? styles.active
                  : ""
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <button
        className={styles.logout}
        onClick={handleLogout}
        type="button"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}