import dining1 from "../assets/hotel/dining-1.jpg";
import reception1 from "../assets/hotel/reception-1.jpg";
import reception2 from "../assets/hotel/reception-2.jpg";

import deluxe1 from "../assets/rooms/deluxe-1.jpg";
import deluxe2 from "../assets/rooms/deluxe-2.jpg";

import standard1 from "../assets/rooms/standard-1.jpg";
import standard2 from "../assets/rooms/standard-2.jpg";
import standard3 from "../assets/rooms/standard-3.jpg";

import suite1 from "../assets/rooms/suite-1.jpg";
import suite2 from "../assets/rooms/suite-2.jpg";
import suite3 from "../assets/rooms/suite-3.jpg";

import museum from "../assets/view/museum.jpg";
import paroView from "../assets/view/paro-view.jpg";

const items = [
  { src: suite1, label: "Suite" },
  { src: suite2, label: "Suite" },
  { src: suite3, label: "Suite" },

  { src: deluxe1, label: "Deluxe Room" },
  { src: deluxe2, label: "Deluxe Room" },

  { src: standard1, label: "Standard Room" },
  { src: standard2, label: "Standard Room" },
  { src: standard3, label: "Standard Room" },

  { src: reception1, label: "Reception" },
  { src: reception2, label: "Reception" },
  { src: dining1, label: "Dining" },

  { src: paroView, label: "View" },
  { src: museum, label: "Surroundings" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">Gallery</h2>
          <p className="mt-2 text-gray-700">
            Rooms, reception, dining, and surroundings at The Jewel Heritage.
          </p>
        </div>
        <a href="#contact" className="text-sm font-medium underline underline-offset-4">
          Enquire / Book
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <figure key={i} className="overflow-hidden rounded-2xl border bg-white">
            <img
              src={it.src}
              alt={it.label}
              className="h-44 md:h-56 w-full object-cover hover:scale-105 transition"
              loading="lazy"
            />
            <figcaption className="px-3 py-2 text-xs text-gray-600">{it.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}