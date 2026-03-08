import { useEffect, useRef, useState } from "react";

// Auto-load ALL images from: src/assets/hotel/general
const imageModules = import.meta.glob(
  "../assets/hotel/general/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" }
);

// Turn modules into array + sort nicely by filename
const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const showPrev = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const showNext = () => {
    setSelectedIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        showNext(); // swipe left
      } else {
        showPrev(); // swipe right
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;

      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedIndex]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-stone-900">
              Photo Gallery
            </h1>
            <p className="mt-2 text-stone-600">
              Explore The Jewel Heritage — traditional Bhutanese charm in Paro.
            </p>
          </div>

          <div className="text-sm text-stone-500">
            {images.length} photo{images.length === 1 ? "" : "s"}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, idx) => (
            <figure
              key={idx}
              onClick={() => openLightbox(idx)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <img
                src={src}
                alt={`Jewel Heritage photo ${idx + 1}`}
                loading="lazy"
                className="h-56 md:h-64 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </figure>
          ))}
        </div>

        {images.length === 0 && (
          <div className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-stone-700">
            <p className="font-medium">No gallery images found.</p>
            <p className="mt-2 text-sm text-stone-600">
              Add photos to{" "}
              <code className="rounded border bg-white px-2 py-1">
                src/assets/hotel/general
              </code>{" "}
              with extensions: <b>.jpg</b>, <b>.jpeg</b>, <b>.png</b>, or{" "}
              <b>.webp</b>.
              <br />
              If you have files like <b>rec.jpg.JPEG</b>, rename them to{" "}
              <b>rec.jpg</b> or <b>rec.jpeg</b>.
            </p>
          </div>
        )}
      </div>

      {selectedIndex !== null && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
          onClick={closeLightbox}
        >
          <div
            className="relative flex w-full max-w-6xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-2 top-2 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition hover:bg-black/60 md:right-4 md:top-4"
              aria-label="Close gallery"
            >
              ×
            </button>

            <button
              onClick={showPrev}
              className="absolute left-2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-3xl text-white backdrop-blur-sm transition hover:bg-black/60 md:left-4"
              aria-label="Previous image"
            >
              ‹
            </button>

            <img
              src={images[selectedIndex]}
              alt={`Enlarged Jewel Heritage photo ${selectedIndex + 1}`}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              onClick={showNext}
              className="absolute right-2 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-3xl text-white backdrop-blur-sm transition hover:bg-black/60 md:right-4"
              aria-label="Next image"
            >
              ›
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}