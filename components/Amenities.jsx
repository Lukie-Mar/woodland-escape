import styles from "./Amenities.module.css";

const amenities = [
  {
    image: "/images/amenities/pool.jpg",
    title: "Swimming Pool",
    description:
      "Relax and enjoy a refreshing swim with family and friends in our spacious pool area.",
  },
  {
    image: "/images/amenities/billiards.jpg",
    title: "Billiards",
    description:
      "Enjoy exciting games and create memorable moments with your companions.",
  },
  {
    image: "/images/amenities/videoke.jpg",
    title: "Videoke",
    description:
      "Sing your favorite songs and make celebrations more enjoyable.",
  },
  {
    image: "/images/amenities/activities.jpg",
    title: "Outdoor Activities",
    description:
      "Spend quality time together through fun outdoor activities.",
  },
  {
    image: "/images/amenities/nature.jpg",
    title: "Nature Escape",
    description:
      "Experience a peaceful getaway surrounded by fresh air and greenery.",
  },
];

export default function Amenities() {
  return (
    <section className={styles.amenities}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h2>Resort Amenities</h2>
          <p>
            Enjoy comfort, relaxation, and unforgettable experiences at Woodland Escape.
          </p>
        </div>


        <div className={styles.grid}>
          {amenities.map((item, index) => (
            <div className={styles.card} key={index}>

              <div className={styles.imageWrapper}>
                <img
                  src={item.image}
                  alt={item.title}
                />
              </div>

              <div className={styles.content}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}