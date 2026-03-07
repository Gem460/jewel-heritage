import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaRegCalendarAlt, FaBed, FaUsers } from "react-icons/fa";

// ✅ Import your real hero images
import hero1 from "../assets/hotel/hero/hero-1.jpg";
import hero2 from "../assets/hotel/hero/hero-2.jpg";
import hero3 from "../assets/hotel/hero/hero-3.jpg";
import hero4 from "../assets/hotel/hero/hero-4.jpg";
import hero5 from "../assets/hotel/hero/hero-5.jpg";

function addDays(dateStr, days) {
  const d = dateStr ? new Date(dateStr) : new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Hero() {
  const navigate = useNavigate();

  // ✅ Keep moving background
  const images = useMemo(() => [hero1, hero2, hero3, hero4, hero5], []);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [images.length]);

  // Booking bar state
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [location, setLocation] = useState("Paro, Bhutan");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDays(today, 1));
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  // Light validation (so it feels polished)
  const dateError =
    checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)
      ? "Check-out must be after check-in."
      : "";

  const submit = (e) => {
    e.preventDefault();
    if (dateError) return;

    const qs = new URLSearchParams({
      location,
      checkIn,
      checkOut,
      rooms: String(rooms),
      guests: String(guests),
    }).toString();

    navigate(`/pricing?${qs}`);
  };

  return (
    <section className="relative min-h-[78vh] md:min-h-[88vh] flex items-center overflow-hidden">
      {/* Moving Background */}
      <div className="absolute inset-0">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="The Jewel Heritage"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Premium overlay (better than flat black) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs md:text-sm text-white/90 backdrop-blur">
              Boutique Heritage Stay • Changsima, Paro
            </p>

            <h1 className="mt-4 text-white text-4xl md:text-6xl font-semibold drop-shadow">
              Find Your Perfect Stay
            </h1>

            <p className="mt-4 text-white/90 max-w-3xl mx-auto text-base md:text-lg">
              Experience authentic Bhutanese heritage with warm hospitality and instant booking confirmation.
            </p>

            {/* Small feature chips */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {["Instant Confirmation", "Family Friendly", "Heritage Interiors"].map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs md:text-sm text-white/90 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Booking Bar (Beautified) */}
          <div className="relative mt-10">
            {/* Glow behind bar */}
            <div className="pointer-events-none absolute -inset-x-6 -inset-y-10 rounded-[2.5rem] bg-emerald-300/20 blur-3xl" />

            <form
              onSubmit={submit}
              className="relative rounded-[2rem] border border-white/20 bg-white/85 backdrop-blur-xl shadow-2xl shadow-black/15 overflow-hidden"
            >
              {/* Top location row */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
                <div className="h-10 w-10 rounded-2xl bg-emerald-900/10 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-emerald-900/70" />
                </div>

                <div className="flex flex-col w-full">
                  <span className="text-[11px] font-semibold text-emerald-900/60">
                    Location
                  </span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full outline-none bg-transparent text-emerald-950 font-medium"
                  />
                </div>
              </div>

              {/* Fields */}
              <div className="grid gap-3 p-4 md:grid-cols-12 md:gap-4 md:p-5">
                {/* Check-in */}
                <Field className="md:col-span-3" icon={<FaRegCalendarAlt />} label="Check-in">
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCheckIn(v);
                      if (checkOut <= v) setCheckOut(addDays(v, 1));
                    }}
                    className="w-full bg-transparent outline-none text-emerald-950 font-medium"
                    required
                  />
                </Field>

                {/* Check-out */}
                <Field className="md:col-span-3" icon={<FaRegCalendarAlt />} label="Check-out">
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-transparent outline-none text-emerald-950 font-medium"
                    required
                    min={addDays(checkIn, 1)}
                  />
                </Field>

                {/* Rooms */}
                <Field className="md:col-span-2" icon={<FaBed />} label="Rooms">
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full bg-transparent outline-none text-emerald-950 font-medium"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} Room{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Guests */}
                <Field className="md:col-span-2" icon={<FaUsers />} label="Guests">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full bg-transparent outline-none text-emerald-950 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Button */}
                <div className="md:col-span-2 flex items-stretch">
                  <button
                    type="submit"
                    disabled={!!dateError}
                    className={[
                      "w-full rounded-2xl px-6 py-4 md:py-0 font-semibold",
                      "bg-emerald-900 text-white shadow-lg shadow-emerald-900/25",
                      "hover:bg-emerald-800 transition",
                      "active:scale-[0.99]",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                      "inline-flex items-center justify-center",
                    ].join(" ")}
                    title={dateError || "Book online"}
                  >
                    Book Online
                  </button>
                </div>
              </div>

              {/* Footer line under bar */}
              <div className="px-5 pb-5 -mt-1">
                {dateError ? (
                  <p className="text-sm text-red-600">{dateError}</p>
                ) : (
                  <p className="text-sm text-emerald-900/70">
                    Instant confirmation • No payment required • Secure booking
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ icon, label, className = "", children }) {
  return (
    <div
      className={[
        className,
        "rounded-2xl border border-black/5 bg-white/70 px-4 py-3",
        "shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900/60">
        <span className="text-emerald-900/70">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}