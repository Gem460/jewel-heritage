import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="text-lg font-semibold">The Jewel Heritage</div>
            <p className="text-sm text-gray-600 mt-2">
              A traditional Bhutanese heritage stay in Changsima, Paro.
            </p>
          </div>

          {/* Quick links (no contact info here) */}
          <div>
            <div className="text-sm font-semibold">Quick Links</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/#rooms" className="hover:underline">Rooms</Link></li>
              <li><Link to="/#gallery" className="hover:underline">Gallery</Link></li>
              <li><Link to="/#contact" className="hover:underline">Contact</Link></li>
              <li><Link to="/pricing" className="hover:underline">Book Online</Link></li>
              <li><Link to="/cancel-booking" className="hover:underline">Cancel Booking</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <div className="text-sm font-semibold">Follow Us</div>
            <div className="mt-4 flex items-center gap-3">
              <SocialIcon label="Facebook" href="https://facebook.com" icon="f" />
              <SocialIcon label="Instagram" href="https://instagram.com" icon="◎" />
              <SocialIcon label="YouTube" href="https://youtube.com" icon="▶" />
              <SocialIcon label="WhatsApp" href="https://wa.me/" icon="✆" />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              (Update these links with your real pages.)
            </p>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-xs text-gray-500 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span>© {new Date().getFullYear()} The Jewel Heritage. All rights reserved.</span>
          <span>Built with care in Bhutanese tradition.</span>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, href, icon }) {
  return (
    <a
      aria-label={label}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-50"
      title={label}
    >
      <span className="text-sm font-semibold">{icon}</span>
    </a>
  );
}