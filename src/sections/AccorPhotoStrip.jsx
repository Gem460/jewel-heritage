import hero1 from "../assets/hotel/hero/hero-1.jpg";
import hero2 from "../assets/hotel/hero/hero-2.jpg";
import hero3 from "../assets/hotel/hero/hero-3.jpg";

export default function AccorPhotoStrip({ onOpenGallery }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 overflow-hidden rounded-2xl">
            <img src={hero1} alt="Jewel Heritage" className="h-[260px] md:h-[320px] w-full object-cover" />
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-2xl">
              <img src={hero2} alt="Dining" className="h-[152px] w-full object-cover" />
            </div>

            <button
              onClick={onOpenGallery}
              className="relative overflow-hidden rounded-2xl text-left"
            >
              <img src={hero3} alt="More photos" className="h-[152px] w-full object-cover" />
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">View Photos</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}