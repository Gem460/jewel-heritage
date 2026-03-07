// src/sections/Location.jsx

export default function Location() {
  return (
    <section id="location" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Find Us in Paro</h2>
          <p className="mt-2 text-gray-600">
            Located in Changsima, Paro — surrounded by stunning valley views.
          </p>
        </div>

        {/* Address + Actions */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 rounded-3xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">The Jewel Heritage Hotel</h3>
            <p className="mt-3 text-sm text-gray-700">
              Changsima, Paro, Bhutan
            </p>

            <div className="mt-5 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Phone/WhatsApp:</span>{" "}
                <a
                  href="https://wa.me/97516141117"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  +975 16141117
                </a>
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a
                  href="mailto:reservation@thejewelheritage.com"
                  className="underline underline-offset-4"
                >
                  reservation@thejewelheritage.com
                </a>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.google.com/maps?q=The+jewel+heritage+Paro+Bhutan"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-xs font-medium text-white hover:opacity-90"
              >
                Get Directions
              </a>

              <a
                href="https://wa.me/97516141117?text=Hi%20The%20Jewel%20Heritage%2C%20I%20want%20to%20book%20a%20room.%20Please%20share%20availability."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border px-5 py-2 text-xs font-medium hover:bg-gray-50"
              >
                WhatsApp Us
              </a>
            </div>

            <p className="mt-4 text-[11px] text-gray-500">
              Tip: Tap “Get Directions” to open Google Maps on mobile.
            </p>
          </div>

          {/* Map */}
          <div className="md:col-span-2 rounded-3xl overflow-hidden border shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3541.2185333108223!2d89.418343873616!3d27.431299376341858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e19d001e2fbf4f%3A0x5838682a7c8b3835!2sThe%20jewel%20heritage!5e0!3m2!1sen!2sau!4v1772087486855!5m2!1sen!2sau"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Jewel Heritage Hotel Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}