import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { rooms } from "../data/roomsData";

const FORMSPREE_URL = "https://formspree.io/f/xeelddjb";

function formatDateYYYYMMDD(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return formatDateYYYYMMDD(d);
}

export default function Bookings() {
  const location = useLocation();

  const todayStr = useMemo(() => formatDateYYYYMMDD(new Date()), []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    roomType: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    airportShuttle: false,
    message: "",
    _gotcha: "", // honeypot
  });

  const [status, setStatus] = useState({ type: "idle", msg: "" });
  const [errors, setErrors] = useState({});

  // ✅ Prefill from query params e.g. /bookings?room=Suite%20(Single)&checkIn=2026-03-10&checkOut=2026-03-12&adults=2
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const room = params.get("room");
    const checkIn = params.get("checkIn");
    const checkOut = params.get("checkOut");
    const adults = params.get("adults");

    setForm((prev) => ({
      ...prev,
      roomType: room || prev.roomType,
      checkIn: checkIn || prev.checkIn,
      checkOut: checkOut || prev.checkOut,
      adults: adults || prev.adults,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };

      // ✅ If user picks check-in AFTER current check-out, auto bump check-out +1 day
      if (name === "checkIn" && next.checkIn) {
        // force check-in not in the past (extra guard)
        if (next.checkIn < todayStr) next.checkIn = todayStr;

        if (next.checkOut && !(new Date(next.checkOut) > new Date(next.checkIn))) {
          next.checkOut = addDays(next.checkIn, 1);
        }
      }

      // ✅ If user picks check-out BEFORE/ON check-in, auto bump it
      if (name === "checkOut" && next.checkIn && next.checkOut) {
        if (!(new Date(next.checkOut) > new Date(next.checkIn))) {
          next.checkOut = addDays(next.checkIn, 1);
        }
      }

      return next;
    });
  }

  function validate() {
    const e = {};

    if (!form.fullName.trim()) e.fullName = "Full name is required.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email.";
    }

    // Require country code like +61..., allow spaces/dashes/()
    const cleanedPhone = form.phone.replace(/[\s-()]/g, "");
    if (!/^\+\d{8,15}$/.test(cleanedPhone)) {
      e.phone = "Use country code (e.g., +61 4xx xxx xxx).";
    }

    if (!form.roomType) e.roomType = "Please select a room type.";

    if (!form.checkIn) e.checkIn = "Select check-in date.";
    if (!form.checkOut) e.checkOut = "Select check-out date.";

    if (form.checkIn && form.checkIn < todayStr) {
      e.checkIn = "Check-in cannot be in the past.";
    }

    const adultsNum = Number(form.adults);
    if (!Number.isInteger(adultsNum) || adultsNum < 1 || adultsNum > 10) {
      e.adults = "Adults must be 1 to 10.";
    }

    if (form.checkIn && form.checkOut) {
      const inD = new Date(form.checkIn + "T00:00:00");
      const outD = new Date(form.checkOut + "T00:00:00");
      if (!(outD > inD)) e.checkOut = "Check-out must be after check-in.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", msg: "" });

    if (!validate()) {
      setStatus({ type: "error", msg: "Please fix the highlighted fields." });
      return;
    }

    setStatus({ type: "loading", msg: "Sending..." });

    try {
      const fd = new FormData();

      // ✅ Convert checkbox to friendly Yes/No (cleaner emails)
      const payload = {
        ...form,
        phone: form.phone.trim(),
        airportShuttle: form.airportShuttle ? "Yes" : "No",
      };

      Object.entries(payload).forEach(([k, v]) => fd.append(k, String(v)));

      fd.append(
        "_subject",
        `New Booking Request — ${form.roomType} — ${form.checkIn} to ${form.checkOut}`
      );

      // ✅ Optional: tells Formspree where to reply
      fd.append("_replyto", form.email);

      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({ type: "success", msg: "Sent! We’ll confirm availability shortly." });
        setErrors({});
        setForm({
          fullName: "",
          email: "",
          phone: "",
          roomType: "",
          checkIn: "",
          checkOut: "",
          adults: "1",
          airportShuttle: false,
          message: "",
          _gotcha: "",
        });
      } else {
        setStatus({
          type: "error",
          msg: data?.error || "Could not send. Please try again.",
        });
      }
    } catch {
      setStatus({ type: "error", msg: "Network error. Please try again." });
    }
  }

  const inputBase =
    "w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-black/20";

  const errorText = "text-sm text-red-600 mt-1";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Book Your Stay</h1>
      <p className="mt-2 text-gray-600">
        Fill in your details and we’ll confirm availability and pricing by email.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            className={inputBase}
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
          {errors.fullName && <div className={errorText}>{errors.fullName}</div>}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className={inputBase}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            {errors.email && <div className={errorText}>{errors.email}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium">Phone (with country code)</label>
            <input
              className={inputBase}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+61 4xx xxx xxx"
              autoComplete="tel"
              inputMode="tel"
              required
            />
            {errors.phone && <div className={errorText}>{errors.phone}</div>}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium">Room type</label>
            <select
              className={inputBase}
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
              required
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
            {errors.roomType && <div className={errorText}>{errors.roomType}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium">Check-in</label>
            <input
              className={inputBase}
              type="date"
              name="checkIn"
              value={form.checkIn}
              onChange={handleChange}
              min={todayStr}
              required
            />
            {errors.checkIn && <div className={errorText}>{errors.checkIn}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium">Check-out</label>
            <input
              className={inputBase}
              type="date"
              name="checkOut"
              value={form.checkOut}
              onChange={handleChange}
              min={form.checkIn ? addDays(form.checkIn, 1) : addDays(todayStr, 1)}
              required
            />
            {errors.checkOut && <div className={errorText}>{errors.checkOut}</div>}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Adults</label>
            <input
              className={inputBase}
              type="number"
              name="adults"
              min="1"
              max="10"
              value={form.adults}
              onChange={handleChange}
              required
            />
            {errors.adults && <div className={errorText}>{errors.adults}</div>}
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="airportShuttle"
                checked={form.airportShuttle}
                onChange={handleChange}
              />
              Airport shuttle required
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Special requests</label>
          <textarea
            className={inputBase}
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Anything we should know?"
          />
        </div>

        {/* Honeypot: keep hidden */}
        <input
          type="text"
          name="_gotcha"
          value={form._gotcha}
          onChange={handleChange}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={status.type === "loading"}
          className="rounded-md bg-black px-6 py-3 text-white disabled:opacity-60"
        >
          {status.type === "loading" ? "Sending..." : "Submit Booking"}
        </button>

        {status.msg && (
          <div
            className={
              status.type === "success"
                ? "text-green-700"
                : status.type === "error"
                ? "text-red-700"
                : "text-gray-700"
            }
          >
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
}