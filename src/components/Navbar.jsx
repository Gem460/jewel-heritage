import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const base =
    "text-gray-700 hover:text-amber-700 transition font-medium";
  const active =
    "text-amber-800 font-semibold";

  const navClass = ({ isActive }) => (isActive ? active : base);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg font-bold tracking-wide text-amber-900"
            onClick={() => setIsOpen(false)}
          >
            THE JEWEL HERITAGE
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navClass}>
              About
            </NavLink>

            <NavLink to="/gallery" className={navClass}>
              Gallery
            </NavLink>

            <NavLink to="/#rooms" className={base}>
              Rooms
            </NavLink>

            <NavLink
              to="/bookings"
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
            >
              Book Now
            </NavLink>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen((s) => !s)}
              className="text-2xl"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-3">
          <NavLink to="/" className={base} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" className={base} onClick={() => setIsOpen(false)}>
            About
          </NavLink>
          <NavLink to="/gallery" className={base} onClick={() => setIsOpen(false)}>
            Gallery
          </NavLink>
          <NavLink to="/bookings" className={base} onClick={() => setIsOpen(false)}>
            Bookings
          </NavLink>

          <Link
            to="/bookings"
            onClick={() => setIsOpen(false)}
            className="block bg-black text-white px-4 py-2 rounded-full text-center"
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}