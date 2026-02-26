import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import suite1 from "../assets/rooms/suite-1.jpg";
import deluxe1 from "../assets/rooms/deluxe-1.jpg";
import standard1 from "../assets/rooms/standard-1.jpg";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Bookings() {
  const q = useQuery();

  const initialRoom = q.get("room") || "Standard Room";

  const [roomType, setRoomType] = useState(initialRoom);
  const [checkIn, setCheckIn] = useState(q.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(q.get("checkOut") || "");
  const [adults, setAdults] = useState(Number(q.get("adults") || 2));
  const [airportShuttle, setAirportShuttle] = useState(q.get("shuttle") === "1");

  // Contact form fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const whatsappNumber = "97577777567";
  const reservationEmail = "reservation@thejewelheritage.com";

  // pick image based on room type
  let roomImage = standard1;
  if (roomType.toLowerCase().includes("suite")) roomImage = suite1;
  if (roomType.toLowerCase().includes("deluxe")) roomImage = deluxe1;

  const bookingText = `Booking Request - The Jewel Heritage
Room: ${roomType}
Check-in: ${checkIn || "TBD"}
Check-out: ${checkOut || "TBD"}
Adults: ${adults}
Airport shuttle: ${airportShuttle ? "Yes" : "No"}

Guest name: ${fullName || "-"}
Phone/WhatsApp: ${phone || "-"}
Email: ${email || "-"}

Message:
${message || "-"}  
`;

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(bookingText)}`;
  const mailtoLink = `mailto:${reservationEmail}?subject=${encodeURIComponent(
    `Booking Request - ${roomType}`
  )}&body=${encodeURIComponent(bookingText)}`;

  function handleSubmit(e) {
    e.preventDefault();
    // No backend: open email as "submit"
    window.location.href = mailtoLink;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold">Bookings</h1>
        <p className="mt-2 text-gray-700">
          Fill the booking details and your contact info. Then send via WhatsApp or Email.
        </p>

        {/* Room Image */}
        <div className="mt-8 rounded-3xl overflow-hidden border">
          <img src={roomImage} alt={roomType} className="w-full h-64 object-cover" />
        </div>

        {/* Booking + Contact Form */}
        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border bg-white p-6">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Booking details */}
            <label className="text-sm">
              Room type
              <select
                className="mt-1 w-full rounded-xl border p-3"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option>Suite</option>
                <option>Deluxe Room</option>
                <option>Standard Room</option>
              </select>
            </label>

            <label className="text-sm">
              Adults
              <input
                type="number"
                min="1"
                className="mt-1 w-full rounded-xl border p-3"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
              />
            </label>

            <label className="text-sm">
              Check-in date
              <input
                type="date"
                className="mt-1 w-full rounded-xl border p-3"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </label>

            <label className="text-sm">
              Check-out date
              <input
                type="date"
                className="mt-1 w-full rounded-xl border p-3"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </label>

            <label className="text-sm flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={airportShuttle}
                onChange={(e) => setAirportShuttle(e.target.checked)}
              />
              Airport shuttle required
            </label>

            {/* Contact details */}
            <div className="md:col-span-2 mt-2">
              <h2 className="text-lg font-semibold">Your Contact Details</h2>
              <p className="mt-1 text-sm text-gray-600">
                We will contact you to confirm availability and rates.
              </p>
            </div>

            <label className="text-sm">
              Full name
              <input
                className="mt-1 w-full rounded-xl border p-3"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="text-sm">
              Phone / WhatsApp
              <input
                className="mt-1 w-full rounded-xl border p-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+975..."
                required
              />
            </label>

            <label className="text-sm md:col-span-2">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-xl border p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </label>

            <label className="text-sm md:col-span-2">
              Message (optional)
              <textarea
                className="mt-1 w-full rounded-xl border p-3 min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any special requests (kids, extra bed, pickup time, etc.)"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {/* WhatsApp */}
            <a
              className="rounded-xl bg-black text-white px-5 py-3 font-medium text-center hover:opacity-90"
              href={waLink}
              target="_blank"
              rel="noreferrer"
            >
              Send via WhatsApp
            </a>

            {/* Email */}
            <button
              type="submit"
              className="rounded-xl border px-5 py-3 font-medium text-center hover:bg-gray-50"
            >
              Send via Email
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Note: This does not take payment. It sends a booking request message to the hotel.
          </p>
        </form>
      </main>

      <Footer />
    </div>
  );
}