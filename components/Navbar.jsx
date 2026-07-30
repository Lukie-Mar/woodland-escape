import { TreePalm } from "lucide-react";
import styles from "./Navbar.module.css";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="#" className={styles.logo}>
        <TreePalm size={32} />
        <span>Woodland Escape</span>
      </a>

      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/rooms">Rooms</Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/amenities">Amenities</Link>
        </li>
        <li className={styles.navItem}>Gallery</li>
        <li className={styles.navItem}>Contact</li>
      </ul>

      <Link
  href="/booking"
  className={styles.bookButton}
>
  Book Now
</Link>
    </nav>
  );
}