import { TreePalm } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <TreePalm size={32} />
        <span>Woodland Escape</span>
      </div>

      <ul>
        <li>Home</li>
        <li>Rooms</li>
        <li>Amenities</li>
        <li>Gallery</li>
        <li>Contact</li>
      </ul>

      <button className="book-btn">
        Book Now
      </button>
    </nav>
  );
}