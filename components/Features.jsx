import {
  Bed,
  Waves,
  Trophy,
  MicVocal,
} from "lucide-react";

import styles from "./Features.module.css";

const features = [
  {
    icon: Bed,
    title: "Luxury Rooms",
    description:
      "Comfortable accommodations designed for a relaxing stay.",
  },
  {
    icon: Waves,
    title: "Swimming Pool",
    description:
      "Enjoy a refreshing swim with your family and friends.",
  },
  {
    icon: Trophy,
    title: "Billiards",
    description:
      "Have fun and challenge your companions to a friendly game.",
  },
  {
    icon: MicVocal,
    title: "Karaoke",
    description:
      "Sing your favorite songs and create unforgettable memories.",
  },
];

export default function Features() {
  return (
    <section className={styles.features}>
      <div className="container">
        <span className={styles.subtitle}>
          WHY CHOOSE US
        </span>

        <h2>Experience Woodland Escape</h2>

        <p className={styles.description}>
          Everything you need for a peaceful and enjoyable getaway.
        </p>

        <div className={styles.grid}>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={styles.card}
              >
                <Icon
                  size={42}
                  className={styles.icon}
                />

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}