import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Welcome to Woodland Escape</h1>

        <p>
          Your peaceful resort destination surrounded by nature.
        </p>

        <div className={styles.heroButtons}>
          <button className={styles.heroBtn}>
            Book Now
          </button>

          <button className={styles.outlineBtn}>
            Explore Rooms
          </button>
        </div>
      </div>
    </section>
  );
}