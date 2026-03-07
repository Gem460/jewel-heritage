import hero from "../assets/hotel/hero/hero-2.jpg";
import jeKhenpo56 from "../assets/history/je-khenpo-56.jpg";

export default function About() {
  return (
    <div className="bg-white">

      {/* Hero Banner */}
      <section className="relative h-[50vh] flex items-center justify-center text-center">
        <img
          src={hero}
          alt="The Jewel Heritage"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative text-white px-4">
          <h1 className="text-4xl md:text-5xl font-semibold">
            History of The Jewel Heritage
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/90">
            A heritage home connected to the spiritual legacy of Bhutan.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">

        <h2 className="text-3xl font-semibold text-center">
          The 56th Je Khenpo of Bhutan
        </h2>

        {/* Profile Section */}
        <div className="mt-10 grid md:grid-cols-[220px_1fr] gap-6 items-center">

          {/* Profile Image */}
          <div className="flex flex-col items-center text-center">
            <img
             src={jeKhenpo56}
             alt="Mipham Wangpo - 56th Je Khenpo"
             className="w-48 h-48 object-contain rounded-full border-4 border-gray-200 shadow-md bg-white"
          />

          <p className="text-sm text-gray-500 mt-3">
            Mipham Wangpo (Pema Kara)<br/>
            56th Je Khenpo of Bhutan (1919–1922)
          </p>
        </div>

          {/* Intro Text */}
          <div className="text-gray-700 leading-relaxed max-w-2xl">
            <p>
              The 56th Je Khenpo of Bhutan was <strong>Mipham Wangpo</strong>
              (also known as <strong>Pema Kara</strong>), who served as the
              spiritual head of Bhutan from <strong>1919 to 1922</strong>.
            </p>

            <p className="mt-4">
              He was born in <strong>1864 (Wood Rooster year)</strong> in
              <strong> Chang Sima under Paro Dzongkhag</strong>, the very area
              where The Jewel Heritage stands today.
            </p>
          </div>

        </div>

        {/* Story Grid */}
        <div className="grid md:grid-cols-2 gap-10 mt-16">

          <div>
            <h3 className="text-xl font-semibold">
              Early Life and Monastic Training
            </h3>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Mipham Wangpo was born into a family with a strong spiritual
              heritage connected with the Drukpa Kagyu lineage. From a young
              age he demonstrated remarkable intellectual and spiritual
              abilities.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              His early life was dedicated to rigorous monastic training where
              he mastered Buddhist scriptures, rituals, and philosophical
              studies. His education included deep study of Buddhist philosophy,
              logic, and extensive ritual practices of the Drukpa Kagyu school.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              Ascension to Je Khenpo
            </h3>

            <p className="mt-4 text-gray-700 leading-relaxed">
              The ascension to the position of Je Khenpo is one of the most
              significant events in Bhutan’s monastic tradition. Mipham
              Wangpo’s appointment in 1919 reflected his deep spiritual
              knowledge and the respect he commanded among his peers.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              As Je Khenpo, he led religious ceremonies and also played an
              important role in advising the King and government on spiritual
              matters.
            </p>
          </div>

        </div>

        {/* Contributions */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-center">
            Contributions and Legacy
          </h3>

          <p className="mt-6 text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            During his tenure, Mipham Wangpo strengthened the monastic
            community and ensured the continuation of Bhutan’s religious
            traditions. His leadership helped maintain the integrity of
            Bhutan’s monastic institutions while promoting education,
            discipline, and spiritual practice.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            Although his tenure lasted only three years, his influence on
            Bhutanese spiritual life remains significant. His legacy continues
            to represent dedication to Bhutan’s cultural and religious
            heritage.
          </p>
        </div>

      </section>

    </div>
  );
}