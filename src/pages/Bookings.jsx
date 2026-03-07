// src/pages/Bookings.jsx
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import rooms from "../data/roomsData";
import { nightsBetween, fmtDateShort } from "../utils/date";

// ✅ If you set VITE_API_BASE you can use it, otherwise default to same-origin (best for Vercel)
const API_BASE = import.meta.env.VITE_API_BASE || "";
const BOOKING_API = `${API_BASE}/api/booking`;

// ✅ Confirmation number generator (JH-YYYYMMDD-XXXX)
function generateConfirmation() {
  const now = new Date();
  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `JH-${date}-${rand}`;
}

// ✅ simple token for cancellation (email-based approach)
function generateCancelToken() {
  return Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
}

// ✅ cancellation link is a mailto link included in email
function buildCancelLink({ confirmationNumber, email, cancelToken }) {
  const hotelEmail = import.meta.env.VITE_HOTEL_EMAIL || "spzbht@gmail.com";

  const subject = encodeURIComponent(`Cancellation Request — ${confirmationNumber}`);
  const body = encodeURIComponent(
    `Hello The Jewel Heritage Reservations,\n\n` +
      `I would like to cancel my booking.\n\n` +
      `Confirmation Number: ${confirmationNumber}\n` +
      `Guest Email: ${email}\n` +
      `Cancel Token: ${cancelToken}\n\n` +
      `Thank you.`
  );

  return `mailto:${hotelEmail}?subject=${subject}&body=${body}`;
}

