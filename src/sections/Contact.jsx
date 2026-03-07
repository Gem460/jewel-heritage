export default function Contact() {
  const whatsappMessage =
    "Hello The Jewel Heritage, I’d like to enquire about room availability and rates.";

  return (
    <section id="contact" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold">Contact</h2>
        <p className="mt-2 text-gray-700">
          Reach us anytime for reservations and enquiries.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border bg-white p-6">
            <h3 className="font-semibold">The Jewel Heritage</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-800">
              <p>
                <span className="font-medium">Location:</span> Paro, Changsima, Bhutan
              </p>
              <p>
                <span className="font-medium">Phone/WhatsApp:</span> +975 16141117
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
                className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                href={`https://wa.me/97516141117?text=${encodeURIComponent(
                  whatsappMessage
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              <a
                className="rounded-full border bg-white px-5 py-2 text-sm font-medium hover:bg-gray-100"
                href="mailto:reservation@thejewelheritage.com"
              >
                Email
              </a>

              <a
                className="rounded-full border bg-white px-5 py-2 text-sm font-medium hover:bg-gray-100"
                href="https://maps.google.com/?q=27.4312994,89.4209188"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6">
            <h3 className="font-semibold">Map</h3>
            <p className="mt-2 text-sm text-gray-700">
              Find us easily in Changsima, Paro.
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border">
              <iframe
                title="The Jewel Heritage Location"
                src="https://www.google.com/maps?q=27.4312994,89.4209188&z=17&output=embed"
                width="100%"
                height="288"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}