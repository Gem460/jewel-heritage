import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { rooms } from "../data/roomsData";

// Auto-load general hotel photos
const generalImages = import.meta.glob(
  "../assets/hotel/general/*.jpg",
  {
    eager: true,
    import: "default",
  }
);

export default function Gallery() {
  const images = useMemo(() => {
    const roomImages = rooms.flatMap((room) => room.gallery || []);
    const extraImages = Object.values(generalImages);

    // Combine everything
    return [...extraImages, ...roomImages];
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);
  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  function close() {
    setActiveIndex(null);
  }

  function next() {
    setActiveIndex((i) => (i + 1) % images.length);
  }

  function prev() {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-24 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="overflow-hidden rounded-2xl"
            >
              <img
                src={img}
                alt=""
                className="h-72 w-full object-cover transition duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <div
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt=""
              className="max-h-[85vh] w-full object-contain"
            />

            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl"
            >
              ‹
            </button>

            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl"
            >
              ›
            </button>

            <button
              onClick={close}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}