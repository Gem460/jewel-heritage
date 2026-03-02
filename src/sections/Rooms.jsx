import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { rooms } from "../data/roomsData";
import RoomGalleryModal from "../components/RoomGalleryModal";

function Chip({ children }) {
  return (
    <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs text-gray-800">
      {children}
    </span>
  );
}

export default function Rooms() {
  const [openRoomId, setOpenRoomId] = useState(null);

  const activeRoom = rooms.find((r) => r.id === openRoomId);
  const defaultRoom = rooms[0];

  // ✅ You can customize these per room name/id
  const perksById = useMemo(
    () => ({
      "suite-sgl": ["Heritage Suite", "Wi-Fi", "Mountain View", "Hot Shower"],
      "suite-dbl": ["Spacious", "Wi-Fi", "Mountain View", "Hot Shower"],
      "standard-sgl": ["Cozy", "Wi-Fi", "Hot Shower", "Quiet"],
      "standard-dbl": ["Comfort", "Wi-Fi", "Hot Shower", "Quiet"],
    }),
    []
  );

  const isPopular = (id) => id === "suite-dbl"; // choose your popular room

  return (
    <section id="rooms" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Our Rooms</h2>
            <p className="mt-2 text-gray-600">
              Click a photo to view the full gallery.
            </p>
          </div>

          <Link
            to={
              defaultRoom?.name
                ? `/bookings?room=${encodeURIComponent(defaultRoom.name)}`
                : "/bookings"
            }
            className="hidden sm:inline-flex rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Go to Bookings →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const chips = perksById[room.id] || ["Wi-Fi", "Hot Shower"];
            return (
              <div
                key={room.id}
                className="group overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-xl"
              >
                {/* Image */}
                <button
                  type="button"
                  onClick={() => setOpenRoomId(room.id)}
                  className="relative block w-full text-left"
                  title="Click to view gallery"
                >
                  <img
                    src={room.image || "/react.svg"}
                    alt={room.name}
                    className="h-64 w-full object-cover bg-gray-200 transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />

                  {/* Badges */}
                  {isPopular(room.id) && (
                    <span className="absolute left-4 top-4 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white shadow">
                      Popular
                    </span>
                  )}

                  <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    View Gallery
                  </span>
                </button>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{room.name}</h3>
                      </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500">From</div>
                      <div className="text-lg font-semibold">
                        {room.currency} {Number(room.price).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">per night</div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {room.desc}
                  </p>

                  {/* Feature chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {chips.slice(0, 4).map((c) => (
                      <Chip key={c}>{c}</Chip>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenRoomId(room.id)}
                      className="rounded-full border border-black/10 bg-white py-2 text-sm font-medium hover:bg-gray-50"
                    >
                      View Photos
                    </button>

                    <Link
                      to={`/bookings?room=${encodeURIComponent(room.name)}`}
                      className="rounded-full bg-black py-2 text-center text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <RoomGalleryModal
        open={!!activeRoom}
        roomName={activeRoom?.name}
        images={activeRoom?.gallery || []}
        onClose={() => setOpenRoomId(null)}
      />
    </section>
  );
}