import Layout from "../components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-semibold text-center">About</h1>
          <p className="text-gray-700 mt-6 leading-relaxed">
            The Jewel Heritage is a traditional Bhutanese heritage hotel in Changsima, Paro,
            offering authentic architecture, warm hospitality, and a peaceful cultural stay.
          </p>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="border rounded-2xl p-6">
              <h2 className="font-semibold text-lg">Our Story</h2>
              <p className="text-gray-700 mt-2">
                Built with Bhutanese tradition in mind, our property preserves heritage design
                while providing modern comfort.
              </p>
            </div>

            <div className="border rounded-2xl p-6">
              <h2 className="font-semibold text-lg">Our Values</h2>
              <p className="text-gray-700 mt-2">
                Authenticity, sustainability, and a memorable guest experience rooted in culture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}