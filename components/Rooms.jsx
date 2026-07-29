import Image from "next/image";
import styles from "./Rooms.module.css";

const accommodations = [
  {
    title: "Deluxe Room",
    image: "/images/rooms/deluxe.jpg",
    description:
      "A comfortable room perfect for couples or small groups.",
  },
  {
    title: "Family Room",
    image: "/images/rooms/family.jpg",
    description:
      "A spacious room designed for families and relaxing stays.",
  },
  {
    title: "Barkada Room",
    image: "/images/rooms/barkada.jpg",
    description:
      "A fun accommodation option for friends and larger groups.",
  },
];

export default function Rooms() {
  return (
    <section className={styles.rooms}>
      <div className="container">

        <p className="section-subtitle">
          OVERNIGHT PACKAGE
        </p>

        <h2 className="section-title">
          Your Complete Resort Experience
        </h2>

        <p className="section-description">
          Enjoy an overnight stay at Woodland Escape with comfortable
          accommodations, exciting activities, and full access to resort
          amenities.
        </p>


        <div className={styles.packageCard}>

          <span className={styles.packageLabel}>
            Best Value Package
          </span>

          <h2>
            ₱15,000
          </h2>

          <p>
            A complete overnight resort experience perfect for family
            gatherings, celebrations, and group getaways.
          </p>


          <ul>
            <li>✔ Comfortable room accommodation</li>
            <li>✔ Swimming Pool Access</li>
            <li>✔ Billiards</li>
            <li>✔ Videoke</li>
            <li>✔ Private resort experience</li>
            <li>✔ Nature relaxation experience</li>
          </ul>


          <button className={styles.packageButton}>
            Reserve Your Stay
          </button>

        </div>


        <h3 className={styles.includedTitle}>
          Available Room Options Included
        </h3>


        <div className={styles.grid}>
          {accommodations.map((room) => (
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

                <p>
                  {room.description}
                </p>

              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}