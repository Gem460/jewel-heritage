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
  const images = useMemo(
    () => [hero1, hero2, hero3, hero4, hero5],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % images.length);
    }, 5000); // change speed if needed

    return () => clearInterval(id);
  }, [images.length]);

  // Booking bar state
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [location, setLocation] = useState("Paro, Bhutan");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDays(today, 1));
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  const submit = (e) => {
    e.preventDefault();

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
    <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center overflow-hidden">
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

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Content */}
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-white text-4xl md:text-6xl font-semibold text-center drop-shadow">
            Find Your Perfect Stay
          </h1>

          <p className="mt-4 text-white/90 text-center max-w-3xl mx-auto text-base md:text-lg">
            Experience authentic Bhutanese heritage in Changsima, Paro.
          </p>

          {/* Booking Bar */}
          <form
            onSubmit={submit}
            className="mt-8 bg-white rounded-2xl shadow-xl border border-white/40 overflow-hidden"
          >
            {/* Location */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-200">
              <FaMapMarkerAlt className="text-stone-500" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none text-stone-800"
              />
            </div>

            {/* Fields */}
            <div className="grid md:grid-cols-5">
              {/* Check-in */}
              <div className="px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200">
                <div className="flex items-center gap-3">
                  <FaRegCalendarAlt className="text-stone-500" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-stone-500">Check-in</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCheckIn(v);
                        if (checkOut <= v) setCheckOut(addDays(v, 1));
                      }}
                      className="outline-none w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Check-out */}
              <div className="px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200">
                <div className="flex items-center gap-3">
                  <FaRegCalendarAlt className="text-stone-500" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-stone-500">Check-out</span>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="outline-none w-full"
                      required
                      min={addDays(checkIn, 1)}
                    />
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div className="px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200">
                <div className="flex items-center gap-3">
                  <FaBed className="text-stone-500" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-stone-500">Rooms</span>
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="outline-none w-full bg-white"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} Room{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="px-5 py-4 border-b md:border-b-0 md:border-r border-stone-200">
                <div className="flex items-center gap-3">
                  <FaUsers className="text-stone-500" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-stone-500">Guests</span>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="outline-none w-full bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} Guest{n > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 transition text-stone-900 font-semibold px-6 py-4 md:py-0 flex items-center justify-center"
              >
                Book Online
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}