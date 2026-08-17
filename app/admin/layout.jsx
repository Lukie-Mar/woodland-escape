"use client";

import { usePathname } from "next/navigation";

import AdminSidebar from "@/components/Admin/AdminSidebar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className={styles.wrapper}>
      <AdminSidebar />

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}