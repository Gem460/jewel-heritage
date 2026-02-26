import paroView from "../assets/view/paro-view.jpg";

export default function Hero() {
  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${paroView})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide">
          The Jewel Heritage Hotel
        </h1>

        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
          Experience the Soul of Bhutan in the Heart of Paro
        </p>

        <button className="mt-8 rounded-full bg-[#7A1C1C] px-8 py-3 text-sm font-medium hover:opacity-90">
          Book Your Stay
        </button>
      </div>
    </section>
  );
}