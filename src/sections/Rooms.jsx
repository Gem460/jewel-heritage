import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import rooms from "../data/roomsData.js";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Rooms() {
  const query = useQuery();
  const q = (query.get("q") || "").toLowerCase();

  const [openRoom, setOpenRoom] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  const filtered = useMemo(() => {
    if (!q) return rooms;
    return rooms.filter((r) =>
      [r.name, r.desc, r.bed, r.size]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [q]);

  function openImages(room) {
    setOpenRoom(room);
    setImgIndex(0);
  }

  function closeModal() {
    setOpenRoom(null);
    setImgIndex(0);
  }

  const checkIn = "2026-03-05";
  const checkOut = "2026-03-08";
  const adults = 1;
  const roomsCount = 1;

  return (
    <section id="rooms" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold text-center">Our Rooms</h2>
        <p className="text-center text-gray-600 mt-2">
          Traditional Bhutanese comfort with modern hospitality.
        </p>

        {q && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Showing results for: <span className="font-medium">{q}</span>
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {filtered.map((room) => (
            <article
              key={room.id}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={room.image}
                  alt={room.name}
                  className="h-52 w-full object-cover"
                />
                <button
                  onClick={() => openImages(room)}
                  className="absolute bottom-3 right-3 px-3 py-2 rounded-lg bg-white/90 backdrop-blur text-sm font-medium border hover:bg-white"
                  type="button"
                >
                  View Images
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {room.short || "A warm, authentic stay in Paro."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openImages(room)}
                    className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
                    type="button"
                  >
                    View Images
                  </button>

                  <Link
                    to={`/pricing?room=${encodeURIComponent(
  room.id
)}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&rooms=${roomsCount}`}
                    className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium text-center hover:opacity-90"
                  >
                    Book This
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal */}
      {openRoom && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <h4 className="font-semibold">{openRoom.name}</h4>
                <p className="text-xs text-gray-500">Room photos</p>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border hover:bg-gray-50"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <div className="relative">
                <img
                  src={(openRoom.images && openRoom.images[imgIndex]) || openRoom.image}
                  alt={`${openRoom.name} ${imgIndex + 1}`}
                  className="w-full h-[380px] object-cover rounded-xl"
                />

                {/* Prev/Next */}
                {openRoom.images && openRoom.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setImgIndex((i) =>
                          i === 0 ? openRoom.images.length - 1 : i - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border hover:bg-white"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setImgIndex((i) =>
                          i === openRoom.images.length - 1 ? 0 : i + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 border hover:bg-white"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {openRoom.images && openRoom.images.length > 0 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                  {openRoom.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setImgIndex(i)}
                      className={`shrink-0 border rounded-lg overflow-hidden ${
                        i === imgIndex ? "ring-2 ring-black/40" : ""
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${openRoom.name} thumb ${i + 1}`}
                        className="h-16 w-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}