import styles from "./StatusBadge.module.css";

export default function StatusBadge({ status }) {
  const key = (status || "").toUpperCase();

  return (
    <span
      className={`${styles.badge} ${
        styles[key] || styles.DEFAULT
      }`}
    >
      {status}
    </span>
  );
}