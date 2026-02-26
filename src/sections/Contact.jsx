export default function Contact() {
  return (
    <section id="contact" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Contact</h2>
        <p className="mt-2 text-gray-700">
          Reach us anytime for reservations and enquiries.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl border bg-white p-6">
            <h3 className="font-semibold">The Jewel Heritage</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-800">
              <p>
                <span className="font-medium">Location:</span> Paro, Changsima, Bhutan
              </p>
              <p>
                <span className="font-medium">Phone/WhatsApp:</span> +975 77777567
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a
                  className="underline underline-offset-4"
                  href="mailto:reservation@thejewelheritage.com"
                >
                  reservation@thejewelheritage.com
                </a>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded-full px-5 py-2 text-sm font-medium bg-black text-white hover:opacity-90"
                href={`https://wa.me/97577777567?text=${encodeURIComponent(
                  "Hello The Jewel Heritage, I’d like to enquire about room availability and rates."
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              <a
                className="rounded-full px-5 py-2 text-sm font-medium bg-white border hover:bg-gray-100"
                href="mailto:reservation@thejewelheritage.com"
              >
                Email
              </a>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h3 className="font-semibold">Map</h3>
            <p className="mt-2 text-sm text-gray-700">
              Share your exact Google Maps pin and I’ll embed the live map here.
            </p>
            <div className="mt-4 h-72 rounded-2xl bg-gray-100 grid place-items-center text-sm text-gray-600">
              Map placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}