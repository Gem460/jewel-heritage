import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function toISO(d) {
  return d.toISOString().slice(0, 10);
}

export default function HeroBookingSearch() {
  const navigate = useNavigate();

  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t;
  }, []);

  const [checkIn, setCheckIn] = useState(toISO(today));
  const [checkOut, setCheckOut] = useState(toISO(tomorrow));
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

  function submit() {
    // basic validation
    if (checkOut <= checkIn) {
      alert("Check-out must be after check-in.");
      return;
    }
    navigate(`/pricing?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${rooms}`);
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="grid md:grid-cols-5 gap-0">
            {/* Check-in */}
            <div className="p-4 border-b md:border-b-0 md:border-r">
              <label className="text-sm font-semibold text-gray-700">Check-in date:</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Check-out */}
            <div className="p-4 border-b md:border-b-0 md:border-r">
              <label className="text-sm font-semibold text-gray-700">Check-out date:</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-2 w-full rounded-lg border px-3 py-2"
              />
            </div>

            {/* Travellers */}
            <div className="p-4 border-b md:border-b-0 md:border-r">
              <label className="text-sm font-semibold text-gray-700">Travellers</label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* Rooms */}
            <div className="p-4 border-b md:border-b-0 md:border-r">
              <label className="text-sm font-semibold text-gray-700">Rooms</label>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border px-3 py-2"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* CTA */}
            <div className="p-4">
              <button
                onClick={submit}
                className="w-full h-full rounded-xl bg-[#0b1a33] text-white font-semibold px-4 py-3 hover:opacity-95"
              >
                Check availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}