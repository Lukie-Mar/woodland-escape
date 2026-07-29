import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <section className={styles.contact}>
      <div className="container">

        <p className="section-subtitle">
          RESERVATIONS
        </p>

        <h2 className="section-title">
          Plan Your Woodland Escape Today
        </h2>

        <p className="section-description">
          Ready for a relaxing getaway? Reserve your overnight
          package and create unforgettable memories with your
          family and friends.
        </p>


        <div className={styles.card}>

          <div className={styles.info}>

            <h3>
              Contact Us
            </h3>

            <p>
              📍 Woodland Escape Resort
            </p>

            <p>
              📞 0910 107 8418
            </p>

            <p>
  💬 <a
    href="https://www.facebook.com/profile.php?id=61557390210753"
    target="_blank"
    rel="noopener noreferrer"
  >
    Message us on Facebook for reservations
  </a>
</p>

          </div>


          <div className={styles.action}>

            <h3>
              Book Your Stay
            </h3>

            <p>
              Inquire now and secure your preferred date.
            </p>


            <a
  href="https://www.facebook.com/profile.php?id=61557390210753"
  target="_blank"
  rel="noopener noreferrer"
  className={styles.button}
>
  Reserve Now
</a>
          </div>

        </div>

      </div>
    </section>
  );
}