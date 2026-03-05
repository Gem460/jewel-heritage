// src/pages/Gallery.jsx

// Auto-load ALL images from: src/assets/hotel/general
// Fixes Vite error by matching ONLY normal extensions (jpg/jpeg/png/webp),
// so files like "rec.jpg.JPEG" (double extension) are ignored until you rename them.

const imageModules = import.meta.glob(
  "../assets/hotel/general/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" }
);

// Turn modules into array + sort nicely by filename
const images = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export default function Gallery() {
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
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition"
            >
              <img
                src={src}
                alt={`Jewel Heritage photo ${idx + 1}`}
                loading="lazy"
                className="h-56 md:h-64 w-full object-cover group-hover:scale-[1.03] transition duration-300"
              />
            </figure>
          ))}
        </div>

        {images.length === 0 && (
          <div className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-stone-700">
            <p className="font-medium">No gallery images found.</p>
            <p className="mt-2 text-sm text-stone-600">
              Add photos to <code className="px-2 py-1 bg-white rounded border">src/assets/hotel/general</code>{" "}
              with extensions: <b>.jpg</b>, <b>.jpeg</b>, <b>.png</b>, or <b>.webp</b>.
              <br />
              If you have files like <b>rec.jpg.JPEG</b>, rename them to <b>rec.jpg</b> or <b>rec.jpeg</b>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}