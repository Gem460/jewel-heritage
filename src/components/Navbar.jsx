import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${
      isActive ? "bg-gray-100" : "hover:bg-gray-50"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 font-semibold text-lg">

          <img
            src="/logo.png"
            alt="The Jewel Heritage"
            className="h-9 w-9 object-contain"
          />

          <span>The Jewel Heritage</span>

        </Link>
        <Link to="/cancel-booking" className="text-sm font-medium hover:underline">
          Cancel Booking
        </Link>
        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/gallery" className={linkClass}>
            Gallery
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2">

          <input
            className="hidden md:block w-[320px] rounded-lg border px-3 py-2 text-sm"
            placeholder="Search rooms... (suite, deluxe, standard)"
          />

          <button className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:bg-gray-900">
            Search
          </button>

          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Sign in
          </button>

        </div>

      </div>
    </header>
  );
}