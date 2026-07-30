import styles from "./Hero.module.css";
import Link from "next/link";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Welcome to Woodland Escape</h1>

        <p>
          Your peaceful resort destination surrounded by nature.
        </p>

        <div className={styles.heroButtons}>
          <Link href="/booking" className={styles.heroBtn}>
            Book Now
          </Link>

          <Link href="/rooms" className={styles.outlineBtn}>
            Explore Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}