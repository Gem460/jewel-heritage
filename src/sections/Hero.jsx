import { useEffect, useMemo, useState } from "react";

// Auto-import any jpg/jpeg/png in src/assets/hotel/hero/
const heroModules = import.meta.glob("../assets/hotel/hero/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

export default function Hero() {
  const images = useMemo(() => {
    return Object.entries(heroModules)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, src]) => src);
  }, []);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(t);
  }, [images.length]);

  // If no images found, don't crash
  if (images.length === 0) {
    return (
      <section className="relative h-[90vh] w-full bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold">The Jewel Heritage</div>
          <div className="mt-2 text-sm opacity-80">
            Add hero images to src/assets/hotel/hero/
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {images.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1500 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold">The Jewel Heritage</h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl">
          Experience authentic Bhutanese tradition in the heart of Paro.
        </p>
        <a
          href="#rooms"
          className="mt-8 rounded-full bg-white px-6 py-3 text-black font-semibold hover:bg-gray-200 transition"
        >
          Explore Rooms
        </a>
      </div>
    </section>
  );
}