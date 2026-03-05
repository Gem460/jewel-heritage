import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import rooms from "../data/roomsData";
import { nightsBetween, fmtDateShort } from "../utils/date";

const FORMSPREE_URL = "https://formspree.io/f/xeelddjb";

export default function Checkout() {
  const [params] = useSearchParams();

  const roomId = params.get("room") || rooms?.[0]?.id;
  const rateId = params.get("rate") || "flex";
  const checkIn = params.get("checkIn") || "2026-03-05";
  const checkOut = params.get("checkOut") || "2026-03-08";
  const adults = Number(params.get("adults") || 1);
  const roomsCount = Number(params.get("rooms") || 1);

  const room = useMemo(() => rooms.find((r) => r.id === roomId) || rooms?.[0], [roomId]);
  const nights = useMemo(() => nightsBetween(checkIn, checkOut) || 1, [checkIn, checkOut]);

  const rate = useMemo(() => {
    if (!room?.rates?.length) return null;
    return room.rates.find((x) => x.id === rateId) || room.rates[0];
  }, [room, rateId]);

  const total = useMemo(() => {
    if (!rate) return 0;
    return rate.pricePerNight * nights * roomsCount;
  }, [rate, nights, roomsCount]);

  // form state
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");

  if (!room || !rate) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-gray-700">
          Booking details missing. Please go back and choose a room/rate again.
        </p>
        <Link to="/pricing" className="text-blue-700 hover:underline">
          Go to Pricing
        </Link>
      </div>
    );
  }

  function validate() {
    if (!firstName.trim() || !lastName.trim()) return "Please enter your full name.";
    if (!email.includes("@")) return "Please enter a valid email.";
    const phoneOk = /^[+\d][\d\s\-()]{6,}$/.test(phone.trim());
    if (!phoneOk) return "Please enter a valid phone number with country code (e.g. +975 ...).";
    if (nights <= 0) return "Check-out date must be after check-in date.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const msg = validate();
    if (msg) {
      setStatus("error");
      setErrorMsg(msg);
      return;
    }

    setStatus("sending");

    const formData = new FormData();

    // Guest fields
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("country", country);
    formData.append("specialRequests", notes);

    // Booking summary fields
    formData.append("roomId", room.id);
    formData.append("roomName", room.name);
    formData.append("rateId", rate.id);
    formData.append("rateLabel", rate.label);
    formData.append("checkIn", checkIn);
    formData.append("checkOut", checkOut);
    formData.append("nights", String(nights));
    formData.append("adults", String(adults));
    formData.append("rooms", String(roomsCount));
    formData.append("currency", room.currency);
    formData.append("total", String(total));

    formData.append("subject", `New Booking: ${room.name} (${checkIn} → ${checkOut})`);
    formData.append("_gotcha", "");

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data?.error || "Could not send booking. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link
          to={`/pricing?room=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${roomsCount}`}
          className="text-sm text-blue-700 hover:underline"
        >
          ← Back
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* LEFT form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-semibold">Complete your booking</h1>
            <p className="text-sm text-gray-600 mt-1">
              Fields marked with an asterisk (*) are required
            </p>

            <div className="mt-6 border rounded-2xl bg-white p-5">
              <div className="flex items-center gap-2 text-sm">
                ⏱️ <span>Free cancellation until 6:00 PM (day before arrival)</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 border rounded-2xl bg-white p-6">
              {status === "success" && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  ✅ Booking request sent successfully! We’ll contact you shortly.
                </div>
              )}

              {status === "error" && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  ❌ {errorMsg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <Input label="First name *" value={firstName} onChange={setFirstName} required />
                <Input label="Last name *" value={lastName} onChange={setLastName} required />
                <Input label="Email *" type="email" value={email} onChange={setEmail} required />
                <Input label="Phone *" placeholder="+975 ..." value={phone} onChange={setPhone} required />
                <Input label="Country" value={country} onChange={setCountry} />
                <TextArea label="Special requests" value={notes} onChange={setNotes} />
              </div>

              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                disabled={status === "sending" || status === "success"}
                className="mt-6 w-full md:w-auto rounded-full bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Confirm booking"}
              </button>

              <div className="mt-3 text-xs text-gray-500">
                By confirming, you agree to our booking terms.
              </div>
            </form>
          </div>

          {/* RIGHT sticky summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 border rounded-2xl p-6 bg-white shadow-sm">
              <div className="text-xs text-gray-500 uppercase">The Jewel Heritage</div>
              <div className="text-sm text-gray-600 mt-2">
                Check-in 2:00 PM · Check-out 11:00 AM
              </div>

              <div className="mt-5 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dates</span>
                  <span className="font-medium">
                    {fmtDateShort(checkIn)} → {fmtDateShort(checkOut)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-medium">{nights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests</span>
                  <span className="font-medium">{adults} adult</span>
                </div>
              </div>

              <div className="mt-5 border-t pt-5">
                <div className="flex gap-3 items-center">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="h-14 w-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{room.name}</div>
                    <div className="text-xs text-gray-500">{rate.label}</div>
                  </div>
                  <div className="font-semibold">
                    {room.currency} {total.toFixed(0)}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-baseline">
                  <div>
                    <div className="text-lg font-semibold">Total</div>
                    <div className="text-xs text-gray-500">Fees and taxes included</div>
                  </div>
                  <div className="text-2xl font-semibold">
                    {room.currency} {total.toFixed(0)}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  You selected: <span className="font-medium">{rate.label}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Input({ label, required = false, type = "text", placeholder = "", value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input
        required={required}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}