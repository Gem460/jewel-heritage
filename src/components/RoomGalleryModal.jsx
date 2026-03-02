import { useEffect, useState } from "react";

export default function RoomGalleryModal({ open, roomName, images = [], onClose }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIndex(0);

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, images.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);

  if (!open) return null;

  const hasMany = images.length > 1;
  const current = images[index];

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <button
        aria-label="Close gallery"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <div className="text-sm text-gray-500">Room Gallery</div>
              <div className="text-lg font-semibold">{roomName}</div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Close ✕
            </button>
          </div>

          {/* Main image */}
          <div className="relative bg-black">
            {current ? (
              <img
                src={current}
                alt={`${roomName} photo ${index + 1}`}
                className="h-[60vh] w-full object-contain"
              />
            ) : (
              <div className="flex h-[60vh] items-center justify-center text-white">
                No photos added yet.
              </div>
            )}

            {/* Arrows */}
            {hasMany && (
              <>
                <button
                  onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold hover:bg-white"
                >
                  ←
                </button>
                <button
                  onClick={() => setIndex((i) => Math.min(i + 1, images.length - 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm font-semibold hover:bg-white"
                >
                  →
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 0 && (
            <div className="bg-white p-3">
              <div className="flex gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setIndex(i)}
                    className={`shrink-0 overflow-hidden rounded-xl border ${
                      i === index ? "border-black" : "border-gray-200"
                    }`}
                    title={`Photo ${i + 1}`}
                  >
                    <img src={src} alt={`thumb ${i + 1}`} className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Tip: Use ← → keys to navigate. Press Esc to close.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}