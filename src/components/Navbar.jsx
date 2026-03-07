import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-gray-100 text-black" : "hover:bg-gray-50 text-gray-700"
    }`;

  const handleSearch = () => {
    const value = query.trim();
    if (!value) return;

    const qs = new URLSearchParams({
      search: value,
    }).toString();

    navigate(`/pricing?${qs}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3 font-semibold text-lg">
          <img
            src="/logo.png"
            alt="The Jewel Heritage"
            className="h-9 w-9 object-contain"
          />
          <span>The Jewel Heritage</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            About
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="hidden md:block w-[280px] rounded-lg border px-3 py-2 text-sm"
            placeholder="Search rooms... (suite, deluxe, standard)"
          />

          <button
            onClick={handleSearch}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm hover:bg-gray-900 transition"
          >
            Search
          </button>

         </div>
      </div>
    </header>
  );
}