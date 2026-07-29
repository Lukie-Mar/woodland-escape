import Image from "next/image";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/about/about.jpg"
            alt="Woodland Escape Resort"
            width={600}
            height={500}
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <span className={styles.subtitle}>ABOUT US</span>

          <h2>Escape to Nature, Stay in Comfort</h2>

          <p>
            Woodland Escape is a peaceful resort designed for families,
            couples, and friends looking to relax and reconnect with nature.
            Enjoy breathtaking scenery, cozy accommodations, and unforgettable
            experiences surrounded by lush greenery.
          </p>

          <div className={styles.features}>
            <div>🌿 Luxury Rooms</div>
            <div>🏊 Infinity Pool</div>
            <div>🌄 Mountain Views</div>
            <div>👨‍👩‍👧 Family Friendly</div>
          </div>

          <button className={styles.learnBtn}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}