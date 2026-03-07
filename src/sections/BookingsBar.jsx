import { useMemo, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineBedroomParent } from "react-icons/md";
import Button from "../components/ui/Button";

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function addDaysISO(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function BookingBar({ onSearch, initial }) {
  const defaultCheckIn = initial?.checkIn || todayISO();
  const defaultCheckOut = initial?.checkOut || addDaysISO(defaultCheckIn, 2);

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(initial?.guests ?? 2);
  const [rooms, setRooms] = useState(initial?.rooms ?? 1);

  const error = useMemo(() => {
    if (!checkIn || !checkOut) return "";
    if (new Date(checkOut) <= new Date(checkIn)) return "Check-out must be after check-in.";
    if (guests < 1) return "Guests must be at least 1.";
    if (rooms < 1) return "Rooms must be at least 1.";
    return "";
  }, [checkIn, checkOut, guests, rooms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) return;
    onSearch?.({ checkIn, checkOut, guests, rooms });
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4">
      {/* soft glow background */}
      <div className="pointer-events-none absolute -inset-x-6 -inset-y-10 rounded-[2.5rem] bg-emerald-300/20 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative mt-8 rounded-[2rem] border border-white/20 bg-white/85 backdrop-blur-xl shadow-xl shadow-black/10"
      >
        <div className="grid gap-3 p-4 md:grid-cols-12 md:gap-4 md:p-5">
          {/* Check-in */}
          <Field
            className="md:col-span-3"
            label="Check-in"
            icon={<FaRegCalendarAlt className="text-emerald-900/70" />}
          >
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                const v = e.target.value;
                setCheckIn(v);
                // auto-fix checkout if needed
                if (checkOut && new Date(checkOut) <= new Date(v)) {
                  setCheckOut(addDaysISO(v, 1));
                }
              }}
              className="w-full bg-transparent text-emerald-950 outline-none"
              required
            />
          </Field>

          {/* Check-out */}
          <Field
            className="md:col-span-3"
            label="Check-out"
            icon={<FaRegCalendarAlt className="text-emerald-900/70" />}
          >
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-emerald-950 outline-none"
              required
            />
          </Field>

          {/* Guests */}
          <Field
            className="md:col-span-2"
            label="Guests"
            icon={<HiOutlineUsers className="text-emerald-900/70" />}
          >
            <input
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-transparent text-emerald-950 outline-none"
              required
            />
          </Field>

          {/* Rooms */}
          <Field
            className="md:col-span-2"
            label="Rooms"
            icon={<MdOutlineBedroomParent className="text-emerald-900/70" />}
          >
            <input
              type="number"
              min={1}
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="w-full bg-transparent text-emerald-950 outline-none"
              required
            />
          </Field>

          {/* CTA */}
          <div className="md:col-span-2 flex items-end">
            <Button
              type="submit"
              className="w-full rounded-2xl"
              disabled={!!error}
              title={error || "Search availability"}
            >
              Check Availability
            </Button>
          </div>
        </div>

        {/* error line */}
        {error ? (
          <div className="px-5 pb-4 text-sm text-red-600">
            {error}
          </div>
        ) : (
          <div className="px-5 pb-4 text-sm text-emerald-900/70">
            Instant confirmation • No payment required
          </div>
        )}
      </form>
    </div>
  );
}

function Field({ label, icon, className = "", children }) {
  return (
    <div className={`${className} rounded-2xl border border-black/5 bg-white/70 px-4 py-3`}>
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900/70">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}