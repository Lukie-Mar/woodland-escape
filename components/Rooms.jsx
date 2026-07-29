import Image from "next/image";
import styles from "./Rooms.module.css";

const rooms = [
  {
    title: "Deluxe Room",
    image: "/images/rooms/deluxe.jpg",
    description:
      "A cozy and elegant room perfect for couples or small families.",
  },
  {
    title: "Family Room",
    image: "/images/rooms/family.jpg",
    description:
      "Spacious accommodation designed for families seeking comfort and relaxation.",
  },
  {
    title: "Barkada Room",
    image: "/images/rooms/barkada.jpg",
    description:
      "Ideal for groups looking to enjoy a fun and memorable getaway together.",
  },
];

export default function Rooms() {
  return (
    <section className={styles.rooms}>
      <div className="container">
        <p className="section-subtitle">
          OUR ACCOMMODATIONS
        </p>

        <h2 className="section-title">
          Choose Your Perfect Room
        </h2>

        <p className="section-description">
          Our overnight package includes access to these comfortable
          accommodations, allowing you to choose the room that best
          suits your group.
        </p>

        <div className={styles.grid}>
          {rooms.map((room) => (
            <article
              key={room.title}
              className={styles.card}
            >
              <Image
                src={room.image}
                alt={room.title}
                width={500}
                height={320}
                className={styles.image}
              />

              <div className={styles.content}>
                <h3 className={styles.roomTitle}>
                  {room.title}
                </h3>

                <p>{room.description}</p>

                <button className={styles.button}>
                  View Details
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Overnight Package */}

        <div className={styles.packageCard}>
          <span className={styles.packageLabel}>
            Overnight Package
          </span>

          <h2>₱15,000</h2>

          <p>
            Enjoy a complete overnight experience with comfortable
            accommodations and access to our resort amenities.
          </p>

          <ul>
            <li>✔ Choice of Deluxe, Family, or Barkada Room</li>
            <li>✔ Swimming Pool Access</li>
            <li>✔ Billiards</li>
            <li>✔ Karaoke</li>
            <li>✔ Relaxing Nature Experience</li>
          </ul>

          <button className={styles.packageButton}>
            Book Your Stay
          </button>
        </div>
      </div>
    </section>
  );
}