import { TreePalm } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="#" className={styles.logo}>
        <TreePalm size={32} />
        <span>Woodland Escape</span>
      </a>

      <ul className={styles.navList}>
        <li className={styles.navItem}>Home</li>
        <li className={styles.navItem}>Rooms</li>
        <li className={styles.navItem}>Amenities</li>
        <li className={styles.navItem}>Gallery</li>
        <li className={styles.navItem}>Contact</li>
      </ul>

      <button className={styles.bookBtn}>
        Book Now
      </button>
    </nav>
  );
}