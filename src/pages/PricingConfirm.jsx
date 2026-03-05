import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = b.getTime() - a.getTime();
  const n = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export default function PricingConfirm() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const location = sp.get("location") || "Paro, Bhutan";
  const checkIn = sp.get("checkIn") || "";
  const checkOut = sp.get("checkOut") || "";
  const rooms = Number(sp.get("rooms") || 1);
  const guests = Number(sp.get("guests") || 2);
  const roomType = sp.get("roomType") || "Suite (Double)";

  const nights = useMemo(() => calcNights(checkIn, checkOut), [checkIn, checkOut]);

  const confirm = () => {
    // send them to bookings form WITH the same params
    navigate({
      pathname: "/bookings",
      search: `?${sp.toString()}`,
    });
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-stone-900">
          Pricing & Confirmation
        </h1>
        <p className="mt-2 text-stone-600">
          Review your stay details. We’ll confirm availability and send final pricing by email.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Details */}
          <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-stone-900">Your selection</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Location</span>
                <span className="font-medium text-stone-900">{location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Room type</span>
                <span className="font-medium text-stone-900">{roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Check-in</span>
                <span className="font-medium text-stone-900">{checkIn || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Check-out</span>
                <span className="font-medium text-stone-900">{checkOut || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Nights</span>
                <span className="font-medium text-stone-900">{nights || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Rooms</span>
                <span className="font-medium text-stone-900">{rooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Guests</span>
                <span className="font-medium text-stone-900">{guests}</span>
              </div>
            </div>
          </section>

          {/* Pricing message (no actual rates) */}
          <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-stone-900">Pricing</h2>
            <div className="mt-4 rounded-xl bg-stone-50 border border-stone-200 p-4 text-sm text-stone-700">
              <p className="font-medium text-stone-900">Rates are shared after confirmation.</p>
              <p className="mt-2">
                We will confirm availability and send the final price by email based on your dates,
                room type, and any requests.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(-1)}
                className="rounded-xl px-5 py-3 border border-stone-300 bg-white hover:bg-stone-50 transition font-medium"
              >
                Go back
              </button>
              <button
                onClick={confirm}
                className="rounded-xl px-5 py-3 bg-stone-900 text-white hover:bg-stone-800 transition font-semibold"
              >
                Confirm & Continue
              </button>
            </div>

            <p className="mt-4 text-xs text-stone-500">
              No payment is collected online. Confirmation will be sent by email.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}