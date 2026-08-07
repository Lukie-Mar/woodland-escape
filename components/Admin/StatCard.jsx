import styles from "./StatCard.module.css";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#2f855a",
}) {
  return (
    <div className={styles.card}>
      <div
        className={styles.icon}
        style={{ backgroundColor: color }}
      >
        <Icon size={28} />
      </div>

      <div className={styles.info}>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}