import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold">About</h1>

        <div className="mt-8 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-semibold">About The Jewel Heritage</h2>

            <p className="mt-4 text-gray-700 leading-relaxed">
              The Jewel Heritage is a newly launched heritage hotel in Paro, built to
              reflect Bhutanese tradition through architecture, interiors, and warm
              hospitality. It’s designed for guests who want a calm, authentic experience.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Whether you’re visiting for a cultural journey, family trip, or a peaceful
              retreat, we offer a comfortable stay with a true sense of Bhutan.
            </p>
          </div>

          <div className="rounded-3xl border bg-gray-50 p-6">
            <h3 className="font-semibold">Highlights</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>• Traditional Bhutanese design with modern comfort</li>
              <li>• Calm environment and welcoming service</li>
              <li>• Ideal base for Paro sightseeing</li>
              <li>• Local food and cultural experience options</li>
            </ul>
          </div>
        </div>

        <div className="my-14 h-px w-full bg-gray-200" />

        <section>
          <p className="text-sm uppercase tracking-wide text-gray-500">Brief History</p>

          <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
            The Spiritual Legacy Behind The Jewel Heritage
          </h2>

          <p className="mt-6 text-gray-700 leading-relaxed">
            The Jewel Heritage stands in Changzima, Paro — the birthplace of Mipham
            Wangpo (Pema Kara), the 56th Je Khenpo of Bhutan. Born in 1864, he later
            served as the spiritual head of Bhutan from 1919 to 1922.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            As Je Khenpo, he guided the Central Monastic Body (Zhung Dratshang),
            strengthening monastic discipline and safeguarding Bhutan’s religious
            traditions during a time of change.
          </p>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Though his tenure lasted only three years, his influence remains deeply
            respected. The Jewel Heritage honors this legacy by preserving Bhutanese
            architecture, values, and warm hospitality — offering guests a stay rooted
            in culture and spiritual tradition.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}