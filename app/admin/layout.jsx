import AdminSidebar from "@/components/Admin/AdminSidebar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }) {
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