// ✅ Safe parse date (YYYY-MM-DD)
function toDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export default function Bookings() {
  const [params] = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Generate once per page load (stable confirmation number)
  const [confirmationNo, setConfirmationNo] = useState(generateConfirmation);

  // booking details from URL
  const roomId = params.get("room") || rooms?.[0]?.id;
  const rateId = params.get("rate") || "flex";
  const checkIn = params.get("checkIn") || "2026-03-05";
  const checkOut = params.get("checkOut") || "2026-03-08";
  const adults = Number(params.get("adults") || 1);
  const children = Number(params.get("children") || 0);
  const roomsCount = Number(params.get("rooms") || 1);
  const shuttle = params.get("shuttle") === "true";

  const room = useMemo(
    () => rooms.find((r) => r.id === roomId) || rooms?.[0],
    [roomId]
  );

  const nights = useMemo(() => {
    const n = nightsBetween(checkIn, checkOut);
    return n > 0 ? n : 1;
  }, [checkIn, checkOut]);

  const selectedRate = useMemo(() => {
    if (!room?.rates?.length) return null;
    return room.rates.find((x) => x.id === rateId) || room.rates[0];
  }, [room, rateId]);

  const total = useMemo(() => {
    if (!selectedRate) return 0;
    return (selectedRate.pricePerNight || 0) * nights * roomsCount;
  }, [selectedRate, nights, roomsCount]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    requests: "",
  });

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    setErrorMsg("");

    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(form.phone))
      return "Please enter a valid phone number (include country code).";

    const ci = toDate(checkIn);
    const co = toDate(checkOut);
    if (!ci || !co) return "Please choose valid check-in and check-out dates.";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ci0 = new Date(ci);
    ci0.setHours(0, 0, 0, 0);

    if (ci0 < today) return "Check-in date cannot be in the past.";
    if (nightsBetween(checkIn, checkOut) <= 0)
      return "Check-out must be after check-in.";

    return "";
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    if (!room || !selectedRate) {
      setErrorMsg("Booking details missing. Please start again from Pricing.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // ✅ Stable confirmation
      const confirmation = confirmationNo || generateConfirmation();
      if (!confirmationNo) setConfirmationNo(confirmation);

      // ✅ Cancel mailto link
      const cancelToken = generateCancelToken();
      const cancelLink = buildCancelLink({
        confirmationNumber: confirmation,
        email: form.email,
        cancelToken,
      });

      // ✅ IMPORTANT: These field names match your serverless function
      const payload = {
        confirmationNumber: confirmation,

        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        notes: form.requests, // ✅ matches API

        room: room.name,
        roomId: room.id,
        rate: selectedRate.label,
        checkIn,
        checkOut,
        adults,
        children,
        airportShuttle: shuttle, // ✅ matches API (boolean is fine)
        total: `${room.currency} ${total.toFixed(0)}`,

        cancelToken,
        cancelLink,

        page: typeof window !== "undefined" ? window.location.href : "",
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(BOOKING_API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const out = await res.json().catch(() => ({}));

if (!res.ok) {
  throw new Error(out.error || "Failed to send booking");
}

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err?.message || "Could not send. Please try again.");

      // regenerate confirmation for next attempt
      setConfirmationNo(generateConfirmation());
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="text-sm text-gray-600">THE JEWEL HERITAGE • PARO, BHUTAN</div>

          <h1 className="mt-2 text-4xl font-semibold">Booking request sent ✅</h1>

          <div className="mt-4 text-lg">
            Confirmation Number:
            <span className="font-bold ml-2 text-green-700">{confirmationNo}</span>
          </div>

          <p className="mt-3 text-gray-700">
            Thank you! We’ve received your request and will confirm availability by email shortly.
          </p>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(confirmationNo)}
              className="rounded-full border px-5 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Copy confirmation number
            </button>
          </div>

          <div className="mt-8 border rounded-2xl p-6">
            <div className="text-lg font-semibold">Summary</div>

            <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="text-gray-600">Confirmation</div>
              <div className="font-medium">{confirmationNo}</div>

              <div className="text-gray-600">Room</div>
              <div className="font-medium">{room?.name}</div>

              <div className="text-gray-600">Dates</div>
              <div className="font-medium">
                {fmtDateShort(checkIn)} → {fmtDateShort(checkOut)} ({nights} night)
              </div>

              <div className="text-gray-600">Guests</div>
              <div className="font-medium">
                {adults} adult · {roomsCount} room
              </div>

              <div className="text-gray-600">Rate</div>
              <div className="font-medium">{selectedRate?.label}</div>

              <div className="text-gray-600">Total</div>
              <div className="font-semibold">
                {room?.currency} {total.toFixed(0)}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/" className="rounded-full border px-6 py-3 font-semibold hover:bg-gray-50">
              Back to Home
            </Link>
            <Link
              to="/gallery"
              className="rounded-full bg-black text-white px-6 py-3 font-semibold hover:bg-gray-800"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ FORM
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-sm text-gray-600">THE JEWEL HERITAGE • PARO, BHUTAN</div>
        <h1 className="mt-2 text-4xl font-semibold">Book Your Stay</h1>
        <p className="mt-2 text-gray-700">Fill in your details and submit your booking request.</p>

        <div className="mt-10 grid lg:grid-cols-3 gap-8">
          {/* LEFT: Guest form */}
          <div className="lg:col-span-2 border rounded-2xl overflow-hidden">
            <div className="p-6 border-b">
              <div className="text-xl font-semibold">Guest details</div>
              <div className="text-sm text-gray-600 mt-1">
                Enter accurate contact details so we can confirm quickly.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errorMsg ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {errorMsg}
                </div>
              ) : null}

              <div>
                <label className="text-sm font-medium">Full name *</label>
                <input
                  value={form.fullName}
                  onChange={update("fullName")}
                  className="mt-2 w-full rounded-xl border px-4 py-3"
                  placeholder="Your full name"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <input
                    value={form.email}
                    onChange={update("email")}
                    className="mt-2 w-full rounded-xl border px-4 py-3"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone (with country code) *</label>
                  <input
                    value={form.phone}
                    onChange={update("phone")}
                    className="mt-2 w-full rounded-xl border px-4 py-3"
                    placeholder="+975 17xxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Special requests (optional)</label>
                <textarea
                  value={form.requests}
                  onChange={update("requests")}
                  className="mt-2 w-full rounded-xl border px-4 py-3"
                  rows={4}
                  placeholder="Airport pickup, late check-in, dietary needs..."
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link to="/pricing" className="text-sm text-blue-700 hover:underline">
                  ← Back to pricing
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Confirm & Send"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 border rounded-2xl p-6 shadow-sm bg-white">
              <div className="text-lg font-semibold">Booking summary</div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room</span>
                  <span className="font-medium">{room?.name || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Dates</span>
                  <span className="font-medium">
                    {checkIn} → {checkOut}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms</span>
                  <span className="font-medium">{roomsCount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Adults</span>
                  <span className="font-medium">{adults}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shuttle</span>
                  <span className="font-medium">{shuttle ? "Yes" : "No"}</span>
                </div>

                <div className="pt-4 border-t flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-semibold">
                    {room?.currency || "BTN"} {total.toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border bg-gray-50 p-4 text-xs text-gray-600">
                We’ll confirm availability by email. (Cancellation link is included in the email you receive.)
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}