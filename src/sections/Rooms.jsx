import { Link } from "react-router-dom";
import { useState } from "react";
import BookingModal from "../components/BookingModal";
import suite1 from "../assets/rooms/suite-1.jpg";
import deluxe1 from "../assets/rooms/deluxe-1.jpg";
import standard1 from "../assets/rooms/standard-1.jpg";

const rooms = [
  {
    name: "Suite",
    desc: "Spacious premium comfort with a calm heritage feel.",
    tag: "Premium",
    img: suite1,
  },
  {
    name: "Deluxe Room",
    desc: "More space and comfort — ideal for couples or family.",
    tag: "Popular",
    img: deluxe1,
  },
  {
    name: "Standard Room",
    desc: "Cozy traditional design with modern comfort.",
    tag: "Best Value",
    img: standard1,
  },
];

export default function Rooms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  const openBooking = (roomName) => {
    setSelectedRoom(roomName);
    setIsModalOpen(true);
  };

  return (
    <section id="rooms" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Rooms</h2>
            <p className="mt-2 text-gray-700">
              Suite, Deluxe, and Standard rooms.
            </p>
          </div>

          {/* Keep this if you still want a separate bookings page */}
          <Link
            to="/bookings"
            className="text-sm font-medium underline underline-offset-4"
          >
            Go to Bookings
          </Link>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <div
              key={r.name}
              className="rounded-3xl border bg-white overflow-hidden"
            >
              <img
                src={r.img}
                alt={r.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{r.name}</h3>
                  <span className="text-xs rounded-full bg-black text-white px-3 py-1">
                    {r.tag}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-700">{r.desc}</p>

                <div className="mt-5">
                  {/* Modal trigger */}
                  <button
                    onClick={() => openBooking(r.name)}
                    className="inline-block rounded-full px-5 py-2 text-xs font-medium bg-black text-white hover:opacity-90"
                  >
                    Book this
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedRoom={selectedRoom}
        />
      </div>
    </section>
  );
}