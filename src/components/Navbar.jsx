import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const whatsappNumber = "97577777567";
  const whatsappMsg =
    "Hello The Jewel Heritage, I’d like to enquire about room availability and rates.";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

        {/* Logo / Brand */}
        <Link to="/" className="font-semibold tracking-wide text-lg">
          The Jewel Heritage
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:opacity-70">
            Home
          </Link>

          <Link to="/about" className="hover:opacity-70">
            About
          </Link>

          <a href="/#rooms" className="hover:opacity-70">
            Rooms
          </a>

          <a href="/#gallery" className="hover:opacity-70">
            Gallery
          </a>

          <a href="/#contact" className="hover:opacity-70">
            Contact
          </a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              whatsappMsg
            )}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-4 py-2 text-sm font-medium bg-black text-white hover:opacity-90"
          >
            WhatsApp
          </a>

          <a
            href="mailto:reservation@thejewelheritage.com"
            className="rounded-full px-4 py-2 text-sm font-medium border hover:bg-gray-100"
          >
            Email
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden border px-3 py-2 rounded-lg text-sm"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col gap-3 px-4 py-4 text-sm">

            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>

            <Link to="/about" onClick={() => setOpen(false)}>
              About
            </Link>

            <a href="/#rooms" onClick={() => setOpen(false)}>
              Rooms
            </a>

            <a href="/#gallery" onClick={() => setOpen(false)}>
              Gallery
            </a>

            <a href="/#contact" onClick={() => setOpen(false)}>
              Contact
            </a>

            <div className="pt-3 flex gap-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  whatsappMsg
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center rounded-full px-4 py-2 bg-black text-white"
              >
                WhatsApp
              </a>

              <a
                href="mailto:reservation@thejewelheritage.com"
                className="flex-1 text-center rounded-full px-4 py-2 border"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}