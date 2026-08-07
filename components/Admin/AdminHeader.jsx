"use client";

import styles from "./AdminHeader.module.css";

export default function AdminHeader({
  title,
  subtitle,
}) {
  const today = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className={styles.right}>
        <span>{today}</span>

        <div className={styles.avatar}>
          A
        </div>
      </div>
    </header>
  );
}