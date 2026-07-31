import styles from "./DashboardCard.module.css";

export default function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  const Icon = icon;

  return (
    <div className={styles.card}>
      <div
        className={styles.icon}
        style={{ backgroundColor: color }}
      >
        <Icon size={28} />
      </div>

      <div>
        <p className={styles.title}>{title}</p>
        <h2 className={styles.value}>{value}</h2>
      </div>
    </div>
  );
}